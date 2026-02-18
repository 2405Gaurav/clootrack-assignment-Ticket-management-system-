from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.db.models.functions import TruncDate

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_queryset(self):
        qs = Ticket.objects.all()

        category = self.request.query_params.get("category")
        priority = self.request.query_params.get("priority")
        status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if category:
            qs = qs.filter(category=category)

        if priority:
            qs = qs.filter(priority=priority)

        if status:
            qs = qs.filter(status=status)

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