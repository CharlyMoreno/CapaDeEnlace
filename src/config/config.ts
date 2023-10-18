import * as dotenv from "dotenv";

dotenv.config();

export default {
  PORT_SENDER: process.env.PORT_SENDER || 1,
  PORT_RECEIVER: process.env.PORT_RECEIVER || 2,
  BAUDRATE: Number(process.env.BAUDRATE) || 14400,
};
