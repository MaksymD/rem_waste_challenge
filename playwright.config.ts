import {defineConfig, devices} from '@playwright/test';
import {COOKIE_PATHS} from "./constrants/COOKIE_PATHS";

require("dotenv").config();

const testDirE2E = './tests/e2e';
const testDirAPI = './tests/api';

const isHeadlessLocally = true;
const runHeadless = !!process.env.CI || isHeadlessLocally;
const headlessViewport = {width: 1920, height: 1080};

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

    outputDir: 'playwright-results/artifacts',

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        headless: runHeadless,
        /* Base URL to use in actions like `await page.goto('/')`. */

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: "retain-on-failure",
        navigationTimeout: 200 * 1000,
        viewport: runHeadless ? headlessViewport : null,
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "setup",
            testDir: testDirE2E,
            testMatch: new RegExp(`.*.${process.env.STAGE}.setup.ts`),
            use: {
                headless: true,
                viewport: headlessViewport,
            }
        },
        {
            name: 'unauthenticated - chromium ',
            testDir: testDirE2E,
            testMatch: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'unauthenticated - firefox ',
            testDir: testDirE2E,
            testMatch: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Firefox'],
            },
        },
        {
            name: 'unauthenticated - webkit ',
            testDir: testDirE2E,
            testMatch: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Safari'],
            },
        },
        {
            name: 'authenticated - chromium',
            testDir: testDirE2E,
            testIgnore: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Chrome'],
                storageState: COOKIE_PATHS.DEV_TEST_USER_NAME,
                viewport: runHeadless ? headlessViewport : null,
                deviceScaleFactor: undefined,
            },
            dependencies: ["setup"],
            testMatch: process.env.TEST_RUN_LIST,
        },

        {
            name: 'authenticated - firefox',
            testDir: testDirE2E,
            testIgnore: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Firefox'],
                storageState: COOKIE_PATHS.DEV_TEST_USER_NAME,
                viewport: runHeadless ? headlessViewport : null,
                deviceScaleFactor: undefined,
                launchOptions: {
                    args: ['--start-maximized'],
                },
            },
            dependencies: ["setup"],
            testMatch: process.env.TEST_RUN_LIST,
        },

        {
            name: 'authenticated - webkit',
            testDir: testDirE2E,
            testIgnore: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Safari'],
                storageState: COOKIE_PATHS.DEV_TEST_USER_NAME,
            },
            dependencies: ["setup"],
            testMatch: process.env.TEST_RUN_LIST,
        },
        {
            name: 'api-tests',
            testDir: testDirAPI,
            testMatch: '**/*.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});
