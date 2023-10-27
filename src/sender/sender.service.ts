import config from "../config/config";
import "colorts/lib/string";
import { getDataFromPayload, splitStringIntoSubStrings } from "../util/splits";
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

// const failRandomBuffer = (buffer: Buffer) => {
//   const { numSeq, data, crc } = getDataFromPayload(buffer.toString());
//   const random = Math.floor(Math.random() * (4 + 1));
//   if (random === 2) {
//     return Buffer.from(buildBody(Number(numSeq) + 1, data), "utf-8");
//   }
//   return buffer;
// };

const failRandomBuffer = (buffers: Buffer[], index: number) => {
  const random = Math.floor(Math.random() * (4 + 1));
  if (random === 2 && index > 0) {
    return buffers[index - 1];
  }
  return buffers[index];
};

export const sendNextString = async (
  buffers: Buffer[],
  currentIndex: number,
  port: SerialPortStream,
  parser: ReadlineParser
) => {
  if (currentIndex < buffers.length) {
    if(currentIndex === 0) {
      // Enviar ACK para avisar que empiezo a transmitir
      const buffer = Buffer.from(`${StatusEnum.ACK}\n`,"utf-8")
      port.write(buffer);
    }
    let currentBuffer = buffers[currentIndex];
    if (config.ACTIVE_FAILED) {
      currentBuffer = failRandomBuffer(buffers, currentIndex);
    }
    await sleep(config.TIME_SLEEP);
    port.write(currentBuffer);
    parser.once("data", (line) => {
      if (line === StatusEnum.ACK) {
        console.log(`[+]: ${line}`.green);
        currentIndex += 1;
      } else {
        console.log(`[-]: ${line} -  Reintentando paquete`.red);
      }
      sendNextString(buffers, currentIndex, port, parser);
    });
  } else {
    console.log(`All strings sent.`);
    port.close(); // Cerrar el puerto cuando todos los strings han sido enviados
  }
};
