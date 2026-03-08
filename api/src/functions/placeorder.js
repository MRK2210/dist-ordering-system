const { app } = require('@azure/functions');
const { QueueClient } = require('@azure/storage-queue');

app.http('placeorder', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        let order;

        try {
            order = await request.json();
        } catch (err) {
            return {
                status: 400,
                body: "Invalid or empty JSON body"
            };
        }
        const connectionString = process.env.AzureWebJobsStorage;
        const queueName = "orders";

        const queueClient = new QueueClient(connectionString, queueName);

        await queueClient.createIfNotExists();

        const message = Buffer.from(JSON.stringify(order)).toString('base64');

        await queueClient.sendMessage(message);

        context.log("Order added to queue:", order);

        return {
            status: 200,
            body: `Order placed successfully for ${order.shopName}`
        };
    }
});