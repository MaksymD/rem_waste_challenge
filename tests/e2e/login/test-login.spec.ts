import {test} from "../../../test";
import {expect} from "@playwright/test";
import {USERS} from "../../../constrants/USERS";
import {VERIFY_UTILS} from "../../../helpers/utils/verification_utils";
import {BUTTON_GROUP} from "../../../helpers/button/button_group";
import {ITEMS} from "../../../helpers/item/items_section";
import {login} from "../../../helpers/auth/auth";

test.describe.serial('Login and Welcome Page', () => {

    test.beforeEach(async ({page, URL}) => {
        await page.goto(URL);
    });

    test.afterEach(async ({page}) => {
        await page.close();
    });

    test('( ✅ Positive test ) Valid login → welcome message and items are visible', async ({page}) => {
        const expected = {
            itemsHeaderText: "Your Items",
            welcomeText: `Welcome, ${USERS.DEV.TEST_USER.name}!`
        };

        // WHEN
        await login(page, USERS.DEV.TEST_USER);

        // THEN
        await expect(page.getByTestId('welcome-message')).toBeVisible({timeout: 60000});
        await expect(page.getByTestId('welcome-message')).toContainText(expected.welcomeText);
        await VERIFY_UTILS.verifyIsVisibleAndEnabledById(page, BUTTON_GROUP.MAIN.BUTTON_LOGOUT);
        await expect(
            page.getByTestId(ITEMS.DIV_SECTION).getByText(expected.itemsHeaderText)
        ).toBeVisible();
    });

    test('( ❌ Negative test ) Invalid login → error message is visible', async ({page}) => {
        const expected = {
            errorText: "Invalid credentials"
        };

        // WHEN
        await login(page, USERS.DEV.FAKE_USER);

        // THEN
        await expect(page.getByTestId('login-message')).toContainText(expected.errorText);
        await VERIFY_UTILS.verifyIsVisibleById(page, BUTTON_GROUP.MAIN.BUTTON_LOGIN);
        await VERIFY_UTILS.verifyIsHiddenById(page, "welcome-message");
        await VERIFY_UTILS.verifyIsHiddenById(page, "logged-in-section");
    });

    test('( ❌ Negative test ) Missing username → input validation triggered', async ({page}) => {
        // WHEN
        await page.getByTestId('login-password-input').fill(USERS.DEV.TEST_USER.password);
        await page.getByTestId('login-button').click();

        // THEN
        const usernameInput = page.getByTestId('login-username-input');
        await VERIFY_UTILS.verifyRequiredFieldValidationMessage(usernameInput);
        await VERIFY_UTILS.verifyIsHiddenById(page, "welcome-message");
    });

    test('( ❌ Negative test ) Missing password → input validation triggered', async ({page}) => {
        // WHEN
        await page.getByTestId('login-username-input').fill(USERS.DEV.TEST_USER.name);
        await page.getByTestId('login-button').click();

        // THEN
        const passwordInput = page.getByTestId('login-password-input');
        await VERIFY_UTILS.verifyRequiredFieldValidationMessage(passwordInput);
        await VERIFY_UTILS.verifyIsHiddenById(page, "welcome-message");
    });
});
