const mongoDbStore = require('connect-mongodb-session');
const expressSession = require('express-session');

function createSessionStore() {
    const MongoDbStore = mongoDbStore(expressSession);

    const store = new MongoDbStore({
        uri: 'mongodb://127.0.0.1:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });
    return store;
}

function createSessionConfig() {
    return {
        secret: 'super-secret-lulu-key-325',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 *1000
        }
    };
}

module.exports = createSessionConfig;
