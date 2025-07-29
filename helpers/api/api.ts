import {APIRequestContext} from '@playwright/test';

const API_BASE_URL = process.env.BACKEND_URL;

const HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

/**
 * Creates a new Object via POST request.
 * @param request The Playwright API request context.
 * @param objectType The type of object.
 * @param requestBody The data to send in the request body.
 * @param token Optional JWT token for authorization.
 * @returns An object containing the Playwright Response object and the parsed JSON data.
 */
async function postObject<T>(request: APIRequestContext, objectType: string, requestBody: T, token?: string): Promise<{
    response: any;
    data: any
}> {
    const headers = token ? {...HEADERS, Authorization: `Bearer ${token}`} : HEADERS;
    const response = await request.post(`${API_BASE_URL}/${objectType}`, {
        headers,
        data: requestBody,
    });
    return {response, data: await response.json()};
}

/**
 * Retrieves an Object or list of Objects via GET request.
 * @param request The Playwright API request context.
 * @param objectType The type of object.
 * @param id Optional ID for a specific object.
 * @param token Optional JWT token for authorization.
 * @returns An object containing the Playwright Response object and the parsed JSON data.
 */
async function getObject(request: APIRequestContext, objectType: string, id?: string | number, token?: string): Promise<{
    response: any;
    data: any
}> {
    const headers = token ? {...HEADERS, Authorization: `Bearer ${token}`} : HEADERS;
    const url = id ? `${API_BASE_URL}/${objectType}/${id}` : `${API_BASE_URL}/${objectType}`;
    const response = await request.get(url, {headers});
    return {response, data: await response.json()};
}

/**
 * Updates an existing Object via PUT request.
 * @param request The Playwright API request context.
 * @param objectType The type of object.
 * @param id The ID of the object to update.
 * @param requestBody The data to send in the request body.
 * @param token Optional JWT token for authorization.
 * @returns An object containing the Playwright Response object and the parsed JSON data.
 */
async function putObject<T>(request: APIRequestContext, objectType: string, id: string | number, requestBody: T, token?: string): Promise<{
    response: any;
    data: any
}> {
    const headers = token ? {...HEADERS, Authorization: `Bearer ${token}`} : HEADERS;
    const response = await request.put(`${API_BASE_URL}/${objectType}/${id}`, {
        headers,
        data: requestBody,
    });
    return {response, data: await response.json()};
}

/**
 * Deletes an Object via DELETE request.
 * @param request The Playwright API request context.
 * @param objectType The type of object.
 * @param id The ID of the object to delete.
 * @param token Optional JWT token for authorization.
 * @returns An object containing the Playwright Response object and the parsed JSON data.
 */
async function deleteObject(request: APIRequestContext, objectType: string, id: string | number, token?: string): Promise<{
    response: any;
    data: any
}> {
    const headers = token ? {...HEADERS, Authorization: `Bearer ${token}`} : HEADERS;
    const response = await request.delete(`${API_BASE_URL}/${objectType}/${id}`, {headers});
    return {response, data: await response.json()};
}

export const API = {
    postObject,
    getObject,
    putObject,
    deleteObject,
};