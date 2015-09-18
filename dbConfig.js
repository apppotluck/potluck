var config = {
    detailedErrors: true,
    debug: true,
    hostname: 'localhost',
    port: 4000,
    model: {
        defaultAdapter: 'mongo'
    },
    db: {
        mongo: {
            dbname: 'potluck'
        }
    },
    sessions: {
        store: 'memory',
        key: 'sid',
        expiry: 14 * 24 * 60 * 60
    }
};
module.exports = config