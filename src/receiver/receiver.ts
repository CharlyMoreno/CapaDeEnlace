import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { SerialPort } from "serialport";
import { ReceiverService } from "./receiver.service";
import config from "../config/config";
import moment from "moment";
import "colorts/lib/string";


const port = new SerialPortStream({
  binding: SerialPort.binding,
  path: `/dev/pts/${config.PORT_RECEIVER}`,
  baudRate: config.BAUDRATE,
});

const receiveService = new ReceiverService(port);
const parser = new ReadlineParser();

port.on("open", () => {
  console.log(
    `[----] - RECEIVER STARTED at ${moment().format("DD-MM-yyyy HH:mm")}`.yellow
  );
});

port.on("close", () => {
  console.log(
    `[XXXX] - RECEIVER CLOSED at ${moment().format("DD-MM-yyyy HH:mm")}`.yellow
  );
});

//@ts-ignore
port.pipe(parser).on("data", (line) => {
  receiveService.receiveMessage(line);
});
