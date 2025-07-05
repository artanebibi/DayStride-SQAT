// tests/integration/in-the-small/Habits/HabitRepository.test.js
import { mockHabits } from '../mocks/habitMocks.js';
import HabitRepository from '../../../../src/repository/HabitRepository.js';

describe('HabitRepository', () => {
  beforeAll(() => {
    localStorage.setItem('tokens', JSON.stringify({
      access: 'test-token',
      refresh: 'test-refresh',
    }));

    delete window.location;
    window.location = { href: jest.fn() };
  });

  afterAll(() => {
    localStorage.clear();
  });

  test('findAll', async () => {
    const response = await HabitRepository.findAll();
    expect(response.data).toEqual(mockHabits);
  });

  test('findById', async () => {
    const response = await HabitRepository.findById(1);
    expect(response.data).toEqual(mockHabits[0]);
  });

  test('create', async () => {
    const payload = {
      name: 'Habit 1',
      description: 'Description for Habits 1',
      completed: true,
      created_at: Date.now(),
    };

    const response = await HabitRepository.create(payload);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(mockHabits[0]);
  });

  test('update', async () => {
    const updated = { ...mockHabits[0], name: 'Updated Habit' };

    const response = await HabitRepository.update(1, updated);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockHabits[0]);
  });

  test('partialUpdate', async () => {
    const response = await HabitRepository.partialUpdate(1, { completed: false });
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockHabits[0]);
  });

  test('delete', async () => {
    const response = await HabitRepository.delete(1);
    expect(response.status).toBe(204);
  });
});
