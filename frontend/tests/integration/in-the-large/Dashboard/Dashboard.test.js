// tests/integration/in-the-large/Dashboard/DashboardRepositoryLive.test.js

import axios from '../../../../src/axios/axios';
import DashboardRepository from '../../../../src/repository/DashBoardRepository';
import ToDoRepository from '../../../../src/repository/ToDoRepository';
import HabitRepository from '../../../../src/repository/HabitRepository';
import GoalRepository from '../../../../src/repository/GoalRepository';
import { mockTodos } from '../Mock/mockTodos';
import { mockHabits } from '../Mock/mockHabits';
import { mockGoals } from '../Mock/mockGoals';

describe('DashboardRepository', () => {
  const uniqueId = Date.now();
  const testUser = {
    username: `dashboard_user_${uniqueId}`,
    email: `dashboard_user_${uniqueId}@test.com`,
    password: 'test123',
  };

  const createdTodoIds = [];
  const createdHabitIds = [];
  const createdGoalIds = [];

  const normalizeTodo = ({ name, description, due_date, due_time, priority, completed }) => ({
    name,
    description,
    due_date,
    due_time,
    priority: typeof priority === 'string'
      ? (priority === 'High' ? 1 : priority === 'Medium' ? 2 : 3)
      : priority,
    completed,
  });

  const normalizeHabit = ({ name, description, completed }) => ({
    name,
    description,
    completed,
  });

  const normalizeGoal = ({ name, description, end_date, location, is_public }) => ({
    name,
    description,
    end_date,
    location,
    is_public,
  });

  beforeAll(async () => {
    const registerRes = await axios.post('/register/', testUser);
    expect(registerRes.status).toBe(201);

    const loginRes = await axios.post('/token/', {
      username: testUser.username,
      password: testUser.password,
    });
    expect(loginRes.status).toBe(200);

    localStorage.setItem('tokens', JSON.stringify(loginRes.data));

    for (const todo of mockTodos) {
      if (new Date(todo.due_date) >= new Date()) {
        try {
          const res = await ToDoRepository.create(todo);
          expect([200, 201]).toContain(res.status);
          createdTodoIds.push(res.data.id);
        } catch (err) {
          console.error('Failed to create todo:', todo.name, err.response?.data);
        }
      }
    }

    for (const habit of mockHabits) {
      const res = await HabitRepository.create(habit);
      expect([200, 201]).toContain(res.status);
      createdHabitIds.push(res.data.id);
    }

    for (const goal of mockGoals) {
      if (new Date(goal.end_date) >= new Date()) {
        const res = await GoalRepository.create(goal);
        expect([200, 201]).toContain(res.status);
        createdGoalIds.push(res.data.id);
      }
    }
  });

  afterAll(async () => {
    for (const id of createdTodoIds) {
      await ToDoRepository.delete(id);
    }
    for (const id of createdHabitIds) {
      await HabitRepository.delete(id);
    }
    for (const id of createdGoalIds) {
      await GoalRepository.delete(id);
    }
    localStorage.clear();
  });

  test('fetchUserDashboard', async () => {
    const res = await DashboardRepository.fetchUserDashboard();
    expect(res.status).toBe(200);

    const dashboard = res.data;
    expect(dashboard).toHaveProperty('username');
    expect(dashboard).toHaveProperty('todos');
    expect(dashboard).toHaveProperty('habits');
    expect(dashboard).toHaveProperty('goals');

    const expectedTodos = mockTodos
      .filter(todo => new Date(todo.due_date) >= new Date())
      .map(normalizeTodo);
    const expectedHabits = mockHabits.map(normalizeHabit);
    const expectedGoals = mockGoals
      .filter(goal => new Date(goal.end_date) >= new Date())
      .map(normalizeGoal);

    const fetchedTodos = dashboard.todos.map(normalizeTodo);
    const fetchedHabits = dashboard.habits.map(normalizeHabit);
    const fetchedGoals = dashboard.goals.map(normalizeGoal);

    expectedTodos.forEach(todo => {
      expect(fetchedTodos).toContainEqual(todo);
    });

    expectedHabits.forEach(habit => {
      expect(fetchedHabits).toContainEqual(habit);
    });

    expectedGoals.forEach(goal => {
      expect(fetchedGoals).toContainEqual(goal);
    });

    expect(fetchedTodos.length).toBeGreaterThanOrEqual(expectedTodos.length);
    expect(fetchedHabits.length).toBeGreaterThanOrEqual(expectedHabits.length);
    expect(fetchedGoals.length).toBeGreaterThanOrEqual(expectedGoals.length);
  });
});
