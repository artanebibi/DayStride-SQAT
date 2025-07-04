import factory
from django.contrib.auth.models import User
from habits.models import Habit, HabitLog
from app.factories import UserFactory


class HabitFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Habit

    user = factory.SubFactory(UserFactory)
    name = factory.Sequence(lambda n: f"Habit {n}")
    description = "Test Description"
    completed = False


class HabitLogFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = HabitLog

    habit = factory.SubFactory(HabitFactory)
    date = factory.Faker("date_this_year")
    time = factory.Faker("time_object")
