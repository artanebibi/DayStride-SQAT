// tests/integration/in-the-small/Goals/GoalHooks.test.js
import {renderHook, act} from '@testing-library/react';
import useGoal from '../../../../src/hooks/UseGoal.js';
import {mockGoals, mock} from '../mocks/goalMocks.js';
import '../../../../src/repository/GoalRepository.js';
import '../mocks/goalMocks.js';

describe('useGoal hook', () => {

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


    test('fetches goals and userGoals', async () => {
        let result;

        await act(async () => {
            const rendered = renderHook(() => useGoal());
            result = rendered.result;
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(result.current.goals).toEqual([mockGoals[1]]);
        expect(result.current.userGoals).toEqual(mockGoals);
        expect(result.current.loading).toBe(false);
    });

    test('onAdd', async () => {
        let result;

        await act(async () => {
            const rendered = renderHook(() => useGoal());
            result = rendered.result;
            await Promise.resolve();
            await Promise.resolve();
        });

        await act(async () => {
            await result.current.onAdd({name: 'New Goal'});
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(result.current.goals).toEqual([mockGoals[1]]);
        expect(result.current.userGoals).toEqual(mockGoals);
    });

    test('onEdit', async () => {
        let result;

        await act(async () => {
            const rendered = renderHook(() => useGoal());
            result = rendered.result;
            await Promise.resolve();
            await Promise.resolve();
        });

        await act(async () => {
            await result.current.onEdit(1, {name: 'Updated Goal'});
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(result.current.goals).toEqual([mockGoals[1]]);
        expect(result.current.userGoals).toEqual(mockGoals);
    });

    test('onDelete', async () => {
        let result;

        await act(async () => {
            const rendered = renderHook(() => useGoal());
            result = rendered.result;
            await Promise.resolve();
            await Promise.resolve();
        });

        await act(async () => {
            await result.current.onDelete(1);
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(result.current.goals).toEqual([mockGoals[1]]);
        expect(result.current.userGoals).toEqual(mockGoals);
    });

    test('handle fetch error', async () => {
        mock.onGet('/goals/').reply(500);
        mock.onGet('/goals/my/').reply(500);

        let result;

        await act(async () => {
            const rendered = renderHook(() => useGoal());
            result = rendered.result;
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(result.current.goals).toEqual([]);
        expect(result.current.userGoals).toEqual([]);
        expect(result.current.loading).toBe(false);
    });
});
