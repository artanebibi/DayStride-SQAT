import axios from '../../../../src/axios/axios';
import GoalRepository from '../../../../src/repository/GoalRepository.js';
import {mockGoals} from '../Mock/mockGoals.js';

describe('GoalRepository', () => {
    const uniqueId = Date.now();
    const testUser = {
        username: `user_${uniqueId}`,
        email: `user_${uniqueId}@test.com`,
        password: 'test123'
    };

    const createdGoalIds = [];
    const createdGoals = [];

    beforeAll(async () => {
        const registerRes = await axios.post('/register/', testUser);
        expect(registerRes.status).toBe(201);

        const loginRes = await axios.post('/token/', {
            username: testUser.username,
            password: testUser.password
        });
        expect(loginRes.status).toBe(200);

        localStorage.setItem('tokens', JSON.stringify(loginRes.data));

        axios.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.access}`;

        for (const goal of mockGoals) {
            const {id, is_owner, sharedCount, ...payload} = goal;

            payload.is_public = goal.is_public;

            const res = await GoalRepository.create(payload);
            expect(res.status).toBe(201);

            createdGoalIds.push(res.data.id);
            createdGoals.push(res.data);
        }
    });

    afterAll(async () => {
        for (const id of createdGoalIds) {
            await GoalRepository.delete(id);
        }
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
    });

    const normalizeGoal = ({name, description, end_date, location, is_public}) => ({
        name,
        description,
        end_date,
        location,
        is_public,
    });

    test('findAllPublic', async () => {
        const res = await GoalRepository.findAllPublic();
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });


    test('findById', async () => {
        const original = createdGoals.find(g => g.name === 'Learn React') || createdGoals[0];
        const res = await GoalRepository.findById(original.id);
        expect(res.status).toBe(200);

        const normalizedFetched = normalizeGoal(res.data);
        const normalizedOriginal = normalizeGoal(original);

        expect(normalizedFetched).toEqual(normalizedOriginal);
    });

    test('fetchById', async () => {
        const res = await GoalRepository.findById(createdGoalIds[0]);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('id', createdGoalIds[0]);
    });

    test('update', async () => {
        const goal = mockGoals[0];
        const updatedData = {...goal, name: 'Updated Goal Name'};
        const res = await GoalRepository.update(createdGoalIds[0], updatedData);
        expect(res.status).toBe(200);
        expect(res.data.name).toBe('Updated Goal Name');
    });

    test('update', async () => {
        const patchRes = await GoalRepository.partialUpdate(createdGoalIds[0], {
            location: 'Updated Location',
        });
        expect(patchRes.status).toBe(200);
        expect(patchRes.data.location).toBe('Updated Location');
    });

    test('join goal', async () => {
        const resJoin = await GoalRepository.joinGoal(createdGoalIds[0]);
        expect(resJoin.status).toBe(201);
    });

    test('leave goal', async () => {
        const resLeave = await GoalRepository.leaveGoal(createdGoalIds[0]);
        expect(resLeave.status).toBe(200);
    });

    test('delete', async () => {
        const id = createdGoalIds.pop();
        const res = await GoalRepository.delete(id);
        expect(res.status).toBe(204);
    });
})
;
