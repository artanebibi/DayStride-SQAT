import axios from '../../../../src/axios/axios';
import HabitRepository from '../../../../src/repository/HabitRepository';
import {mockHabits} from '../Mock/mockHabits.js';

describe('HabitRepository', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `user_${uniqueId}`,
        email: `user_${uniqueId}@test.com`,
        password: 'test',
    };

    let createdHabits = [];

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

        for (const habit of mockHabits) {
            const res = await HabitRepository.create(habit);
            expect([200, 201]).toContain(res.status);
            createdHabits.push(res.data);
        }
    });

    afterAll(() => {
        localStorage.clear();
    });

    const normalize = ({id, ...rest}) => ({
        ...rest,
        completed: Boolean(rest.completed),
    });

    test('findAll', async () => {
        const res = await HabitRepository.findAll();
        expect(res.status).toBe(200);

        const fetched = res.data.map(normalize);
        const expected = createdHabits.map(normalize);

        expected.sort((a, b) => a.name.localeCompare(b.name));
        fetched.sort((a, b) => a.name.localeCompare(b.name));

        expect(fetched.length).toBeGreaterThanOrEqual(expected.length);
        expected.forEach(expectedHabit => {
            expect(fetched).toContainEqual(expectedHabit);
        });
    });

    test('findById', async () => {
        const habit = createdHabits[0];
        const res = await HabitRepository.findById(habit.id);
        expect(res.status).toBe(200);
        expect(normalize(res.data)).toEqual(normalize(habit));
    });

    test('create', async () => {
        const newHabit = {
            name: "Evening Stretch",
            description: "Stretch for 15 minutes",
            created_at: 1751638061472,
            completed: false,
        };

        const response = await HabitRepository.create(newHabit);
        expect(response.status).toBe(201);
        expect(response.data.name).toBe(newHabit.name);
    });

    test('update', async () => {
        const habit = createdHabits[1];
        const updated = {...habit, name: "Updated Habit", completed: true};

        const response = await HabitRepository.update(habit.id, updated);
        expect(response.status).toBe(200);
        expect(response.data.name).toBe("Updated Habit");
    });

    test('partialUpdate', async () => {
        const habit = createdHabits[2];
        const res = await HabitRepository.partialUpdate(habit.id, {
            completed: true,
        });
        expect(res.status).toBe(200);
        expect(res.data.completed).toBe(true);
        expect(res.data.name).toBe(habit.name);
        expect(res.data.description).toBe(habit.description);
    });

    test('delete', async () => {
        const habit = createdHabits[3];
        const del = await HabitRepository.delete(habit.id);
        expect(del.status).toBe(204);

        const res = await HabitRepository.findAll();
        const ids = res.data.map(h => h.id);
        expect(ids).not.toContain(habit.id);
    });
});
