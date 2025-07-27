// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // To parse JSON bodies
const jwt = require('jsonwebtoken'); // For token-based authentication

const app = express();
const port = 5000; // The port for your Node.js API
const SECRET_KEY = 'your_secret_key'; // A strong secret key for JWT (use environment variables in production)

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(bodyParser.json()); // Parse JSON request bodies

// --- In-memory Data Store (for simplicity) ---
// In a real application, you would use a database (e.g., MongoDB, PostgreSQL)
const users = [
    { id: 1, username: 'testuser', password: 'password123' },
    { id: 2, username: 'admin', password: 'adminpassword' },
];

let items = [
    { id: 1, name: 'Item A', description: 'Description for Item A' },
    { id: 2, name: 'Item B', description: 'Description for Item B' },
];
let nextItemId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;

// --- Helper Functions ---

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        console.log('Authentication failed: No token provided');
        return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Authentication failed: Invalid token', err.message);
            return res.status(403).json({ message: 'Authentication failed: Invalid token' });
        }
        req.user = user; // Attach user payload to the request
        next(); // Proceed to the next middleware/route handler
    });
};

// --- API Endpoints ---

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js API!');
});

// 1. Basic Message Endpoint (from previous version)
app.get('/api/message', (req, res) => {
    console.log('Received request for /api/message');
    res.json({ message: 'Hello from the Node.js Backend API!' });
});

// 2. User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // If user exists, create a JWT token
        const accessToken = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`User ${username} logged in successfully.`);
        res.json({ message: 'Login successful', token: accessToken });
    } else {
        // If user not found or credentials invalid
        console.log(`Login failed for username: ${username}`);
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// 3. Get All Items (protected route)
app.get('/api/items', authenticateToken, (req, res) => {
    console.log(`User ${req.user.username} requested all items.`);
    res.json(items);
});

// 4. Get Single Item by ID (protected route)
app.get('/api/items/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);

    if (item) {
        console.log(`User ${req.user.username} requested item with ID: ${id}`);
        res.json(item);
    } else {
        console.log(`Item with ID: ${id} not found.`);
        res.status(404).json({ message: 'Item not found' });
    }
});

// 5. Create New Item (protected route)
app.post('/api/items', authenticateToken, (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        console.log('Failed to create item: Missing name or description');
        return res.status(400).json({ message: 'Name and description are required' });
    }

    const newItem = { id: nextItemId++, name, description };
    items.push(newItem);
    console.log(`User ${req.user.username} created new item:`, newItem);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
});

// 6. Update Existing Item (protected route)
app.put('/api/items/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const itemIndex = items.findIndex(i => i.id === id);

    if (itemIndex > -1) {
        // Check if name or description are provided for update
        if (!name && !description) {
            console.log('Failed to update item: No data provided for update');
            return res.status(400).json({ message: 'No data provided for update' });
        }

        // Update only provided fields
        if (name) items[itemIndex].name = name;
        if (description) items[itemIndex].description = description;

        console.log(`User ${req.user.username} updated item with ID: ${id}`);
        res.json({ message: 'Item updated successfully', item: items[itemIndex] });
    } else {
        console.log(`Failed to update item: Item with ID: ${id} not found.`);
        res.status(404).json({ message: 'Item not found' });
    }
});

// 7. Delete Item (protected route)
app.delete('/api/items/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(i => i.id !== id);

    if (items.length < initialLength) {
        console.log(`User ${req.user.username} deleted item with ID: ${id}`);
        res.json({ message: 'Item deleted successfully' });
    } else {
        console.log(`Failed to delete item: Item with ID: ${id} not found.`);
        res.status(404).json({ message: 'Item not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Node.js API listening at http://localhost:${port}`);
});

