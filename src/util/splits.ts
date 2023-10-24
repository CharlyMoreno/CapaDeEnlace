import config from "../config/config";

export const splitBuffer = (
  buffer: Buffer,
  subBufferSize = config.BUFFER_SIZE
) => {
  const numSubBuffers = Math.ceil(buffer.length / subBufferSize);
  console.log(numSubBuffers);
  const subBuffers = [];

  for (let i = 0; i < numSubBuffers; i++) {
    const start = i * subBufferSize;
    const end = Math.min((i + 1) * subBufferSize, buffer.length);
    console.log(`${start} - ${end}`);
    const subBuffer = buffer.slice(start, end);
    subBuffers.push(subBuffer);
  }

  return subBuffers;
};

export const splitStringIntoSubStrings = (
  str: string,
  subStringSize = config.BUFFER_SIZE
): string[] => {
  const numSubStrings = Math.ceil(str.length / subStringSize);
  const subStrings = [];

  for (let i = 0; i < numSubStrings; i++) {
    const start = i * subStringSize;
    const end = Math.min((i + 1) * subStringSize, str.length);
    const subString = str.slice(start, end);
    subStrings.push(subString);
  }

  return subStrings;
};

export const getDataFromPayload = (payload: string) => {
  const numSeq = payload.split(config.CHARACTER_DIVIDER)[0];
  const data = payload.split(config.CHARACTER_DIVIDER)[1];
  const crc = payload.split(config.CHARACTER_DIVIDER)[2];
  return { numSeq, data, crc };
};
