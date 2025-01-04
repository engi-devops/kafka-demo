const express = require('express');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config()

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Set the environment variable to suppress the warning
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';
const { Kafka } = require('kafkajs');
const kafkaBroker = process.env.KAFKA_BROKER; // Example: 'localhost:9092'
if (!kafkaBroker) {
  throw new Error('KAFKA_BROKER environment variable is not set');
}
console.log('Kafka brokers:', [process.env.KAFKA_BROKER]);
// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [kafkaBroker],
});
const producer = kafka.producer(); 

const produceMessages = async () => {
  try {
      // Connect the producer
        try {
            await producer.connect();
            console.log('Producer connected');
        } catch (error) {
            console.error("Kafka connection error:", error.message);
            console.error("Broker info:", error.broker);
            throw error; // Re-throw to handle it in a higher-level function
        }
    // Kafka topic
    const topic = 'test';
    // Data to produce
    const data = [
      { phone_number: '9429929149', name: 'Santosh', age: Math.floor(Math.random() * 50) + 20 }
    ];


    // Produce messages
    for (const record of data) {
        try { 
            const result = await producer.send({
                topic, 
                messages: [
                    { 
                      value: JSON.stringify(record), // Serialize message as JSON
                    },
                ],
            });
            console.log(`Message sent successfully: ${JSON.stringify(record)}`);
            console.log(`Result: ${JSON.stringify(result)}`);
        } catch (sendError) {
            console.log('sendError :>> ', sendError);
            console.error(`Failed to send message: ${sendError}`);
        }
    }

    // Disconnect the producer
    await producer.disconnect();
    console.log("Producer disconnected");
    
  } catch (connectionError) {
    console.error(`Failed to connect to Kafka: ${connectionError}`);
  }
};

// Run the producer
produceMessages().catch((error) => {
  console.error(`Error in producer: ${error}`);
});


module.exports = app;