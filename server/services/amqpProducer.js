const amqp = require('amqplib/callback_api');

amqp.connect('amqp://user:pass@rabbitmq:5672/vhost', (error, connection)  =>{
    if (error) {
        throw error;
    }
    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }

        const queue = 'hello';
        const msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(() => {
      connection.close();
        process.exit(0);
    }, 500);
});