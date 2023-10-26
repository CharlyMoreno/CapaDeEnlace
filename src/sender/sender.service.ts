import config from "../config/config";
import { splitStringIntoSubStrings } from "../util/splits";
import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";
import { StatusEnum } from "../data/status.enum";
import { sleep } from "../util/sleep";
import { getCrc } from "../util/crc";

const getNumSeq = (num: number) => {
  return num % 2;
};

export const buildBuffers = (text: string): Buffer[] => {
  let splitText = splitStringIntoSubStrings(text);
  return splitText.map((m, currentIndex) =>
    Buffer.from(buildBody(currentIndex, m), "utf-8")
  );
};

const buildBody = (index: number, data: string) => {
  return `${getNumSeq(index)}${config.CHARACTER_DIVIDER}${data}${
    config.CHARACTER_DIVIDER
  }${getCrc(data)}\n`;
};

export const sendNextString = async (
  buffers: Buffer[],
  currentIndex: number,
  port: SerialPortStream,
  parser: ReadlineParser
) => {
  if (currentIndex < buffers.length) {
    const currentBuffer = buffers[currentIndex];
    await sleep(config.TIME_SLEEP);
    port.write(currentBuffer);
    parser.once("data", (line) => {
      console.log(`[+]: ${line}`);
      if (line === StatusEnum.ACK) {
        currentIndex += 1;
      } else {
        console.log(`[-] Reintentando paquete`);
      }
      sendNextString(buffers, currentIndex, port, parser);
    });
  } else {
    console.log(`All strings sent.`);
    port.close(); // Cerrar el puerto cuando todos los strings han sido enviados
  }
};
