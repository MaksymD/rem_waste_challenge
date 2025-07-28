import {expect, test} from '@playwright/test';
import {USERS} from "../../constrants/USERS";
import {API} from "../../helpers/api/api";

test.describe.serial('API Tests', () => {
    let authToken: string;

    test.beforeAll(async ({request}) => {
        console.log(`Attempting to log in to: ${process.env.BACKEND_URL}/login`);
        const {response, data} = await API.postObject(request, 'login', {
            username: USERS.DEV.TEST_USER.name,
            password: USERS.DEV.TEST_USER.password,
        });

        expect(response.ok(), `Login failed in beforeAll. Status: ${response.status()}, Body: ${await response.text()}`).toBeTruthy();
        authToken = data.token;
        expect(authToken).toBeDefined();
        console.log(`Authenticated with token: ${authToken.substring(0, 10)}...`);
    });

    test('( ✅ Positive test ) - POST /login → should allow successful login with valid credentials', async ({request}) => {
        const {response, data} = await API.postObject(request, 'login', {
            username: USERS.DEV.TEST_USER.name,
            password: USERS.DEV.TEST_USER.password,
        });
        expect(response.ok(), `Login failed. Status: ${response.status()}, Body: ${await response.text()}`).toBeTruthy();
        expect(data.message).toBe('Login successful');
        expect(data.token).toBeDefined();
    });

    test('( ❌ Negative test ) - POST /login → should return 401 for invalid credentials', async ({request}) => {
        const {response, data} = await API.postObject(request, 'login', {
            username: USERS.DEV.FAKE_USER.name,
            password: USERS.DEV.FAKE_USER.password,
        });
        expect(response.status()).toBe(401);
        expect(data.message).toBe('Invalid credentials');
    });

    test('( ✅ Positive test ) - GET /items → should return all items for an authenticated user', async ({request}) => {
        const {response, data: items} = await API.getObject(request, 'items', undefined, authToken);
        expect(response.ok()).toBeTruthy();
        expect(Array.isArray(items)).toBeTruthy();
    });

    test('( ❌ Negative test ) - GET /items → should return 401 for an unauthenticated user', async ({request}) => {
        const {response, data} = await API.getObject(request, 'items');
        expect(response.status()).toBe(401);
        expect(data.message).toBe('Authentication failed: No token provided');
    });

    test('( ✅ Positive test ) - POST /items → should create a new item for an authenticated user', async ({request}) => {
        const timestamp = Date.now();
        const newItem = {
            name: `API Test New Item ${timestamp}`,
            description: `Description for API Test New Item ${timestamp}`,
        };
        const {response, data} = await API.postObject(request, 'items', newItem, authToken);
        expect(response.status()).toBe(201);
        expect(data.message).toBe('Item created successfully');
        expect(data.item).toMatchObject(newItem);
        expect(data.item.id).toBeDefined();
    });

    test('( ❌ Negative test ) - POST /items → should return 400 for missing data (authenticated)', async ({request}) => {
        const {
            response,
            data
        } = await API.postObject(request, 'items', {name: 'Item with missing description'}, authToken);
        expect(response.status()).toBe(400);
        expect(data.message).toBe('Name and description are required');
    });

    test('( ❌ Negative test ) - POST /items → should return 401 for an unauthenticated user', async ({request}) => {
        const {response, data} = await API.postObject(request, 'items', {
            name: 'Unauthorized Item',
            description: 'Unauthorized Description'
        });
        expect(response.status()).toBe(401);
        expect(data.message).toBe('Authentication failed: No token provided');
    });

    test('( ✅ Positive test ) - PUT /items/:id → should update an existing item for an authenticated user', async ({request}) => {
        const timestamp = Date.now();
        const itemToCreate = {name: `Original Item ${timestamp}`, description: `Original Description ${timestamp}`};
        const {
            response: createResponse,
            data: createData
        } = await API.postObject(request, 'items', itemToCreate, authToken);
        expect(createResponse.status()).toBe(201);
        const createdItem = createData.item;

        const updatedData = {name: `Updated Item ${timestamp}`, description: `Updated Description ${timestamp}`};
        const {response, data} = await API.putObject(request, 'items', createdItem.id, updatedData, authToken);
        expect(response.ok()).toBeTruthy();
        expect(data.message).toBe('Item updated successfully');
        expect(data.item.name).toBe(updatedData.name);
        expect(data.item.description).toBe(updatedData.description);
        expect(data.item.id).toBe(createdItem.id);
    });

    test('( ❌ Negative test ) - PUT /items/:id → should return 404 for a non-existent item (authenticated)', async ({request}) => {
        const nonExistentId = 999999;
        const {
            response,
            data
        } = await API.putObject(request, 'items', nonExistentId, {name: 'Attempt to update non-existent'}, authToken);
        expect(response.status()).toBe(404);
        expect(data.message).toBe('Item not found');
    });

    test('( ❌ Negative test ) - PUT /items/:id → should return 400 for no data provided for update (authenticated)', async ({request}) => {
        const timestamp = Date.now();
        const itemToCreate = {
            name: `No Data Update Item ${timestamp}`,
            description: `No Data Update Description ${timestamp}`
        };
        const {
            response: createResponse,
            data: createData
        } = await API.postObject(request, 'items', itemToCreate, authToken);
        expect(createResponse.status()).toBe(201);
        const createdItem = createData.item;
        const {response, data} = await API.putObject(request, 'items', createdItem.id, {}, authToken);
        expect(response.status()).toBe(400);
        expect(data.message).toBe('No data provided for update');
    });

    test('( ❌ Negative test ) - PUT /items/:id → should return 401 for an unauthenticated user', async ({request}) => {
        const {response, data} = await API.putObject(request, 'items', 1, {name: 'Unauthorized Update'});
        expect(response.status()).toBe(401);
        expect(data.message).toBe('Authentication failed: No token provided');
    });

    test('( ✅ Positive test ) - DELETE /items/:id → should delete an existing item for an authenticated user', async ({request}) => {
        const timestamp = Date.now();
        const itemToCreate = {name: `Delete Me Item ${timestamp}`, description: `Delete Me Description ${timestamp}`};
        const {
            response: createResponse,
            data: createData
        } = await API.postObject(request, 'items', itemToCreate, authToken);
        expect(createResponse.status()).toBe(201);
        const createdItem = createData.item;
        const {response, data} = await API.deleteObject(request, 'items', createdItem.id, authToken);
        expect(response.ok()).toBeTruthy();
        expect(data.message).toBe('Item deleted successfully');
        const {response: getResponse} = await API.getObject(request, 'items', createdItem.id, authToken);
        expect(getResponse.status()).toBe(404);
    });

    test('( ❌ Negative test ) - DELETE /items/:id → should return 404 for a non-existent item (authenticated)', async ({request}) => {
        const nonExistentId = 999998;
        const {response, data} = await API.deleteObject(request, 'items', nonExistentId, authToken);
        expect(response.status()).toBe(404);
        expect(data.message).toBe('Item not found');
    });

    test('( ❌ Negative test ) - DELETE /items/:id → should return 401 for an unauthenticated user', async ({request}) => {
        const {response, data} = await API.deleteObject(request, 'items', 1);
        expect(response.status()).toBe(401);
        expect(data.message).toBe('Authentication failed: No token provided');
    });
});
