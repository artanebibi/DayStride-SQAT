import axios from '../../../../src/axios/axios';
import ToDoRepository from '../../../../src/repository/ToDoRepository';
import { mockTodos } from '../Mock/mockTodos';

describe('ToDoRepository', () => {
  const uniqueId = Date.now();
  const testUser = {
    username: `todo_user_${uniqueId}`,
    email: `todo_user_${uniqueId}@test.com`,
    password: 'test123'
  };

  beforeAll(async () => {
    const registerResponse = await axios.post('/register/', {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
    });
    expect(registerResponse.status).toBe(201);

    const loginResponse = await axios.post('/token/', {
      username: testUser.username,
      password: testUser.password,
    });
    expect(loginResponse.status).toBe(200);

    localStorage.setItem('tokens', JSON.stringify(loginResponse.data));

    for (const todo of mockTodos) {
      try {
        const res = await ToDoRepository.create(todo);
        expect([200, 201]).toContain(res.status);
      } catch (err) {
        console.error("Failed to create todo:", todo, err.response?.data || err.message);
      }
    }
  });

  afterAll(() => {
    localStorage.clear();
  });

  test('findAll', async () => {
    const response = await ToDoRepository.findAll();
    expect(Array.isArray(response.data)).toBe(true);

    const fetched = response.data;

    const normalize = (arr) =>
      arr.map(({ name, category, description, due_date, due_time, priority, completed }) => ({
        name,
        category,
        description,
        due_date,
        due_time: due_time ?? null,
        priority,
        completed,
      }));

    const fetchedNormalized = normalize(fetched);
    const mockNormalized = normalize(mockTodos);

    const sortFn = (a, b) => a.name.localeCompare(b.name);
    fetchedNormalized.sort(sortFn);
    mockNormalized.sort(sortFn);

    for (const mockTodo of mockNormalized) {
      expect(fetchedNormalized).toContainEqual(mockTodo);
    }
  });
});
