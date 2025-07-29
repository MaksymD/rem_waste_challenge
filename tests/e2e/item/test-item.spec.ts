import {COOKIE_PATHS} from "../../../constrants/COOKIE_PATHS";
import {test} from "../../../test";
import {ALERT} from "../../../helpers/dialog/alert";
import {VERIFY_UTILS} from "../../../helpers/utils/verification_utils";
import {MESSAGES} from "../../../helpers/text/messages";
import {BUTTON_GROUP} from "../../../helpers/button/button_group";
import {ITEMS} from "../../../helpers/item/items_section";
import {FORM_UTILS} from "../../../helpers/utils/form_utils";

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

        // WHEN
        await FORM_UTILS.fillInputField(page, ITEMS.INPUT_NEW_ITEM_NAME, TESTDATA_ITEM.name);
        await FORM_UTILS.fillInputField(page, ITEMS.INPUT_NEW_ITEM_DESCRIPTION, TESTDATA_ITEM.description);
        await Promise.all([
            BUTTON_GROUP.clickButton(page, BUTTON_GROUP.MAIN.BUTTON_ADD_ITEM),
            VERIFY_UTILS.verifyAppMessageContainsText(page, MESSAGES.SUCCESS_ITEM_ADD),
        ]);

        // THEN
        await VERIFY_UTILS.verifyIsVisibleById(page, ITEMS.DIV_LIST);
        await VERIFY_UTILS.verifyIsVisibleByLocator(page.locator('h4').getByText(TESTDATA_ITEM.name));
        await VERIFY_UTILS.verifyIsVisibleByLocator(page.locator('p').getByText(TESTDATA_ITEM.description));

        const ids = await ITEMS.getTestItemIdByName(page, TESTDATA_ITEM.name);
        testItemTestId = ids.testId;
        testItemId = ids.id;
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

        if (!testItemTestId || !testItemId) {
            throw new Error('Item IDs are not set. Ensure the creation test passed.');
        }
        // WHEN
        await VERIFY_UTILS.verifyIsVisibleByLocator(page.locator(`li[data-testid="${testItemTestId}"]`, {has: page.locator('h4', {hasText: TESTDATA_ITEM.name})}));
        await BUTTON_GROUP.clickButtonByLocator(page.getByTestId(`edit-item-button-${testItemId}`));
        await FORM_UTILS.fillInputField(page, `edit-item-name-input-${testItemId}`, TESTDATA_ITEM_EDIT.name);
        await FORM_UTILS.fillInputField(page, `edit-item-description-input-${testItemId}`, TESTDATA_ITEM_EDIT.description);
        await Promise.all([
            BUTTON_GROUP.clickButtonByLocator(page.getByTestId(`save-item-button-${testItemId}`)),
            VERIFY_UTILS.verifyAppMessageContainsText(page, MESSAGES.SUCCESS_ITEM_UPDATE),
        ]);

        // THEN
        await VERIFY_UTILS.verifyIsVisibleByLocator(page.locator('h4', {hasText: TESTDATA_ITEM_EDIT.name}));
        await VERIFY_UTILS.verifyIsVisibleByLocator(page.locator('p', {hasText: TESTDATA_ITEM_EDIT.description}));
        await VERIFY_UTILS.verifyIsNotVisibleByLocator(page.locator('h4', {hasText: TESTDATA_ITEM.name}));
        await VERIFY_UTILS.verifyIsNotVisibleByLocator(page.locator('p', {hasText: TESTDATA_ITEM.description}));
    });

    test('( ✅ Positive test ) Delete an item → verify its removal', async ({page}) => {
        const TESTDATA_ITEM = {
            name: `Edited Item ${uniqueId}`,
            description: `Edited Description for ${uniqueId}`,
        };

        if (!testItemTestId || !testItemId) {
            throw new Error('Item IDs are not set. Ensure the creation test passed.');
        }
        // WHEN
        await VERIFY_UTILS.verifyIsVisibleByLocator(page.locator(`li[data-testid="${testItemTestId}"]`, {has: page.locator('h4', {hasText: TESTDATA_ITEM.name})}));
        await ALERT.handleConfirmDialog(page, ALERT.TEXT.DELETE_ITEM);
        await Promise.all([
            BUTTON_GROUP.clickButtonByLocator(page.getByTestId(testItemTestId).getByTestId(`delete-item-button-${testItemId}`)),
            VERIFY_UTILS.verifyAppMessageContainsText(page, MESSAGES.SUCCESS_ITEM_DELETE),
        ])

        // THEN
        await VERIFY_UTILS.verifyIsNotVisibleByLocator(page.locator('h4').getByTestId(`item-name-${testItemId}`));
        await VERIFY_UTILS.verifyIsNotVisibleByLocator(page.locator('p').getByTestId(`item-description-${testItemId}`));
    });
});
