const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    rabbitmq: {
        user: process.env.RABBITMQ_USER,
        pass: process.env.RABBITMQ_PASS,
        host: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        vhost: process.env.RABBITMQ_VHOST
    },
    mongo: {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        db: process.env.MONGO_DB
    },
    jwt: {
        secret: process.env.JWT_SECRET
    }
};

module.exports = config;



