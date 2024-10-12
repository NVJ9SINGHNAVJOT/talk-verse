import { KafkaIGpMessageType } from "@/db/mongodb/models/GpMessage";
import { KafkaIMessageType } from "@/db/mongodb/models/Message";
import { logger } from "@/logger/logger";
import { Kafka, logLevel, Partitioners } from "kafkajs";

// Create a new Kafka instance with the specified configurations
const kafka = new Kafka({
  // Set the client ID for identification in Kafka
  clientId: `${process.env["KAFKA_CLIENT_ID"]}`,

  // Define the brokers to connect to, split by commas for multiple entries
  brokers: `${process.env["KAFKA_BROKERS"]}`.split(","),

  // Set the logging level to INFO to log Kafka events
  logLevel: logLevel.INFO,

  // Configure retry settings for connection attempts
  retry: {
    // Number of times to retry connecting before failing
    retries: 5,
  },
});

// Create a new producer instance for sending messages to Kafka topics
const producer = kafka.producer({
  // Use the default partitioner for distributing messages across partitions evenly
  createPartitioner: Partitioners.DefaultPartitioner,

  // Configure retry settings for sending messages
  retry: {
    // Number of times to retry sending messages on failure
    retries: 10, // Retrying 10 times for resiliency

    // Initial backoff time before the first retry (in milliseconds)
    initialRetryTime: 300, // Start with 300ms backoff

    // Maximum backoff time for retries (in milliseconds)
    maxRetryTime: 2000, // Maximum backoff of 2 seconds

    // Backoff factor to apply after each failed attempt
    factor: 0.2, // Backoff factor
  },
});

export const kafkaProducerSetup = async () => {
  try {
    await producer.connect();
    logger.info("Kafka producer connected");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("Error connecting Kafka producer", { error: error.message });
    process.exit(1);
  }
};

export const kafkaProducerDisconnect = async () => {
  await producer.disconnect();
  logger.info("kafka producer disconnected");
};

async function message(data: KafkaIMessageType) {
  try {
    await producer.send({
      topic: "message",
      messages: [{ value: JSON.stringify(data) }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error in kafka producer, topic: message", { data: data, error: error.message });
  }
}

async function gpMessage(data: KafkaIGpMessageType) {
  try {
    await producer.send({
      topic: "gp-message",
      messages: [{ value: JSON.stringify(data) }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error in kafka producer, topic: gp-message", { data: data, error: error.message });
  }
}

async function unseenCount(userIds: string[], mainId: string, count?: number) {
  try {
    await producer.send({
      topic: "unseen-count",
      messages: [{ value: JSON.stringify({ userIds, mainId, count }) }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error in kafka producer, topic: unseen-count", {
      data: { userIds, mainId, count },
      error: error.message,
    });
  }
}

export const kafkaProducer = {
  message,
  gpMessage,
  unseenCount,
};
