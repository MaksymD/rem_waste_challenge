import {COOKIE_PATHS} from "../../constrants/COOKIE_PATHS";
import {test} from "../../test";
import {expect} from "@playwright/test";
import {USERS} from "../../constrants/USERS";

test.describe("Welcome Page", () => {
    test.use({storageState: COOKIE_PATHS.DEV_TEST_USER_NAME});

    test.beforeEach(async ({page, URL}) => {
        await page.goto(URL);
    });

    test.afterEach(async ({page}) => {
        await page.close();
    });

    test('welcome page check header menu', async ({page}) => {

        //await expect(page.getByTestId('welcome-message')).toContainText(`Welcome, ${USERS.DEV.TEST_USER.name}!`);
        await expect(page.getByTestId('logout-button')).toBeVisible();
        await expect(page.getByTestId('items-section')).toBeVisible();
    });
});
