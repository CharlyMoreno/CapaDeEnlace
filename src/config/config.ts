import * as dotenv from "dotenv";

dotenv.config();

export default {
  PORT_SENDER: process.env.PORT_SENDER || 1,
  PORT_RECEIVER: process.env.PORT_RECEIVER || 2,
  BAUDRATE: Number(process.env.BAUDRATE) || 14400,
  BUFFER_SIZE: Number(process.env.BUFFER_SIZE) || 1024, // 1KB
  CHARACTER_DIVIDER: process.env.CHARACTER_DIVIDER || '#'
};
