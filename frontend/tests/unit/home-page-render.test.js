import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Header from '../../src/ui/components/layout/Header/Header.jsx';
import Home from '../../src/ui/pages/Home.jsx'
import {MantineProvider} from '@mantine/core';
import {setAuthenticatedUser, clearAuth} from './mocks/authenticationMock.js';


beforeEach(() => {
    clearAuth()
})

describe('Renders Hero-section and animation object', () => {
    test('Hero section render', () => {
        render(
            <MemoryRouter>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{colorScheme: 'light'}}
                >
                    <Home/>
                </MantineProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {name: /welcome to daystride/i})).toBeInTheDocument();
        expect(screen.getByText(/track your goals/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /get started/i})).toHaveAttribute('href', '/dashboard');
        expect(screen.getByTestId('animation-wrapper')).toBeInTheDocument();
    });
});


describe('Renders Header', () => {
    test('Header render', () => {
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
    });
});


describe("Tests the rendering of Login button", () => {
    test('Login Button render', () => {
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
        )

        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    })
})

describe("Tests the rendering of Logout button", () => {
    test('Logout Button toggle', () => {
        setAuthenticatedUser()

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
        )

        expect(screen.getByRole('button', {name: /logout/i})).toBeInTheDocument();
    })
})