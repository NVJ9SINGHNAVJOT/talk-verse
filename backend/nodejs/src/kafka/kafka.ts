import { logger } from "@/logger/logger";
import { SoGroupMessageRecieved, SoMessageRecieved } from "@/types/socket/eventTypes";
import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env["KAFKA_CLIENT_ID"],
  brokers: process.env["KAFKA_BROKERS"].split(","), // Kafka in KRaft mode
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  allowAutoTopicCreation: true,
});

export const kafkaProducerSetup = async () => {
  try {
    await producer.connect();
    logger.info("kafka producer connected");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error("error while connecting kafka producer", { error: error.message });
    process.exit();
  }
};

export const kafkaProducerDisconnect = async () => {
  await producer.disconnect();
  logger.info("kafka producer disconnected");
};

async function message(data: SoMessageRecieved) {
  try {
    await producer.send({
      topic: "message",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    logger.error("error in kafka producer, topic: message", { data: data });
  }
}

async function gpMessage(data: SoGroupMessageRecieved) {
  try {
    await producer.send({
      topic: "gpMessage",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    logger.error("error in kafka producer, topic: gpMessage", { data: data });
  }
}

async function unseenCount(userId: string, mainId: string, count: number) {
  try {
    await producer.send({
      topic: "unseenCount",
      messages: [{ value: JSON.stringify({ userId, mainId, count }) }],
    });
  } catch (error) {
    logger.error("error in kafka producer, topic: unseenCount", { data: { userId, mainId, count } });
  }
}

async function setOrder(mainId: string) {
  try {
    await producer.send({
      topic: "setOrder",
      messages: [{ value: JSON.stringify({ mainId }) }],
    });
  } catch (error) {
    logger.error("error in kafka producer, topic: setOrder", { data: { mainId } });
  }
}

export const kafkaProducer = {
  message,
  gpMessage,
  unseenCount,
  setOrder,
};
