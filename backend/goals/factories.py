import factory
from datetime import date

from goals.models import Goal
from app.factories import UserFactory


class GoalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Goal

    owner = factory.SubFactory(UserFactory)
    name = factory.Sequence(lambda n: f"Test Goal {n}")
    description = "Test Description"
    end_date = date(2026, 6, 26)
    location = "Default Location"
    is_public = True
