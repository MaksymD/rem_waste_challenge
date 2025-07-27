import { Page } from "@playwright/test";
import { User } from "../../constrants/USERS";

const INPUT_USERNAME = "login-username-input";
const INPUT_PASSWORD = "login-password-input";
const BUTTON_LOGIN = "login-button";

export async function login(page: Page, user: User) {
  const { name, password } = user;

  await page.getByTestId(INPUT_USERNAME).click();
  await page.getByTestId(INPUT_USERNAME).fill(name);
  await page.getByTestId(INPUT_PASSWORD).click();
  await page.getByTestId(INPUT_PASSWORD).fill(password);
  await page.getByTestId(BUTTON_LOGIN).click();
}
