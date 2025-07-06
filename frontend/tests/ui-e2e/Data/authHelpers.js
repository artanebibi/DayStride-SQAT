export async function loginUser(page, user) {
    // cleared localStorage in the test because the app trusts leftover tokens without verifying them first,
    // causing redirects. Logic is if tokens exist but are invalid or expired redirect user to /register.
    await page.addInitScript(() => {
        localStorage.removeItem('tokens');
    });

    await page.goto('/login');

    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');
}

export async function registerUser(page, user) {
    await page.goto('/register');

    await page.fill('input[placeholder="Username"]', user.username);
    await page.fill('input[placeholder="Email"]', user.username + "@example.com");
    await page.fill('input[placeholder="Password"]', user.password);
    await page.click('button[type="submit"]');
}
