import { SerialPortStream } from "@serialport/stream";
import { StatusEnum } from "../data/status.enum";
import config from "../config/config";
import { getDataFromPayload } from "../util/splits";
import { getCrc } from "../util/crc";
export class ReceiverService {
  messages: Buffer[];
  port: SerialPortStream;
  constructor(port: SerialPortStream) {
    this.messages = [];
    this.port = port;
  }
  checkNumSeq = (payload: string) => {
    const lastMessage = this.messages[this.messages.length]?.toString();
    if (!lastMessage) {
      return true;
    }
    const { numSeq } = getDataFromPayload(payload);
    const { numSeq: lastNumSeq } = getDataFromPayload(lastMessage);
    return numSeq === lastNumSeq;
  };
  checkCrc = (payload: string) => {
    const lastMessage = this.messages[this.messages.length]?.toString() || "";
    if (!lastMessage) {
      return true;
    }
    const { crc, data } = getDataFromPayload(payload);
    const crcData = getCrc(data);
    return crc === crcData.toString();
  };
  receiveMessage = (buffer: Buffer) => {
    const payload = buffer.toString();
    this.printMessage(payload);
    if (!this.checkNumSeq(payload) || !this.checkCrc(payload)) {
      console.log(`[Message ${this.messages.length}] - Failed `);
      this.sendResponse(StatusEnum.NACK);
      return;
    }
    this.messages.push(buffer);
    this.sendResponse(StatusEnum.ACK);
  };
  sendResponse = (status: StatusEnum) => {
    const buffer = Buffer.from(`${status}\n`, "utf-8");
    this.port.write(buffer, "utf-8");
  };
  printMessage = (payload: string) => {
    const { numSeq, crc, data } = getDataFromPayload(payload);
    console.log(
      `[Message #${this.messages.length}] - [Num Seq] = ${numSeq} | [CRC] = ${crc} | [Data Length] = ${data.length}`
    );
  };
}
