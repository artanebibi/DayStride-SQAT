import pytest
from datetime import date, time

from todos.models import TodoTask
from todos.serializers import TodoTaskSerializer
from todos.factories import TodoTaskFactory
from app.factories import UserFactory

pytestmark = pytest.mark.unit


@pytest.mark.django_db
def test_create_todo_task_model():
    task = TodoTaskFactory(name="Test Task", category="Work", priority=1, completed=False)
    assert task.name == "Test Task"
    assert task.category == "Work"
    assert task.description == "Test Description"
    assert task.priority == 1
    assert task.completed is False
    assert task.user is not None


@pytest.mark.django_db
def test_todo_task_serializer_valid_data():
    task = TodoTaskFactory(name="Serialize Task", category="Study", description="Testing serializer", priority=2,
                           completed=True)
    serializer = TodoTaskSerializer(task)
    data = serializer.data
    assert data["name"] == "Serialize Task"
    assert data["category"] == "Study"
    assert data["description"] == "Testing serializer"
    assert data["priority"] == 2
    assert data["completed"] is True
    assert data["user"] == task.user.id


@pytest.mark.django_db
def test_todo_task_serializer_invalid_data():
    user = UserFactory()
    invalid_data = {
        "user": user.id,
        "name": "",  # Invalid
        "priority": 5  # Invalid
    }
    serializer = TodoTaskSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "name" in serializer.errors
    assert "priority" in serializer.errors


@pytest.mark.django_db
def test_todo_task_str_completed_false():
    task = TodoTaskFactory(name="Task String Test", completed=False)
    assert str(task) == "Task String Test (pending)"


@pytest.mark.django_db
def test_todo_task_str_completed_true():
    task = TodoTaskFactory(name="Task String Test", completed=True)
    assert str(task) == "Task String Test (done)"


@pytest.mark.django_db
def test_create_todo_task_with_minimal_fields():
    task = TodoTaskFactory(category=None, description=None, due_date=None, due_time=None)
    assert task.name.startswith("Todo Task")
    assert task.category is None
    assert task.description is None
    assert task.due_date is None
    assert task.due_time is None
    assert task.priority == 3
    assert task.completed is False


@pytest.mark.django_db
def test_todo_task_serializer_with_due_date_and_time():
    task = TodoTaskFactory(
        name="DateTime Task",
        due_date=date(2026, 6, 26),
        due_time=time(14, 30)
    )
    serializer = TodoTaskSerializer(task)
    data = serializer.data
    assert data["name"] == "DateTime Task"
    assert data["due_date"] == "2026-06-26"
    assert data["due_time"] == "14:30:00"
    assert data["priority"] == 3


@pytest.mark.django_db
def test_todo_task_serializer_invalid_due_date_format():
    user = UserFactory()
    invalid_data = {
        "user": user.id,
        "name": "Invalid Date Task",
        "due_date": "26/06/2026",  # Invalid format
        "priority": 2
    }
    serializer = TodoTaskSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "due_date" in serializer.errors


@pytest.mark.django_db
def test_todo_task_serializer_invalid_due_time_format():
    user = UserFactory()
    invalid_data = {
        "user": user.id,
        "name": "Invalid Time Task",
        "due_time": "25:61",  # Invalid format
        "priority": 2
    }
    serializer = TodoTaskSerializer(data=invalid_data)
    assert serializer.is_valid() is False
    assert "due_time" in serializer.errors


@pytest.mark.django_db
def test_todo_task_serializer_partial_update():
    task = TodoTaskFactory(name="Initial Task", completed=False)
    data = {"completed": True}
    serializer = TodoTaskSerializer(task, data=data, partial=True)
    assert serializer.is_valid(), serializer.errors
    updated_task = serializer.save()
    assert updated_task.completed is True
    assert updated_task.name == "Initial Task"


@pytest.mark.django_db
@pytest.mark.parametrize("priority_value", [1, 2, 3])
def test_todo_task_serializer_valid_priority_values(priority_value):
    user = UserFactory()
    valid_data = {
        "user": user.id,
        "name": f"Priority {priority_value} Task",
        "priority": priority_value
    }
    serializer = TodoTaskSerializer(data=valid_data)
    assert serializer.is_valid(), serializer.errors
    task = serializer.save(user=user)
    assert task.priority == priority_value
