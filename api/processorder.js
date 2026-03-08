const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
const nodemailer = require("nodemailer");

app.storageQueue('processorder', {
    queueName: 'orders',
    connection: 'AzureWebJobsStorage',

    handler: async (message, context) => {

        const order = message;

        context.log("Processing order:", order);

        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);

        const database = client.database("ordersdb");
        const container = database.container("orders");

        await container.items.create({
            id: Date.now().toString(),
            ...order
        });

        context.log("Order stored in Cosmos DB");

        // EMAIL CONFIG
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Order Received",
            text: `
New Order Received

Shop: ${order.shopName}
Mobile: ${order.mobile}

Lassi: ${order.lassi}
Mattha: ${order.mattha}
Buttermilk: ${order.buttermilk}
`
        };

        await transporter.sendMail(mailOptions);

        context.log("Email sent successfully");
    }
});
