import { Page } from "@playwright/test";
import {VERIFY_UTILS} from "./verificationUtils";

/**
 * Fills a text field if a value is provided.
 * @param {Page} page - The Playwright page instance.
 * @param {string} testId - The test ID of the input field.
 * @param {string | number} value - The value to fill.
 * @returns {Promise<void>}
 */
async function fillInputField(page: Page, testId: string, value: string | number): Promise<void> {
    const inputField = page.getByTestId(testId);
    await VERIFY_UTILS.verifyIsVisibleById(page, testId);
    await inputField.click();
    await inputField.fill(value.toString());
}

export const FORM_UTILS = {
    fillInputField,
}