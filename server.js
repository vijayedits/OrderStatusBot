const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON

// Sample order data (replace with your real data source)
const orders = {
    '12345': { status: 'Shipped', deliveryDate: '2024-10-30', trackingNumber: 'TRACK123' },
    '67890': { status: 'Processing', deliveryDate: '2024-11-05', trackingNumber: '' },
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint for order status queries
app.get('/order/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const order = orders[orderId];

    if (order) {
        res.json({ orderId, ...order });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Endpoint for Dialogflow webhook to check order status
app.post('/webhook', (req, res) => {
    const orderId = req.body.queryResult.parameters.orderId;
    const order = orders[orderId];

    if (order) {
        res.json({
            fulfillmentText: `Order ID: ${orderId}\nStatus: ${order.status}\nDelivery Date: ${order.deliveryDate}\nTracking Number: ${order.trackingNumber}`,
        });
    } else {
        res.json({
            fulfillmentText: 'Sorry, I could not find that order. Please check the Order ID.',
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
