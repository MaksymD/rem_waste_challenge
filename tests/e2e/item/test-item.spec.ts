import {COOKIE_PATHS} from "../../../constrants/COOKIE_PATHS";
import {test} from "../../../test";
import {expect} from "@playwright/test";

test.describe.serial('Item Management', () => {
    test.use({storageState: COOKIE_PATHS.DEV_TEST_USER_NAME});
    const uniqueId = new Date().getTime().toString().slice(8, -1);

    test.beforeEach(async ({page, URL}) => {
        await page.goto(URL);
    });

    test.afterEach(async ({page}) => {
        await page.close();
    });

    test('( ✅ Positive test ) Creating a new item → the item is visible in the list', async ({page}) => {
        const TESTDATA_ITEM = {
            name: `Test Item ${uniqueId}`,
            description: `Description for Test Item ${uniqueId}`,
        };

        // WHEN
        await page.getByTestId('new-item-name-input').fill(TESTDATA_ITEM.name);
        await page.getByTestId('new-item-description-input').fill(TESTDATA_ITEM.description);
        await page.getByTestId('add-item-button').click();

        // THEN
        await expect(page.getByTestId('items-list')).toBeVisible();
        await expect(page.getByText(TESTDATA_ITEM.name)).toBeVisible();
        await expect(page.getByText(TESTDATA_ITEM.description)).toBeVisible();
    });

    test('( ✅ Positive test ) Delete an item → verify its removal', async ({page}) => {
        const TESTDATA_ITEM = {
            name: `Test Item ${uniqueId}`,
            description: `Description for Test Item ${uniqueId}`,
        };

        // WHEN
        const addedItemLocator = page.locator(`li[data-testid^="item-"]:has-text("${TESTDATA_ITEM.name}")`);
        await expect(addedItemLocator).toBeVisible();
        const deleteButton = addedItemLocator.getByTestId(/delete-item-button-/); // Regex for dynamic ID
        await expect(deleteButton).toBeVisible();
        await deleteButton.click();

        // THEN
        await expect(page.getByText(TESTDATA_ITEM.name)).not.toBeVisible();
        await expect(page.getByText(TESTDATA_ITEM.description)).not.toBeVisible();
    });
});
