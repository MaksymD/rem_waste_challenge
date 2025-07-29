import {Locator, Page} from "@playwright/test";
import {VERIFY_UTILS} from "../utils/verification_utils";

const BUTTON_LOGIN = "login-button";
const BUTTON_LOGOUT = "logout-button";
const BUTTON_ADD_ITEM = "add-item-button";

/**
 * Generic function to verify that a button is visible, enabled, and then click it.
 *
 * @param {Page} page - The Playwright page instance.
 * @param {string} testId - The test ID of the button to be verified and clicked.
 * @param timeout
 * @returns {Promise<void>} - Resolves when the button is clicked.
 */
async function clickButton(page: Page, testId: string, timeout = 5000): Promise<void> {
    const button = page.getByTestId(testId);
    await button.waitFor({state: "visible", timeout});
    await VERIFY_UTILS.verifyIsVisibleAndEnabledById(page, testId);
    await button.click();
}

/**
 * Clicks a button using a given locator after ensuring it is visible.
 *
 * @param locator - The Playwright Locator object for the button.
 * @param timeout - Timeout in milliseconds to wait for the button to be visible (default: 5000).
 */
export async function clickButtonByLocator(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({state: "visible", timeout});
    await VERIFY_UTILS.verifyIsVisibleByLocator(locator);
    await locator.click();
}

export const BUTTON_GROUP = {
    clickButton,
    clickButtonByLocator,
    MAIN: {
        BUTTON_LOGIN,
        BUTTON_LOGOUT,
        BUTTON_ADD_ITEM,
    },
};
