import '../mocks/goalMocks.js';
import {mockGoals, mock} from '../mocks/goalMocks.js';
import GoalRepository from "../../../../src/repository/GoalRepository.js";

describe('GoalRepository', () => {
    beforeAll(() => {
        delete window.location;

        localStorage.setItem('tokens', JSON.stringify({
            access: 'test-token',
            refresh: 'test-refresh'
        }));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mock.resetHistory();
    });

    afterAll(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    test('findAllPublic', async () => {
        const response = await GoalRepository.findAllPublic();
        expect(response.data).toEqual([mockGoals[1]]);
    });

    test('findUserGoals', async () => {
        const response = await GoalRepository.findUserGoals();
        expect(response.data).toEqual(mockGoals);
    });

    test('findById', async () => {
        const response = await GoalRepository.findById(1);
        expect(response.data).toEqual(mockGoals[0]);
    });

    test('joinGoal', async () => {
        const response = await GoalRepository.joinGoal(1);
        expect(response.data).toEqual({success: true});
    });

    test('leaveGoal', async () => {
        const response = await GoalRepository.leaveGoal(1);
        expect(response.data).toEqual({success: true});
    });

    test('create', async () => {
        const payload = {
            name: "Test Goal",
            description: "Created for testing",
            end_date: new Date().toISOString(),
            location: "Test Location",
            is_public: true
        };
        const response = await GoalRepository.create(payload);
        expect(response.status).toBe(201);
        expect(response.data).toEqual(mockGoals[0]);
    });

    test('update', async () => {
        const payload = {
            name: "Updated Goal",
            description: "Updated for testing",
            end_date: new Date().toISOString(),
            location: "Updated Location",
            is_public: false
        };
        const response = await GoalRepository.update(1, payload);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockGoals[0]);
    });

    test('partialUpdate', async () => {
        const payload = {name: "Partially Updated Goal"};
        const response = await GoalRepository.partialUpdate(1, payload);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockGoals[0]);
    });

    test('delete', async () => {
        const response = await GoalRepository.delete(1);
        expect(response.status).toBe(204);
    });
});
