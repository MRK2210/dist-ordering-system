const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getorders', {
    methods: ['GET'],
    authLevel: 'anonymous',

    handler: async (request, context) => {

        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);

        const database = client.database("ordersdb");
        const container = database.container("orders");

        const query = {
            query: "SELECT * FROM c ORDER BY c._ts DESC"
        };

        const { resources } = await container.items.query(query).fetchAll();

        return {
            status: 200,
            jsonBody: resources
        };
    }
});
