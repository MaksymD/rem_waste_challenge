import { COOKIE_PATHS } from "../../constrants/COOKIE_PATHS";
import { USERS } from "../../constrants/USERS";
import { login } from "../../helpers/auth/auth";
import { test as setup } from "../../test";
import {expect} from "@playwright/test";

setup("authenticate as test user", async ({ page, URL }) => {
  await page.goto(URL);
  await login(page, USERS.DEV.TEST_USER);
  await expect(page.getByTestId('welcome-message')).toBeVisible({ timeout: 30000 });
  await page.context().storageState({ path: COOKIE_PATHS.DEV_TEST_USER_NAME });
});
