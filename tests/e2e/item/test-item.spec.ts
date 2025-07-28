import {COOKIE_PATHS} from "../../../constrants/COOKIE_PATHS";
import {test} from "../../../test";
import {expect} from "@playwright/test";
import {ALERT} from "../../../helpers/dialog/alert";
import {VERIFY_UTILS} from "../../../helpers/utils/verification_utils";

test.describe.serial('Item Management', () => {
    test.use({storageState: COOKIE_PATHS.DEV_TEST_USER_NAME});
    const uniqueId = Date.now().toString().slice(-6);
    let testItemTestId = "";
    let testItemId = "";

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
        const expected = {
            itemsAddedSuccessMessage: 'Item added successfully!'
        };

        // WHEN
        await page.getByTestId('new-item-name-input').fill(TESTDATA_ITEM.name);
        await page.getByTestId('new-item-description-input').fill(TESTDATA_ITEM.description);
        await Promise.all([
            page.getByTestId('add-item-button').click(),
            VERIFY_UTILS.verifyAppMessageContainsText(page, expected.itemsAddedSuccessMessage),
        ]);

        // THEN
        await expect(page.getByTestId('items-list')).toBeVisible();
        await expect(page.locator('h4').getByText(TESTDATA_ITEM.name)).toBeVisible();
        await expect(page.locator('p').getByText(TESTDATA_ITEM.description)).toBeVisible();

        const itemListItem = page.locator('li', {has: page.locator('h4', {hasText: TESTDATA_ITEM.name})});
        testItemTestId = await itemListItem.getAttribute('data-testid');
        if (testItemTestId) {
            testItemId = testItemTestId.replace('item-', '');
        } else {
            throw new Error('Could not find data-testid on the item list item.');
        }
    });

    test('( ✅ Positive test ) Editing an existing item → verify its update', async ({page}) => {

        const TESTDATA_ITEM = {
            name: `Test Item ${uniqueId}`,
            description: `Description for Test Item ${uniqueId}`,
        };
        const TESTDATA_ITEM_EDIT = {
            name: `Edited Item ${uniqueId}`,
            description: `Edited Description for ${uniqueId}`,
        };
        const expected = {
            itemUpdatedSuccessMessage: 'Item updated successfully!'
        };

        // WHEN
        const originalItemLocator = page.locator(`li[data-testid="${testItemTestId}"]`, {
            has: page.locator('h4', {hasText: TESTDATA_ITEM.name})
        });
        await expect(originalItemLocator).toBeVisible();

        const editButton = page.getByTestId(`edit-item-button-${testItemId}`);
        await expect(editButton).toBeVisible();
        await editButton.click();
        const editFormNameInput = page.getByTestId(`edit-item-name-input-${testItemId}`);
        const editFormDescriptionInput = page.getByTestId(`edit-item-description-input-${testItemId}`);
        await expect(editFormNameInput).toBeVisible();
        await expect(editFormDescriptionInput).toBeVisible();
        await editFormNameInput.fill(TESTDATA_ITEM_EDIT.name);
        await editFormDescriptionInput.fill(TESTDATA_ITEM_EDIT.description);
        const saveButton = page.getByTestId(`save-item-button-${testItemId}`);
        await expect(saveButton).toBeVisible();
        await Promise.all([
            saveButton.click(),
            VERIFY_UTILS.verifyAppMessageContainsText(page, expected.itemUpdatedSuccessMessage),
        ]);

        // THEN
        await expect(page.locator('h4', {hasText: TESTDATA_ITEM_EDIT.name})).toBeVisible();
        await expect(page.locator('p', {hasText: TESTDATA_ITEM_EDIT.description})).toBeVisible();
        await expect(page.locator('h4', {hasText: TESTDATA_ITEM.name})).not.toBeVisible();
        await expect(page.locator('p', {hasText: TESTDATA_ITEM.description})).not.toBeVisible();
    });

    test('( ✅ Positive test ) Delete an item → verify its removal', async ({page}) => {
        const TESTDATA_ITEM = {
            name: `Edited Item ${uniqueId}`,
            description: `Edited Description for ${uniqueId}`,
        };
        const expected = {
            itemsDeletedSuccessMessage: 'Item deleted successfully!'
        };

        // WHEN
        const addedItemLocator = page.locator(`li[data-testid="${testItemTestId}"]`, {
            has: page.locator('h4', {hasText: TESTDATA_ITEM.name})
        });
        await expect(addedItemLocator).toBeVisible();
        const deleteButton = page.getByTestId(testItemTestId).getByTestId(`delete-item-button-${testItemId}`);
        await expect(deleteButton).toBeVisible();
        await deleteButton.focus();
        await ALERT.handleConfirmDialog(page, ALERT.TEXT.DELETE_ITEM);
        await Promise.all([
            deleteButton.click(),
            VERIFY_UTILS.verifyAppMessageContainsText(page, expected.itemsDeletedSuccessMessage),
        ])

        // THEN
        await expect(page.locator('h4').getByTestId(`item-name-${testItemId}`)).not.toBeVisible();
        await expect(page.locator('p').getByTestId(`item-description-${testItemId}`)).not.toBeVisible();
    });
});
