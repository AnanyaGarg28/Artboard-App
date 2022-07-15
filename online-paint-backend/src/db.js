import { MongoClient } from 'mongodb';

let client;

export const connectToMongoDB = async () => {
    client = await MongoClient.connect('mongodb://localhost:27017');
}

export const getConnectionToDB = dbName => {
    const connection = client.db(dbName);
    return connection;
}