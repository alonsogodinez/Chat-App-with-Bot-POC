//TODO: this file can be converted into an isolated script and run as a child process
const uuid = require('uuid');
const amqp = require('amqplib');
const {rabbitmq: rmqConf} = require('../config');
const CONN_URL = `amqp://${rmqConf.user}:${rmqConf.pass}@${rmqConf.host}:${rmqConf.port}/${rmqConf.vhost}`;
const app = require('../app');


async function connect() {
    return amqp.connect(CONN_URL)
        .then(conn => Promise.all([conn.createChannel(), conn]))
}

module.exports.publishToBotQueue = async (data) => {
    const [channel, conn] = await connect();
    const correlationId = uuid();
    //await channel.assertQueue('bot-responses');
    const responseQueue = await channel.assertQueue('', {
        exclusive: true
    })
    await channel.sendToQueue('bot-requests', new Buffer(data), {
        replyTo: responseQueue.queue,
        correlationId,
    });

    channel.consume(responseQueue.queue, function (msg) {
        const {sender, content, room, correlationId} = JSON.parse(msg.content.toString());
        const _correlationId = msg.properties.correlationId || correlationId;
        console.log(_correlationId)
        if (_correlationId === correlationId) {
            app.get('io').sendChatMessage({sender, content, room});
            channel.ack(msg);
            setTimeout(() => conn.close())

        }
    });
};