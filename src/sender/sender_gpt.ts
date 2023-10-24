import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { SerialPort } from "serialport";
import config from "../config/config";
import { getLargeText } from "../util/lorem";
import moment from "moment";

const port = new SerialPortStream({
  binding: SerialPort.binding,
  path: `/dev/pts/${config.PORT_SENDER}`,
  baudRate: config.BAUDRATE,
});

const parser = new ReadlineParser();

const dataArray = ['string1', 'string2', 'string3']; // Aquí puedes definir tu array de strings

let currentIndex = 0;

port.on("open", () => {
  console.log(`----> SENDER STARTED at ${moment().format("DD-MM-yyyy HH:mm")}`);
  sendNextString();
});

function sendNextString() {
  if (currentIndex < dataArray.length) {
    const currentString = dataArray[currentIndex];
    port.write(`${currentString}\n`, () => {
      console.log(`Sent: ${currentString}`);
    });

    parser.once("data", (line) => {
      console.log(line); // Esto debería ser la confirmación del receiver
      currentIndex++;
      sendNextString();
    });
  } else {
    console.log(`All strings sent.`);
    port.close(); // Cerrar el puerto cuando todos los strings han sido enviados
  }
}

port.pipe(parser);

port.on("close", () => {
  console.log(`[XXXX] - SENDER CLOSED at ${moment().format("DD-MM-yyyy HH:mm")}`);
});
