/*
 * Copyright 2026 Michael Easter / @codetojoy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { test, expect } = require('@playwright/test');

const ATTENDEE_COUNT = 25;

// Helper: click Go until at least one box has an elimination animation class,
// or until the attempt limit is reached.
async function clickGoUntilElimination(page, maxClicks = 50) {
    let eliminatedNames = [];
    for (let i = 0; i < maxClicks && eliminatedNames.length === 0; i++) {
        await page.click('#goButton');
        eliminatedNames = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.box.animate-puff, .box.animate-shrink'))
                .map(el => el.id)
        );
    }
    return eliminatedNames;
}

// Helper: click Go until animate-rotate appears (winner crowned), or until limit.
async function clickGoUntilWinner(page, maxClicks = 200) {
    for (let i = 0; i < maxClicks; i++) {
        await page.click('#goButton');
        const winnerCount = await page.locator('.box.animate-rotate').count();
        if (winnerCount > 0) {
            return true;
        }
    }
    return false;
}

test.describe('Scooter app', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.box');
        await page.evaluate(() => localStorage.removeItem('scooter_state'));
        await page.reload();
        await page.waitForSelector('.box');
    });

    test('renders all attendee boxes on load', async ({ page }) => {
        // test
        const boxes = page.locator('.box');
        await expect(boxes).toHaveCount(ATTENDEE_COUNT);
    });

    test('no animation classes on fresh load', async ({ page }) => {
        // test
        const animated = page.locator('.animate-puff, .animate-shrink, .animate-rotate');
        await expect(animated).toHaveCount(0);
    });

    test('Go button eventually eliminates at least one attendee', async ({ page }) => {
        // test
        const eliminatedNames = await clickGoUntilElimination(page);
        expect(eliminatedNames.length).toBeGreaterThan(0);
    });

    test('Reset button clears all animation classes', async ({ page }) => {
        await clickGoUntilElimination(page);
        // test
        await page.click('#resetButton');
        const animated = page.locator('.animate-puff, .animate-shrink, .animate-rotate');
        await expect(animated).toHaveCount(0);
    });

    test('all boxes remain after Reset', async ({ page }) => {
        await clickGoUntilElimination(page);
        // test
        await page.click('#resetButton');
        await expect(page.locator('.box')).toHaveCount(ATTENDEE_COUNT);
    });

    test('Go button eventually produces a winner', async ({ page }) => {
        test.setTimeout(60000); // winner may take many rounds
        // test
        const winnerFound = await clickGoUntilWinner(page);
        expect(winnerFound).toBe(true);
        await expect(page.locator('.box.animate-rotate')).toHaveCount(1);
    });

    test('Reset clears the winner animation', async ({ page }) => {
        test.setTimeout(60000);
        await clickGoUntilWinner(page);
        // test
        await page.click('#resetButton');
        await expect(page.locator('.box.animate-rotate')).toHaveCount(0);
    });

    test('Go saves state to localStorage', async ({ page }) => {
        // test
        await page.click('#goButton');
        const state = await page.evaluate(() => localStorage.getItem('scooter_state'));
        expect(state).not.toBeNull();
        const parsed = JSON.parse(state);
        expect(Array.isArray(parsed.names)).toBe(true);
        expect(Array.isArray(parsed.losers)).toBe(true);
        expect(parsed.names.length).toBe(ATTENDEE_COUNT);
    });

    test('Reset clears localStorage', async ({ page }) => {
        await page.click('#goButton');
        // test
        await page.click('#resetButton');
        const state = await page.evaluate(() => localStorage.getItem('scooter_state'));
        expect(state).toBeNull();
    });

    test('eliminated attendees are restored after page reload', async ({ page }) => {
        const eliminatedNames = await clickGoUntilElimination(page);
        expect(eliminatedNames.length).toBeGreaterThan(0);

        // test
        await page.reload();
        await page.waitForSelector('.box');

        for (const name of eliminatedNames) {
            const box = page.locator(`.box[id="${name}"]`);
            await expect(box).toHaveClass(/animate-shrink/);
        }
    });

    test('ignores stale localStorage state from a different attendee list', async ({ page }) => {
        await page.evaluate(() => {
            const fakeState = {
                names: ['Fake Person 1', 'Fake Person 2'],
                losers: ['Fake Person 1']
            };
            localStorage.setItem('scooter_state', JSON.stringify(fakeState));
        });

        // test
        await page.reload();
        await page.waitForSelector('.box');

        await expect(page.locator('.box')).toHaveCount(ATTENDEE_COUNT);
        await expect(page.locator('.animate-puff, .animate-shrink, .animate-rotate')).toHaveCount(0);
    });

});
