const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatebase() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    database = client.db('online-shop');
}

function getDb() {
    if (!database) {
        throw new Error();
    } 
    return database;
}

module.exports = {
    connectToDatebase: connectToDatebase,
    getDb: getDb
}
