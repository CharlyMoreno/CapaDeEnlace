import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { SerialPort } from "serialport";
import config from "../config/config";

const port = new SerialPortStream({
  binding: SerialPort.binding,
  path: `/dev/pts/${config.PORT_RECEIVER}`,
  baudRate: config.BAUDRATE,
});

const parser = new ReadlineParser();

port.on("open", () => {
  console.log("Started receiver | Will close in 20 secs");
});

port.on("close", () => {
  console.log("Closing receiver");
});

//@ts-ignore
port.pipe(parser).on("data", (line) => {
  console.log("Escuchando");
  console.log(line);
});
