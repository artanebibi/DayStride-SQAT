import pytest
from django.test import RequestFactory
from habits.models import Habit, HabitLog
from habits.serializers import HabitSerializer, HabitLogSerializer
from habits.factories import UserFactory, HabitFactory, HabitLogFactory
from datetime import date, time

pytestmark = pytest.mark.unit

# ----------------------- MODEL TESTS -----------------------

@pytest.mark.django_db
def test_create_habit_model():
    habit = HabitFactory(name="Morning Run", completed=True)
    assert habit.name == "Morning Run"
    assert habit.description == "Test Description"
    assert habit.completed is True
    assert isinstance(habit.user.id, int)

@pytest.mark.django_db
def test_create_habit_log_model():
    habit_log = HabitLogFactory()
    assert isinstance(habit_log.habit, Habit)
    assert isinstance(habit_log.date, date)
    assert isinstance(habit_log.time, time)

# ----------------------- SERIALIZER TESTS -----------------------

@pytest.mark.django_db
def test_habit_serializer_valid_data():
    habit = HabitFactory(name="Drink Water", completed=False)
    serializer = HabitSerializer(habit)
    data = serializer.data

    assert data["name"] == "Drink Water"
    assert data["description"] == "Test Description"
    assert data["completed"] is False
    assert data["user"] == habit.user.id

@pytest.mark.django_db
def test_habit_serializer_invalid_data():
    user = UserFactory()
    invalid_data = {
        "user": user.id,
        "name": "",  # invalid: required
    }
    serializer = HabitSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "name" in serializer.errors

@pytest.mark.django_db
def test_habit_serializer_partial_update():
    habit = HabitFactory(name="Test Habit", completed=False)
    data = {"completed": True}
    serializer = HabitSerializer(habit, data=data, partial=True)
    assert serializer.is_valid(), serializer.errors
    updated_habit = serializer.save()

    assert updated_habit.completed is True
    assert updated_habit.name == "Test Habit"

@pytest.mark.django_db
def test_habit_log_serializer_with_nested_habit():
    habit_log = HabitLogFactory()
    serializer = HabitLogSerializer(habit_log)
    data = serializer.data

    assert data["habit"]["id"] == habit_log.habit.id
    assert data["habit"]["name"] == habit_log.habit.name
    assert data["date"] == habit_log.date.strftime("%Y-%m-%d")
    assert data["time"] == habit_log.time.strftime("%H:%M:%S")
