import {Page} from "@playwright/test";

const DIV_SECTION = "items-section";
const DIV_LIST = "items-list";
const INPUT_NEW_ITEM_NAME = "new-item-name-input";
const INPUT_NEW_ITEM_DESCRIPTION = "new-item-description-input";

/**
 * Finds an item in the list by name and returns its data-testid and id (without prefix).
 * @param {Page} page - Playwright page instance.
 * @param {string} itemName - Name of the item to find.
 * @returns {Promise<{testId: string, id: string}>} The full data-testid and stripped id.
 * @throws Error if item or data-testid not found.
 */
async function getTestItemIdByName(page: Page, itemName: string): Promise<{ testId: string; id: string; }> {
    const itemListItem = page.locator('li', {has: page.locator('h4', {hasText: itemName})});
    const testId = await itemListItem.getAttribute('data-testid');
    if (!testId) {
        throw new Error(`Could not find data-testid on the item with name "${itemName}"`);
    }
    return {testId, id: testId.replace('item-', '')};
}

export const ITEMS = {
    getTestItemIdByName,
    DIV_SECTION,
    DIV_LIST,
    INPUT_NEW_ITEM_NAME,
    INPUT_NEW_ITEM_DESCRIPTION,
};