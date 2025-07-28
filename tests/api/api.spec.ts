import {test} from "../../test";
import {expect} from "@playwright/test";
import {USERS} from "../../constrants/USERS";

test.describe.serial('API Tests', () => {
    const API_BASE_URL = 'https://my-app-backend-6kr6.onrender.com/api';
    const HEADERS = {
        accept: "application/json",
        contentType: "application/json",
    };
    let authToken: string;

    // Authenticate once before all API tests in this describe block
    test.beforeAll(async ({request}) => {
        const response = await request.post(`${API_BASE_URL}/login`, {
            headers: HEADERS,
            data: {
                username: USERS.DEV.TEST_USER.name,
                password: USERS.DEV.TEST_USER.password,
            },
        });
        expect(response.ok(), `Login failed in beforeAll. Status: ${response.status()}, Body: ${await response.text()}`).toBeTruthy();

        const data = await response.json();
        authToken = data.token;
        expect(authToken).toBeDefined();
        console.log(`Authenticated with token: ${authToken.substring(0, 10)}...`);
    });

    test('( ✅ Positive test ) - POST /login → should allow successful login with valid credentials', async ({request}) => {
        const response = await request.post(`${API_BASE_URL}/login`, {
            headers: HEADERS,
            data: {
                username: USERS.DEV.TEST_USER.name,
                password: USERS.DEV.TEST_USER.password,
            },
        });
        expect(response.ok(), `Login failed. Status: ${response.status()}, Body: ${await response.text()}`).toBeTruthy();
        const data = await response.json();
        expect(data.message).toBe('Login successful');
        expect(data.token).toBeDefined();
    });

    test('( ❌ Negative test ) POST /login → should return 401 for invalid credentials', async ({request}) => {
        const response = await request.post(`${API_BASE_URL}/login`, {
            headers: HEADERS,
            data: {
                username: USERS.DEV.FAKE_USER.name,
                password: USERS.DEV.FAKE_USER.password,
            },
        });
        expect(response.status()).toBe(401);
        const data = await response.json();
        expect(data.message).toBe('Invalid credentials');
    });

    test('( ✅ Positive test ) GET /items → should return all items for an authenticated user', async ({request}) => {
        const response = await request.get(`${API_BASE_URL}/items`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
        });
        expect(response.ok()).toBeTruthy();
        const items = await response.json();
        expect(Array.isArray(items)).toBeTruthy();
    });

    test('( ❌ Negative test ) GET /items → should return 401 for an unauthenticated user', async ({request}) => {
        const response = await request.get(`${API_BASE_URL}/items`);
        expect(response.status()).toBe(401);
        const data = await response.json();
        expect(data.message).toBe('Authentication failed: No token provided');
    });

    test('( ✅ Positive test ) POST /items → should create a new item for an authenticated user', async ({request}) => {
        const timestamp = Date.now();
        const newItem = {
            name: `API Test New Item ${timestamp}`,
            description: `Description for API Test New Item ${timestamp}`,
        };
        const response = await request.post(`${API_BASE_URL}/items`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
            data: newItem,
        });
        expect(response.status()).toBe(201);
        const data = await response.json();
        expect(data.message).toBe('Item created successfully');
        expect(data.item).toMatchObject(newItem);
        expect(data.item.id).toBeDefined();
    });

    test('( ❌ Negative test ) POST /items → should return 400 for missing data (authenticated)', async ({request}) => {
        const response = await request.post(`${API_BASE_URL}/items`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
            data: {name: 'Item with missing description'},
        });
        expect(response.status()).toBe(400);
        const data = await response.json();
        expect(data.message).toBe('Name and description are required');
    });

    test('( ❌ Negative test ) POST /items → should return 401 for an unauthenticated user', async ({request}) => {
        const response = await request.post(`${API_BASE_URL}/items`, {
            headers: HEADERS,
            data: {name: 'Unauthorized Item', description: 'Unauthorized Description'},
        });
        expect(response.status()).toBe(401);
        const data = await response.json();
        expect(data.message).toBe('Authentication failed: No token provided');
    });

    test('( ✅ Positive test ) PUT /items/:id → should update an existing item for an authenticated user', async ({request}) => {
        const timestamp = Date.now();
        const itemToCreate = {name: `Original Item ${timestamp}`, description: `Original Description ${timestamp}`};
        const createResponse = await request.post(`${API_BASE_URL}/items`, {
            headers: {Authorization: `Bearer ${authToken}`},
            data: itemToCreate,
        });
        expect(createResponse.status()).toBe(201);
        const createdItem = (await createResponse.json()).item;

        const updatedData = {name: `Updated Item ${timestamp}`, description: `Updated Description ${timestamp}`};
        const response = await request.put(`${API_BASE_URL}/items/${createdItem.id}`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
            data: updatedData,
        });
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.message).toBe('Item updated successfully');
        expect(data.item.name).toBe(updatedData.name);
        expect(data.item.description).toBe(updatedData.description);
        expect(data.item.id).toBe(createdItem.id);
    });

    test('( ❌ Negative test ) PUT /items/:id → should return 404 for a non-existent item (authenticated)', async ({request}) => {
        const nonExistentId = 999999;
        const response = await request.put(`${API_BASE_URL}/items/${nonExistentId}`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
            data: {name: 'Attempt to update non-existent'},
        });
        expect(response.status()).toBe(404);
        const data = await response.json();
        expect(data.message).toBe('Item not found');
    });

    test('( ❌ Negative test ) PUT /items/:id → should return 400 for no data provided for update (authenticated)', async ({request}) => {
        const timestamp = Date.now();
        const itemToCreate = {
            name: `No Data Update Item ${timestamp}`,
            description: `No Data Update Description ${timestamp}`
        };
        const createResponse = await request.post(`${API_BASE_URL}/items`, {
            headers: {Authorization: `Bearer ${authToken}`},
            data: itemToCreate,
        });
        expect(createResponse.status()).toBe(201);
        const createdItem = (await createResponse.json()).item;

        const response = await request.put(`${API_BASE_URL}/items/${createdItem.id}`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
            data: {},
        });
        expect(response.status()).toBe(400);
        const data = await response.json();
        expect(data.message).toBe('No data provided for update');
    });

    test('( ✅ Positive test ) DELETE /items/:id → should delete an existing item for an authenticated user', async ({request}) => {
        const timestamp = Date.now();
        const itemToCreate = {name: `Delete Me Item ${timestamp}`, description: `Delete Me Description ${timestamp}`};
        const createResponse = await request.post(`${API_BASE_URL}/items`, {
            headers: {Authorization: `Bearer ${authToken}`},
            data: itemToCreate,
        });
        expect(createResponse.status()).toBe(201);
        const createdItem = (await createResponse.json()).item;

        const response = await request.delete(`${API_BASE_URL}/items/${createdItem.id}`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
        });
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.message).toBe('Item deleted successfully');

        const getResponse = await request.get(`${API_BASE_URL}/items/${createdItem.id}`, {
            headers: {Authorization: `Bearer ${authToken}`},
        });
        expect(getResponse.status()).toBe(404);
    });

    test('( ❌ Negative test ) DELETE /items/:id → should return 404 for a non-existent item (authenticated)', async ({request}) => {
        const nonExistentId = 999998;
        const response = await request.delete(`${API_BASE_URL}/items/${nonExistentId}`, {
            headers: {
                ...HEADERS,
                Authorization: `Bearer ${authToken}`,
            },
        });
        expect(response.status()).toBe(404);
        const data = await response.json();
        expect(data.message).toBe('Item not found');
    });

    test('( ❌ Negative test ) DELETE /items/:id → should return 401 for an unauthenticated user', async ({request}) => {
        const response = await request.delete(`${API_BASE_URL}/items/1`);
        expect(response.status()).toBe(401);
        const data = await response.json();
        expect(data.message).toBe('Authentication failed: No token provided');
    });
});
