import os
import json
import google.generativeai as genai

from django.db.models import Q, Count, Avg
from django.db.models.functions import TruncDate

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_queryset(self):
        qs = super().get_queryset()

        category = self.request.query_params.get("category")
        priority = self.request.query_params.get("priority")
        status_param = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if category:
            qs = qs.filter(category=category)

        if priority:
            qs = qs.filter(priority=priority)

        if status_param:
            qs = qs.filter(status=status_param)

        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return qs


@api_view(["GET"])
def ticket_stats(request):
    total_tickets = Ticket.objects.count()

    open_tickets = Ticket.objects.filter(status="open").count()

    avg_per_day = (
        Ticket.objects
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
        .aggregate(avg=Avg("count"))
    )["avg"] or 0

    priority_data = (
        Ticket.objects
        .values("priority")
        .annotate(count=Count("id"))
    )

    category_data = (
        Ticket.objects
        .values("category")
        .annotate(count=Count("id"))
    )

    priority_breakdown = {
        item["priority"]: item["count"]
        for item in priority_data
    }

    category_breakdown = {
        item["category"]: item["count"]
        for item in category_data
    }

    return Response({
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "avg_tickets_per_day": round(avg_per_day, 2),
        "priority_breakdown": priority_breakdown,
        "category_breakdown": category_breakdown
    })


@api_view(["POST"])
def classify_ticket(request):
    description = request.data.get("description")

    if not description:
        return Response(
            {"error": "Description is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return Response(
                {"error": "Gemini API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config={
                "response_mime_type": "application/json"
            }
        )

        prompt = f"""
You are a support ticket classifier.

Categories: billing, technical, account, general
Priorities: low, medium, high, critical

Return ONLY JSON in this format:
{{
  "category": "...",
  "priority": "..."
}}

Description:
\"\"\"{description}\"\"\"
"""

        response = model.generate_content(prompt)
        content = response.text.strip()

        # Safe JSON extraction
        start = content.find("{")
        end = content.rfind("}") + 1

        if start == -1 or end == -1:
            raise ValueError("Invalid JSON response from Gemini")

        json_str = content[start:end]
        parsed = json.loads(json_str)

        return Response({
            "suggested_category": parsed.get("category"),
            "suggested_priority": parsed.get("priority")
        })

    except Exception:
        return Response({
            "suggested_category": None,
            "suggested_priority": None
        }, status=status.HTTP_200_OK)