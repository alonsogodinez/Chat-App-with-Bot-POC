const env = process.env.NODE_ENV || 'development';
const config = {

    development: {
        rabbitmq: {
            user: 'user',
            pass: 'pass',
            host: 'rabbitmq',
            port: '5672',
            vhost: 'vhost'
        },
        mongo: {

        }

    },
    stage: {
        rabbitmq: {
            user: 'user',
            pass: 'pass',
            host: 'stage.rabbitmq',
            port: '5672',
            vhost: 'vhost'
        },
        mongo: {

        }
    },

    production: {
        rabbitmq: {
            user: 'user',
            pass: 'pass',
            host: 'prod.rabbitmq',
            port: '5672',
            vhost: 'vhost'
        },
        mongo: {

        }
    }
};

module.exports = config[env];



