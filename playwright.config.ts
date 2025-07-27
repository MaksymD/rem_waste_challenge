import {defineConfig, devices} from '@playwright/test';

require("dotenv").config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html', {outputFolder: 'playwright-results/html-report'}],
        ['json', {outputFile: 'playwright-results/report.json'}],
        ['list'],
    ],

    outputDir: 'playwright-results',

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        headless: !!process.env.CI,
        /* Base URL to use in actions like `await page.goto('/')`. */

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "setup",
            testMatch: new RegExp(`.*.${process.env.STAGE}.setup.ts`),
            use: {
                headless: true,
            }
        },

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: process.env.COOKIE_BASE_PATH,
            },
            dependencies: ["setup"],
        },

        {
            name: 'firefox',
            use: {
                ...devices['Desktop Chrome'],
                storageState: process.env.COOKIE_BASE_PATH,
            },
            dependencies: ["setup"],
        },

        {
            name: 'webkit',
            use: {
                ...devices['Desktop Chrome'],
                storageState: process.env.COOKIE_BASE_PATH,
            },
            dependencies: ["setup"],
        },
    ],
});
