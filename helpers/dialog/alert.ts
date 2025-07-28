import {Page} from "@playwright/test";

const DELETE_ITEM = "Are you sure you want to delete this item?";

/**
 * Handles a native JavaScript confirm dialog with expected text and accepts it.
 *
 * @param page - The Playwright Page instance.
 * @param expectedText - The expected dialog message text.
 */
export async function handleConfirmDialog(page: Page, expectedText: string): Promise<void> {
    page.once('dialog', async (dialog) => {
        if (dialog.message() !== expectedText) {
            throw new Error(`Unexpected dialog text: "${dialog.message()}"`);
        }
        await dialog.accept();
    });
}

export const ALERT = {
    handleConfirmDialog,
    TEXT: {
        DELETE_ITEM,
    },
};