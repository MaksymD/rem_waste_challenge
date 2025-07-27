import { Page } from "@playwright/test";
import { VERIFY_UTILS } from "../utils/verificationUtils";

const BUTTON_LOGIN = "login-button";

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
  await button.waitFor({ state: "visible", timeout });
  await VERIFY_UTILS.verifyIsVisibleAndEnabledById(page, testId);
  await button.click();
}

export const BUTTON_GROUP = {
  clickButton,
  LOGIN: {
    BUTTON_LOGIN,
  },
};
