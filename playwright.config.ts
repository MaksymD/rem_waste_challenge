import {defineConfig, devices} from '@playwright/test';
import {COOKIE_PATHS} from "./constrants/COOKIE_PATHS";

require("dotenv").config();

const isHeadless = false;

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
        ['html'],
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
        video: "retain-on-failure",
        navigationTimeout: 200 * 1000,
        launchOptions: {
            args: ["--start-maximized"],
        },
        viewport: isHeadless ? {width: 1920, height: 1080} : null,
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
            name: 'unauthenticated - chromium ',
            testMatch: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'unauthenticated - firefox ',
            testMatch: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Firefox'],
            },
        },
        {
            name: 'unauthenticated - webkit ',
            testMatch: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Safari'],
            },
        },

        {
            name: 'authenticated - chromium',
            testIgnore: process.env.TEST_UNAUTHENTICATED_LIST,
            use: {
                ...devices['Desktop Chrome'],
                storageState: COOKIE_PATHS.DEV_TEST_USER_NAME,
                viewport: isHeadless ? {width: 1920, height: 1080} : null,
                deviceScaleFactor: undefined,
            },
            dependencies: ["setup"],
            testMatch: process.env.TEST_RUN_LIST,
        },

        // {
        //     name: 'authenticated - firefox',
        //     testIgnore: process.env.TEST_UNAUTHENTICATED_LIST,
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         storageState:  COOKIE_PATHS.DEV_TEST_USER_NAME,
        //         viewport: { width: 1920, height: 1080 },
        //         deviceScaleFactor: undefined,
        //         launchOptions: {
        //             args: ['--start-maximized'],
        //         },
        //     },
        //     dependencies: ["setup"],
        //     testMatch: process.env.TEST_RUN_LIST,
        // },
        //
        // {
        //     name: 'authenticated - webkit',
        //     testIgnore: process.env.TEST_UNAUTHENTICATED_LIST,
        //     use: {
        //         ...devices['Desktop Safari'],
        //         storageState:  COOKIE_PATHS.DEV_TEST_USER_NAME,
        //         viewport: { width: 1920, height: 1080 },
        //         deviceScaleFactor: undefined,
        //         launchOptions: {
        //             args: ['--start-maximized'],
        //         },
        //     },
        //     dependencies: ["setup"],
        //     testMatch: process.env.TEST_RUN_LIST,
        // },
    ],
});
