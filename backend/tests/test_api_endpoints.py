import pytest
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from datetime import date, timedelta

from goals.factories import GoalFactory
from goals.models import Goal, UserGoal
from todos.factories import TodoTaskFactory
from habits.factories import HabitFactory


pytestmark = [pytest.mark.integration_small, pytest.mark.api]
class APICRUDTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="testuser", password="password123")
        cls.login_url = reverse('token_obtain_pair')
        cls.refresh_url = reverse('token_refresh')
        cls.register_url = reverse('register')

    def setUp(self):
        self.client = APIClient()
        res = self.client.post(self.login_url, {"username": "testuser", "password": "password123"})
        assert res.status_code == 200
        self.token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    # === AUTH ===
    def test_post_token_obtain_pair(self):
        res = self.client.post(self.login_url, {"username": "testuser", "password": "password123"})
        assert res.status_code == 200
        assert "access" in res.data and "refresh" in res.data

    def test_post_token_refresh(self):
        res = self.client.post(self.login_url, {"username": "testuser", "password": "password123"})
        refresh_token = res.data["refresh"]
        res = self.client.post(self.refresh_url, {"refresh": refresh_token})
        assert res.status_code == 200
        assert "access" in res.data

    def test_register_user(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword123"
        }
        res = self.client.post(self.register_url, payload, format='json')
        assert res.status_code == 201
        assert res.data["username"] == "newuser"

    # === DASHBOARD ===
    def test_get_dashboard(self):
        res = self.client.get('/api/dashboard/')
        assert res.status_code == 200
        assert "username" in res.data

    # === GOALS  ===
    def test_post_create_goal(self):
        payload = {
            "name": "Factory Goal",
            "description": "Using factories",
            "end_date": (date.today() + timedelta(days=7)).isoformat(),
            "location": "Skopje",
            "is_public": True
        }
        res = self.client.post('/api/goals/', payload, format='json')
        assert res.status_code == 201
        self.goal_id = res.data["id"]

    def test_get_goal_list(self):
        GoalFactory(owner=self.user)
        res = self.client.get('/api/goals/')
        assert res.status_code == 200

    def test_get_goal_detail(self):
        goal = GoalFactory(owner=self.user)
        res = self.client.get(f'/api/goals/{goal.id}/')
        assert res.status_code == 200

    def test_put_goal_update(self):
        goal = GoalFactory(owner=self.user)
        payload = {
            "name": "Updated Goal",
            "description": "Updated using factories",
            "end_date": (date.today() + timedelta(days=10)).isoformat(),
            "location": "Tetovo",
            "is_public": False
        }
        res = self.client.put(f'/api/goals/{goal.id}/', payload, format='json')
        assert res.status_code == 200

    def test_patch_goal_partial_update(self):
        goal = GoalFactory(owner=self.user)
        payload = {"name": "Partially Updated Goal"}
        res = self.client.patch(f'/api/goals/{goal.id}/', payload, format='json')
        assert res.status_code == 200
        assert res.data["name"] == "Partially Updated Goal"

    def test_get_goals_my(self):
        GoalFactory(owner=self.user)
        res = self.client.get('/api/goals/my/')
        assert res.status_code == 200

    def test_post_goal_join(self):
        otherGoal = GoalFactory.create()
        res = self.client.post("/api/goals/join/", {"goal": otherGoal.id})
        assert res.status_code == 201
        assert res.data["detail"] == "Goal successfully added to user."

    def test_post_goal_leave(self):
        otherGoal = GoalFactory.create()
        UserGoal.objects.create(goal_id=otherGoal.id, user=self.user)

        res = self.client.post('/api/goals/leave/', {"goal": otherGoal.id}, format='json')

        assert res.status_code == 200
        assert res.data["detail"] == "UserGoal successfully removed "

    def test_delete_goal(self):
        goal = GoalFactory(owner=self.user)
        res = self.client.delete(f'/api/goals/{goal.id}/')
        assert res.status_code == 204

    # === TODOS ===
    def test_post_create_todo(self):
        payload = {
            "name": "Factory Todo",
            "category": "Work",
            "description": "Created via API",
            "due_date": (date.today() + timedelta(days=3)).isoformat(),
            "due_time": "14:00",
            "priority": 2,
            "completed": False
        }
        res = self.client.post('/api/todos/', payload, format='json')
        assert res.status_code == 201

    def test_get_todo_list(self):
        TodoTaskFactory(user=self.user)
        res = self.client.get('/api/todos/')
        assert res.status_code == 200

    def test_get_todo_detail(self):
        todo = TodoTaskFactory(user=self.user)
        res = self.client.get(f'/api/todos/{todo.id}/')
        assert res.status_code == 200

    def test_put_todo_update(self):
        todo = TodoTaskFactory(user=self.user)
        payload = {
            "name": "Updated Todo",
            "category": "Study",
            "description": "Updated via API",
            "due_date": (date.today() + timedelta(days=5)).isoformat(),
            "due_time": "16:00",
            "priority": 1,
            "completed": True
        }
        res = self.client.put(f'/api/todos/{todo.id}/', payload, format='json')
        assert res.status_code == 200

    def test_patch_todo_partial_update(self):
        todo = TodoTaskFactory(user=self.user)
        payload = {"name": "Partially Updated Todo"}
        res = self.client.patch(f'/api/todos/{todo.id}/', payload, format='json')
        assert res.status_code == 200
        assert res.data["name"] == "Partially Updated Todo"

    def test_delete_todo(self):
        todo = TodoTaskFactory(user=self.user)
        res = self.client.delete(f'/api/todos/{todo.id}/')
        assert res.status_code == 204

    # === HABITS ===
    def test_post_create_habit(self):
        payload = {
            "name": "Factory Habit",
            "description": "Created via API"
        }
        res = self.client.post('/api/habits/', payload, format='json')
        assert res.status_code == 201

    def test_get_habit_list(self):
        HabitFactory(user=self.user)
        res = self.client.get('/api/habits/')
        assert res.status_code == 200

    def test_get_habit_detail(self):
        habit = HabitFactory(user=self.user)
        res = self.client.get(f'/api/habits/{habit.id}/')
        assert res.status_code == 200

    def test_put_habit_update(self):
        habit = HabitFactory(user=self.user)
        payload = {
            "name": "Updated Habit",
            "description": "Updated via API"
        }
        res = self.client.put(f'/api/habits/{habit.id}/', payload, format='json')
        assert res.status_code == 200

    def test_patch_habit_partial_update(self):
        habit = HabitFactory(user=self.user)
        payload = {"name": "Partially Updated Habit"}
        res = self.client.patch(f'/api/habits/{habit.id}/', payload, format='json')
        assert res.status_code == 200
        assert res.data["name"] == "Partially Updated Habit"

    def test_delete_habit(self):
        habit = HabitFactory(user=self.user)
        res = self.client.delete(f'/api/habits/{habit.id}/')
        assert res.status_code == 204
