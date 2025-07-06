import {test, expect} from '@playwright/test';
import {test_user} from './Data/user.js';
import {loginUser, registerUser} from './Data/authHelpers.js'


test('Navbar buttons redirect unauthenticated users to login page', async ({page}) => {
    await page.goto("/")
    await page.click('a[href="/dashboard"]')
    await page.waitForURL("/login")

    await page.goto("/")
    await page.click('a[href="/habits"]')
    await page.waitForURL("/login")

    await page.goto("/")
    await page.click('a[href="/goals"]')
    await page.waitForURL("/login")

    await page.goto("/")
    await page.click('a[href="/todos"]')
    await page.waitForURL("/login")

    await page.goto("/")
    await page.click('a[href="/goalhub"]')
    await page.waitForURL("/goalhub") // doesnt redirect to login, but still tested if its clickable
})

test('Navbar buttons redirection of authenticated users', async ({page}) => {
    loginUser(page, test_user)

    await page.click('a[href="/dashboard"]')
    await page.waitForURL("/dashboard")

    await page.click('a[href="/habits"]')
    await page.waitForURL("/habits")

    await page.click('a[href="/goals"]')
    await page.waitForURL("/goals")

    await page.click('a[href="/todos"]')
    await page.waitForURL("/todos")


})

test('Get Started button navigate to Login (unauthenticated user)', async ({page}) => {
    await page.goto("/")
    await page.click('a[href="/dashboard"].bg-amber-700.text-white')
    await page.waitForURL("/login")
})

test('Get Started button navigate to Login (authenticated user)', async ({page}) => {
    loginUser(page, test_user)
    await page.click("a.flex-1") // click the logo on the navbar
    await page.click('a[href="/dashboard"].bg-amber-700.text-white')
    await page.waitForURL("/dashboard")
})

test('Register button navigates to Register page', async ({page}) => {
    await page.addInitScript(() => {
        localStorage.removeItem('tokens');
    });
    await page.goto("/login")
    await page.click('.w-\\[100\\%\\]')
    await page.waitForURL("/register")
})

