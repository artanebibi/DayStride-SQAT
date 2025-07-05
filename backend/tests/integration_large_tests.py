import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from datetime import date, timedelta

pytestmark = [pytest.mark.integration_large, pytest.mark.django_db]

class TestAPILargeIntegration:

    @pytest.fixture(autouse=True)
    def setup_class_fixtures(cls, transactional_db):
        cls.client = APIClient()

        cls.user_obj = User.objects.create_user(username="largeruser", password="password123")

        cls.login_url = reverse('token_obtain_pair')
        cls.refresh_url = reverse('token_refresh')

        res = cls.client.post(cls.login_url, {
            "username": "largeruser",
            "password": "password123"
        })
        assert res.status_code == 200

        cls.token = res.data['access']
        cls.refresh_token = res.data['refresh']
        cls.client.credentials(HTTP_AUTHORIZATION=f'Bearer {cls.token}')

    def test_jwt_token_refresh(self):
        res = self.client.post(self.refresh_url, {"refresh": self.refresh_token})
        assert res.status_code == 200
        assert "access" in res.data

    def test_create_and_retrieve_goal(self):
        payload = {
            "name": "Integration Large Goal",
            "description": "Testing goal creation",
            "end_date": (date.today() + timedelta(days=10)).isoformat(),
            "location": "Test Location",
            "is_public": True
        }
        res = self.client.post('/api/goals/', payload, format='json')
        assert res.status_code == 201
        goal_id = res.data['id']

        res = self.client.get(f'/api/goals/{goal_id}/')
        assert res.status_code == 200
        assert res.data['name'] == "Integration Large Goal"

    def test_list_my_goals(self):
        res = self.client.get('/api/goals/my/')
        assert res.status_code == 200
        assert isinstance(res.data, list)

    def test_create_and_retrieve_habit(self):
        payload = {
            "name": "Integration Large Habit",
            "description": "Testing habit creation"
        }
        res = self.client.post('/api/habits/', payload, format='json')
        assert res.status_code == 201
        habit_id = res.data['id']

        res = self.client.get(f'/api/habits/{habit_id}/')
        assert res.status_code == 200
        assert res.data['name'] == "Integration Large Habit"

    def test_create_and_retrieve_todo(self):
        payload = {
            "name": "Integration Large Todo",
            "category": "Testing",
            "description": "Testing todo creation",
            "due_date": (date.today() + timedelta(days=5)).isoformat(),
            "due_time": "09:00",
            "priority": 2,
            "completed": False
        }
        res = self.client.post('/api/todos/', payload, format='json')
        assert res.status_code == 201
        todo_id = res.data['id']

        res = self.client.get(f'/api/todos/{todo_id}/')
        assert res.status_code == 200
        assert res.data['name'] == "Integration Large Todo"

    def test_dashboard_aggregation(self):
        res = self.client.get('/api/dashboard/')
        assert res.status_code == 200
        assert "habits" in res.data
        assert "todos" in res.data
        assert "goals" in res.data

    def test_join_and_leave_goal(self):
        payload = {
            "name": "Joinable Goal",
            "description": "Testing join and leave",
            "end_date": (date.today() + timedelta(days=10)).isoformat(),
            "location": "Join Location",
            "is_public": True
        }
        res = self.client.post('/api/goals/', payload, format='json')
        assert res.status_code == 201
        goal_id = res.data['id']

        res = self.client.post('/api/goals/join/', {"goal": goal_id}, format='json')
        assert res.status_code == 201
        assert res.data['detail'] == "Goal successfully added to user."

        res = self.client.post('/api/goals/leave/', {"goal": goal_id}, format='json')
        assert res.status_code == 200
        assert res.data['detail'] == "UserGoal successfully removed "
