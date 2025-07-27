import { Page } from "@playwright/test";
import { User } from "../../constrants/USERS";
import {BUTTON_GROUP} from "../button/button_group";
import {FORM_UTILS} from "../utils/formUtils";

const INPUT_USERNAME = "login-username-input";
const INPUT_PASSWORD = "login-password-input";

export async function login(page: Page, user: User) {
  const { name, password } = user;

  await FORM_UTILS.fillInputField(page,INPUT_USERNAME, name);
  await FORM_UTILS.fillInputField(page,INPUT_PASSWORD, password);
  await BUTTON_GROUP.clickButton(page, BUTTON_GROUP.LOGIN.BUTTON_LOGIN);
}
