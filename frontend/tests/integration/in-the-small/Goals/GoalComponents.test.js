import {render, screen, fireEvent} from '@testing-library/react';
import '../../../../src/repository/GoalRepository.js';
import '../mocks/goalMocks.js';
import GoalCard from '../../../../src/ui/components/goals/GoalCard';
import GoalDetails from '../../../../src/ui/components/goals/GoalDetails';
import GoalGrid from '../../../../src/ui/components/goals/GoalGrid';
import GoalInfoCard from '../../../../src/ui/components/goals/GoalInfoCard';
import React from 'react';
import {baseGoal} from '../mocks/goalMocks.js'
import {MantineProvider} from "@mantine/core";


describe('Goal UI Components', () => {
    test('renders GoalDetails correctly', () => {
        render(
            <MantineProvider>
                <GoalDetails goal={baseGoal} onJoin={jest.fn()}/>
            </MantineProvider>
        );

        expect(screen.getByText('Test Goal')).toBeInTheDocument();
        expect(screen.getByText('A test goal description')).toBeInTheDocument();
        expect(screen.getByText(/Ends:/)).toBeInTheDocument();
        expect(screen.getByText(/Location:/)).toBeInTheDocument();
        expect(screen.getByText(/Shared by/)).toBeInTheDocument();
    });

    test('renders GoalInfoCard correctly', () => {
        render(
            <MantineProvider>
                <GoalInfoCard goal={baseGoal}/>
            </MantineProvider>
        );
        expect(screen.getByText('Test Goal')).toBeInTheDocument();
        expect(screen.getByText(/Ends:/)).toBeInTheDocument();
        expect(screen.getByText('Test City')).toBeInTheDocument();
    });

    test('renders GoalCard with Edit/Delete for owner', () => {
        const onEditClick = jest.fn();
        const onDeleteClick = jest.fn();
        const onLeaveClick = jest.fn();

        render(
            <MantineProvider>
                <GoalCard
                    goal={baseGoal}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onLeaveClick={onLeaveClick}
                    sharedCount={2}
                />
            </MantineProvider>
        );

        fireEvent.click(screen.getByText('Edit'));
        fireEvent.click(screen.getByText('Delete'));

        expect(onEditClick).toHaveBeenCalledWith(baseGoal);
        expect(onDeleteClick).toHaveBeenCalledWith(baseGoal);
    });

    test('renders GoalCard with Leave for non-owner', () => {
        const goal = {...baseGoal, is_owner: false};
        const onLeaveClick = jest.fn();

        render(
            <MantineProvider>
                <GoalCard
                    goal={goal}
                    onEditClick={jest.fn()}
                    onDeleteClick={jest.fn()}
                    onLeaveClick={onLeaveClick}
                />
            </MantineProvider>
        );

        fireEvent.click(screen.getByText('Leave'));
        expect(onLeaveClick).toHaveBeenCalledWith(goal);
    });

    test('renders GoalGrid with multiple GoalCards', () => {
        const goals = [baseGoal, {...baseGoal, id: 2, name: 'Another Goal'}];
        render(
            <MantineProvider>
                <GoalGrid
                    goals={goals}
                    onEdit={jest.fn()}
                    onDelete={jest.fn()}
                    onLeaveClick={jest.fn()}
                />
            </MantineProvider>
        );

        expect(screen.getByText('Test Goal')).toBeInTheDocument();
        expect(screen.getByText('Another Goal')).toBeInTheDocument();
    });
});
