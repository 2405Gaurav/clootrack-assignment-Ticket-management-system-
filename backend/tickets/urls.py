from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, ticket_stats

router = DefaultRouter()
router.register(r"tickets", TicketViewSet, basename="tickets")

urlpatterns = [
    path("tickets/stats/", ticket_stats),
]

urlpatterns += router.urls