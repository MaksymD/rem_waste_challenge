import { expect, Page } from "@playwright/test";


/**
 * Verifies that an element (or a specific indexed element) with the given test ID is visible.
 *
 * @param {Page} page - The Playwright page instance.
 * @param {string} testId - The test ID of the element to be verified.
 * @param {Object} [options] - Additional options.
 * @param {number} [options.timeout=10000] - Timeout in milliseconds for the visibility check.
 * @param {"first" | "last" | number} [options.position] - Position of the element: "first", "last", or a specific index.
 * @returns {Promise<void>} Resolves if the element is visible, otherwise throws an error.
 */
async function verifyIsVisibleById(
  page: Page,
  testId: string,
  options: { timeout?: number; position?: "first" | "last" | number } = {},
): Promise<void> {
  const { timeout = 10000, position } = options;

  let locator = page.getByTestId(testId);
  if (position === "first") {
    locator = locator.first();
  } else if (position === "last") {
    locator = locator.last();
  } else if (typeof position === "number") {
    locator = locator.nth(position);
  }
  try {
    await expect(locator).toBeVisible({ timeout });
  } catch (err) {
    throw new Error(
      `❌ Element with testId: "${testId}"${position !== undefined ? ` (position: ${position})` : ""} was not visible within ${timeout}ms.`,
    );
  }
}

/**
 * Generic function to verify that an element is enabled.
 *
 * @param {Page} page - The Playwright page instance.
 * @param {string} testId - The test ID of the element to be verified.
 * @param timeout
 * @returns {Promise<void>} Resolves if the element is enabled, otherwise throws an error.
 */
async function verifyIsEnabledById(page: Page, testId: string, timeout = 5000): Promise<void> {
  const locator = page.getByTestId(testId);
  try {
    await expect(locator).toBeEnabled({ timeout });
  } catch (err) {
    throw new Error(`❌ Element with testId: "${testId}" is not enabled within ${timeout}ms.`);
  }
}

/**
 * Generic function to verify that an element is both visible and enabled.
 *
 * @param {Page} page - The Playwright page instance.
 * @param {string} testId - The test ID of the element to verify.
 */
export async function verifyIsVisibleAndEnabledById(page: Page, testId: string): Promise<void> {
  await verifyIsVisibleById(page, testId);
  await verifyIsEnabledById(page, testId);
}


export const VERIFY_UTILS = {
  verifyIsVisibleById,
  verifyIsEnabledById,
  verifyIsVisibleAndEnabledById,
};
