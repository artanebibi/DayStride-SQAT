import pytest
from datetime import date

from django.test import RequestFactory

from goals.models import Goal, UserGoal
from goals.serializers import GoalSerializer, UserGoalSerializer

from app.factories import UserFactory
from goals.factories import GoalFactory
pytestmark = pytest.mark.unit

# ---------------------- Model Tests ----------------------

@pytest.mark.django_db
def test_create_goal_model():
    goal = GoalFactory(
        name="Test Goal",
        description="Test Description",
        end_date=date(2026, 6, 26),
        location="New York",
        is_public=True,
    )
    assert goal.name == "Test Goal"
    assert goal.description == "Test Description"
    assert goal.end_date == date(2026, 6, 26)
    assert goal.location == "New York"
    assert goal.is_public is True
    assert goal.owner is not None

@pytest.mark.django_db
def test_create_user_goal_model():
    user = UserFactory()
    goal = GoalFactory(owner=user, location="Berlin")
    user_goal = UserGoal.objects.create(user=user, goal=goal)
    assert user_goal.user == user
    assert user_goal.goal == goal
    assert user_goal.joined_at is not None

# ---------------------- Serializer Tests ----------------------

@pytest.mark.django_db
def test_goal_serializer_valid_read_data():
    goal = GoalFactory(
        name="Serialize Goal",
        description="Goal Description",
        end_date=date(2026, 6, 26),
        location="Tokyo",
        is_public=True
    )
    serializer = GoalSerializer(goal, context={'request': None})
    data = serializer.data
    assert data["name"] == "Serialize Goal"
    assert data["description"] == "Goal Description"
    assert data["end_date"] == "2026-06-26"
    assert data["location"] == "Tokyo"
    assert data["is_public"] is True
    assert "is_owner" in data

@pytest.mark.django_db
def test_goal_serializer_create_valid_data():
    user = UserFactory()
    valid_data = {
        "name": "Created via Serializer",
        "description": "Created using serializer test",
        "end_date": "2026-06-26",
        "location": "Seoul",
        "is_public": True
    }
    serializer = GoalSerializer(data=valid_data)
    assert serializer.is_valid(), serializer.errors
    goal = serializer.save(owner=user)
    assert Goal.objects.filter(id=goal.id).exists()
    assert goal.name == "Created via Serializer"
    assert goal.owner == user

@pytest.mark.django_db
def test_goal_serializer_invalid_missing_fields():
    invalid_data = {
        "description": "Missing name and end_date",
        "location": "Paris"
    }
    serializer = GoalSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "name" in serializer.errors
    assert "end_date" in serializer.errors

@pytest.mark.django_db
def test_goal_serializer_invalid_end_date_format():
    invalid_data = {
        "name": "Date Format Test",
        "description": "Checking invalid date",
        "end_date": "26/06/2026",  # Invalid format
        "location": "Sydney",
    }
    serializer = GoalSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "end_date" in serializer.errors

@pytest.mark.django_db
def test_goal_serializer_partial_update():
    goal = GoalFactory(
        name="Partial Update Goal",
        description="Initial Desc",
        end_date=date(2026, 6, 26),
        location="Toronto",
        is_public=False
    )
    update_data = {"is_public": True, "description": "Updated Desc"}
    serializer = GoalSerializer(goal, data=update_data, partial=True)
    assert serializer.is_valid(), serializer.errors
    updated_goal = serializer.save()
    assert updated_goal.is_public is True
    assert updated_goal.description == "Updated Desc"
    assert updated_goal.name == "Partial Update Goal"

@pytest.mark.django_db
def test_user_goal_serializer_valid_read_data():
    goal = GoalFactory(name="User Goal", description="Join goal test", location="Rome")
    user = goal.owner
    user_goal = UserGoal.objects.create(user=user, goal=goal)
    serializer = UserGoalSerializer(user_goal)
    data = serializer.data
    assert data["user"] == user.id
    assert data["goal"] == goal.id

@pytest.mark.django_db
def test_user_goal_serializer_create_valid_data():
    user = UserFactory()
    goal = GoalFactory(owner=user)
    valid_data = {
        "user": user.id,
        "goal": goal.id
    }
    serializer = UserGoalSerializer(data=valid_data)
    assert serializer.is_valid(), serializer.errors
    user_goal = serializer.save()
    assert UserGoal.objects.filter(id=user_goal.id).exists()
    assert user_goal.user == user
    assert user_goal.goal == goal

@pytest.mark.django_db
def test_goal_serializer_get_is_owner_true():
    goal = GoalFactory(
        name="Ownership Goal",
        description="Test ownership True",
        location="Pristina"
    )
    user = goal.owner
    factory = RequestFactory()
    request = factory.get("/")
    request.user = user
    serializer = GoalSerializer(goal, context={'request': request})
    data = serializer.data
    assert data["is_owner"] is True

@pytest.mark.django_db
def test_user_goal_serializer_invalid_data():
    invalid_data = {
        "user": None,
        "goal": None
    }
    serializer = UserGoalSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "user" in serializer.errors
    assert "goal" in serializer.errors
