const amqp = require('amqplib');
const {rabbitmq: rmqConf} = require('../config');
const CONN_URL = `amqp://${rmqConf.user}:${rmqConf.pass}@${rmqConf.host}:${rmqConf.port}/${rmqConf.vhost}`;
let channel = null;

async function connect() {
    return amqp.connect(CONN_URL)
        .then(conn => conn.createChannel())
}

module.exports.publishToBotQueue = async (data) => {
    if(!channel) channel = await connect();
    channel.sendToQueue('bot-requests', new Buffer(data));
};


process.on('exit', () => {
    channel.close();
    console.log(`Closing rabbitmq channel`);
});