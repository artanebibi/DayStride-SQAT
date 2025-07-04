// tests/integration/in-the-small/Habits/HabitHooks.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import useHabit from '../../../../src/hooks/useHabit.js';
import { mockHabits, mock } from '../mocks/habitMocks.js';
import '../../../../src/repository/HabitRepository.js';
import '../mocks/habitMocks.js';

describe('useHabit hook', () => {
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

  test('fetches habits on mount', async () => {
    const { result } = renderHook(() => useHabit());

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });

    expect(result.current.loading).toBe(false);
  });

  test('onAdd creates a habit and refreshes list', async () => {
    const { result } = renderHook(() => useHabit());

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });

    await act(async () => {
      await result.current.onAdd({ name: 'New Habit' });
    });

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });
  });

  test('onEdit updates a habit and refreshes list', async () => {
    const { result } = renderHook(() => useHabit());

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });

    await act(async () => {
      await result.current.onEdit(1, { name: 'Updated Habit' });
    });

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });
  });

  test('onDelete removes a habit and refreshes list', async () => {
    const { result } = renderHook(() => useHabit());

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });

    await act(async () => {
      await result.current.onDelete(1);
    });

    await waitFor(() => {
      expect(result.current.habits).toEqual(mockHabits);
    });
  });

  test('handles fetch errors gracefully', async () => {
    mock.onGet('/habits/').reply(500);

    const { result } = renderHook(() => useHabit());

    await waitFor(() => {
      expect(result.current.habits).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });
});