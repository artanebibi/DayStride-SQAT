from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Create 2 test users in the auth table"

    def handle(self, *args, **kwargs):

        users_to_create = [
            {"username": "user", "email": "user@example.com", "password": "user"},
            {"username": "test", "email": "test@example.com", "password": "test"},
        ]

        for user_data in users_to_create:
            if not User.objects.filter(username=user_data["username"]).exists():
                User.objects.create_user(**user_data)
                self.stdout.write(self.style.SUCCESS(f"Created user {user_data['username']}"))
            else:
                self.stdout.write(self.style.WARNING(f"User {user_data['username']} already exists"))

        self.stdout.write(self.style.SUCCESS("Done creating test users."))
