import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import HabitInfoCard from '../../../src/ui/components/habits/HabitInfoCard.jsx';


const mockHabit = {
  name: "Habit 1",
  description: "Description for Habit 1",
  created_at: "",
  completed: true,
};

test('Render HabitInfoCard from integration folder', () => {
  render(
    <MantineProvider>
      <HabitInfoCard habit={mockHabit} onToggleCompleted={() => {}} />
    </MantineProvider>
  );
  expect(screen.getByText(mockHabit.name)).toBeInTheDocument();
});
