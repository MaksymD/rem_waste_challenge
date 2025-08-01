type User = {
    name: string;
    password: string;
};

const TEST_USER: User = {
    name: process.env.DEV_TEST_USER_NAME,
    password: process.env.DEV_TEST_USER_PASSWORD,
};
const FAKE_USER: User = {
    name: process.env.DEV_FAKE_USER_NAME,
    password: process.env.DEV_FAKE_USER_PASSWORD,
};

export const USERS: { [key: string]: { [key: string]: User } } = {
    DEV: {
        TEST_USER,
        FAKE_USER,
    },
};
export type {User};
