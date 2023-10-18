import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { SerialPort } from "serialport";
import config from "../config/config";

const port = new SerialPortStream({
  binding: SerialPort.binding,
  path: `/dev/pts/${config.PORT_SENDER}`,
  baudRate: config.BAUDRATE,
});

const parser = new ReadlineParser();
//@ts-ignore

// @ts-ignore
port.on("open", () => {
  const buffer = Buffer.from("Hola mundo\n", "utf-8");
  console.log("Started connection");
  console.log("-------------------");
  port.write(buffer, "utf-8");
});

port.pipe(parser).on("data", (line) => {
  console.log("Escuchand");
});

port.on("close", () => {
  console.log("CLOSING SESSION");
});
