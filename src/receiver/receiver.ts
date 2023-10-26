import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { SerialPort } from "serialport";
import { ReceiverService } from "./receiver.service";
import config from "../config/config";
import moment from "moment";

const port = new SerialPortStream({
  binding: SerialPort.binding,
  path: `/dev/pts/${config.PORT_RECEIVER}`,
  baudRate: config.BAUDRATE,
});

const receiveService = new ReceiverService(port);
const parser = new ReadlineParser();

port.on("open", () => {
  console.log(
    `[----] - RECEIVER STARTED at ${moment().format("DD-MM-yyyy HH:mm")}`
  );
});

port.on("close", () => {
  console.log(
    `[XXXX] - RECEIVER CLOSED at ${moment().format("DD-MM-yyyy HH:mm")}`
  );
});

//@ts-ignore
port.pipe(parser).on("data", (line) => {
  receiveService.receiveMessage(line);
  // console.log(line);
  // const random = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
  // let response = "ACK";
  // if (random === 2) response = "NACK";
  // const buffer = Buffer.from(`${response}\n`, "utf-8");
  // port.write(buffer, "utf-8");
});
