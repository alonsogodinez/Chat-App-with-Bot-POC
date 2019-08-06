const request = require('request');
const _ = require('lodash');
const amqp = require('amqplib');

const rmqConf = {
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS,
    host: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    vhost: process.env.RABBITMQ_VHOST
};

const CONN_URL = `amqp://${rmqConf.user}:${rmqConf.pass}@${rmqConf.host}:${rmqConf.port}/${rmqConf.vhost}`;
let channel = null;

const csvToJson = (csv) => {
    const content = csv.split('\n');
    const header = content[0].split(',');
    return _.tail(content).map((row) => {
        return _.zipObject(header, row.split(','));
    });
};


amqp.connect(CONN_URL)
    .then(conn => conn.createChannel())
    .then(_channel => {
        channel = _channel;
        return channel.assertQueue('bot-requests',  {
            durable: false
        })
    })
    .then(() => {
        console.log("start listening bot requests...");
        channel.prefetch(1);
        return channel.consume('bot-requests', msg => {
            const messageData = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;
            const { content: stockCode} = messageData;

            return request(`https://stooq.com/q/l/?s=${stockCode}&f=sd2t2ohlcv&h&e=csv`, (err, response, body) => {

                if (err) {
                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(JSON.stringify({ err, correlationId}), {
                            correlationId
                        })
                    )
                } else {

                    let response = { correlationId, room: messageData.room };

                    const closeQuote = csvToJson(body)[0] && csvToJson(body)[0]["Close"];

                    if (!closeQuote || closeQuote === 'N/D') {
                        response.err = `${stockCode.toUpperCase()} is not a valid code.`
                    } else {
                        response.content = `"${stockCode.toUpperCase()} quote is $${csvToJson(body)[0]["Close"]} per share"`;
                        response = {
                            ...messageData,
                            ...response
                        }
                    }

                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(JSON.stringify(response), {
                            correlationId
                        })
                    )
                }
                channel.ack(msg);
            });

        })
    })
    .catch(err => console.log("error ", err));


