import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { SerialPort } from "serialport";
import config from "../config/config";
import { getLargeText } from "../util/lorem";
import moment from "moment";
import { buildBuffers, sendNextString } from "./sender.service";
import "colorts/lib/string";


const port = new SerialPortStream({
  binding: SerialPort.binding,
  path: `/dev/pts/${config.PORT_SENDER}`,
  baudRate: config.BAUDRATE,
});

const parser = new ReadlineParser();
//@ts-ignore

// @ts-ignore
port.on("open", () => {
  console.log(`----> SENDER STARTED at ${moment().format("DD-MM-yyyy HH:mm")}`.yellow);
  const buffers = buildBuffers(getLargeText(10));
  console.log(`[X] Count buffers: ${buffers.length}`.yellow);
  sendNextString(buffers, 0, port, parser);
});

// port.pipe(parser).on("data", (line) => {
//   console.log(line);
// });

port.pipe(parser);

port.on("close", () => {
  console.log(
    `[XXXX] - SENDER CLOSED at ${moment().format("DD-MM-yyyy HH:mm")}.`.yellow
  );
});
