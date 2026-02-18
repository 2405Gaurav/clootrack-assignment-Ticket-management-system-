from rest_framework import viewsets
from django.db.models import Q
from rest_framework.request import Request
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