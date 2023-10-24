import config from "../config/config";
import { splitStringIntoSubStrings } from "../util/splits";
import CRC32 from "crc-32";
import { ReadlineParser } from "@serialport/parser-readline";
import { SerialPortStream } from "@serialport/stream";

const getNumSeq = (num: number) => {
  return num % 2;
};

const getCrc = (data: string) => {
  return CRC32.str(data);
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

// export const sendMessage = (
//   text: string,
//   port: SerialPortStream,
//   parser: ReadlineParser
// ) => {
//   const buffers = buildBuffers(text);

//   buffers.forEach((buffer) => {
//     port.write(buffer);
//     parser.once("data", (line) => {
//         console.log(line); // Esto debería ser la confirmación del receiver
//         currentIndex++;
//         sendNextString();
//       });
//   });
// };

export const sendNextString = async (
  buffers: Buffer[],
  currentIndex: number,
  port: SerialPortStream,
  parser: ReadlineParser
) => {
  if (currentIndex < buffers.length) {
    const currentBuffer = buffers[currentIndex];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    port.write(currentBuffer);
    parser.once("data", (line) => {
      console.log(`[+]: ${line}`);
      if (line === "ACK") {
        currentIndex += 1;
      } else {
        console.log(`[-] Reintentando paquete`)
      }
      sendNextString(buffers, currentIndex, port, parser);
    });
  } else {
    console.log(`All strings sent.`);
    port.close(); // Cerrar el puerto cuando todos los strings han sido enviados
  }
};
