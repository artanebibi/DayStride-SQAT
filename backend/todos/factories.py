import factory
from todos.models import TodoTask
from app.factories import UserFactory

class TodoTaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TodoTask

    user = factory.SubFactory(UserFactory)
    name = factory.Sequence(lambda n: f"Todo Task {n}")
    category = "General"
    description = "Test Description"
    priority = 3
    completed = False
