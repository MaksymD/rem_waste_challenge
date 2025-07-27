import { test as base } from "@playwright/test";

const URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

export type TestOptions = {
  URL: string;
  BACKEND_URL: string;
};

export const test = base.extend<TestOptions>({
  URL: [URL, { option: true }],
  BACKEND_URL: [BACKEND_URL, { option: true }],
});
