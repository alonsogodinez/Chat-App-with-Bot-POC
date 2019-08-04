const amqp = require('amqplib');
const { rabbitmq: rmqConf}  = require('../config');
const CONN_URL = `amqp://${rmqConf.user}:${rmqConf.pass}@${rmqConf.host}:${rmqConf.port}/${rmqConf.vhost}`;
let channel = null;

amqp.connect(CONN_URL)
    .then(conn => conn.createChannel())
    .then(_channel => {
        channel = _channel;
        return channel.assertQueue('bot-requests')
    })
    .then(() => {
        console.log("start listening bot requests...");
        return channel.consume('bot-requests', msg =>  {
            console.log("CSV parsed" ,msg.content.toString())
            channel.ack(msg);

        })
    })
    .catch(err => console.log("error por ", err));


