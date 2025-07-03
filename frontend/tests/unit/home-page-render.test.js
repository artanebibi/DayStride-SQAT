import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Header from '../../src/ui/components/layout/Header/Header.jsx';
import {MantineProvider} from '@mantine/core';


beforeEach(() => {
    localStorage.removeItem("tokens");
});

describe('Header component', () => {
    test('renders DayStride logo and navigation links', () => {
        render(
            <MemoryRouter>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{colorScheme: 'light'}}
                >
                    <Header/>
                </MantineProvider>
            </MemoryRouter>
        );

        expect(screen.getByAltText("Logo")).toHaveAttribute("src", "test-file-stub");
        expect(screen.getByText(/DayStride/i)).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Habits')).toBeInTheDocument();
        expect(screen.getByText('Todos')).toBeInTheDocument();
        expect(screen.getByText('Goals')).toBeInTheDocument();
        expect(screen.getByText('Goal Hub')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    });
});
