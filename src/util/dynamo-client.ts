import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
require('dotenv').config()

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export { dynamoClient };

