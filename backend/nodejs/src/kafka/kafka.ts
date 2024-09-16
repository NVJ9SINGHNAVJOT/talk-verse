import { IGpMessageType } from "@/db/mongodb/models/GpMessage";
import { IMessageType } from "@/db/mongodb/models/Message";
import { logger } from "@/logger/logger";
import { Kafka, logLevel, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: `${process.env["KAFKA_CLIENT_ID"]}`,
  brokers: `${process.env["KAFKA_BROKERS"]}`.split(","),
  logLevel: logLevel.INFO, // Logging Kafka events
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner, // Use default partitioner for balanced distribution
  retry: {
    retries: 5, // Retrying 5 times for resiliency
    initialRetryTime: 300, // Start with 300ms backoff
    maxRetryTime: 2000, // Maximum backoff of 2 seconds
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

async function message(data: IMessageType) {
  try {
    await producer.send({
      topic: "message",
      messages: [{ value: JSON.stringify(data) }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error in kafka producer, topic: message", { data: data, error: error.message });
    throw new Error("kafka producer error");
  }
}

async function gpMessage(data: IGpMessageType) {
  try {
    await producer.send({
      topic: "gpMessage",
      messages: [{ value: JSON.stringify(data) }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error in kafka producer, topic: gpMessage", { data: data, error: error.message });
    throw new Error("kafka producer error");
  }
}

async function unseenCount(userIds: string[], mainId: string, count?: number) {
  try {
    await producer.send({
      topic: "unseenCount",
      messages: [{ value: JSON.stringify({ userIds, mainId, count }) }],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error in kafka producer, topic: unseenCount", {
      data: { userIds, mainId, count },
      error: error.message,
    });
    throw new Error("kafka producer error");
  }
}

export const kafkaProducer = {
  message,
  gpMessage,
  unseenCount,
};