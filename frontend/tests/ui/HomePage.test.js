// HomePage.test.js
import {test, expect} from '@playwright/test';

test('Home Page should contain the header', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: /welcome to daystride/i})).toBeVisible();
});


test('Font size, font weight of Hero section > Daystride-span', async ({page}) => {
    await page.goto('/');

    const heroWrapper = page.locator('.text-5xl');
    const daystrideText = heroWrapper.locator('span')
    await expect(daystrideText).toBeVisible();

    const fontSize = await daystrideText.evaluate(el => getComputedStyle(el).fontSize);
    const fontWeight = await daystrideText.evaluate(el => getComputedStyle(el).fontWeight);

    expect(fontSize).toBe('48px'); // 3rem (48px)
    expect(fontWeight).toBe('800'); // `font-extrabold`
})

test('Heading of Hero Wrapper', async ({page}) => {
    await page.goto('/');

    const heroWrapper = page.locator('.text-5xl');
    const tagName = await heroWrapper.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h1');
})

