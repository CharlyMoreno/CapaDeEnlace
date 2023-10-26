import CRC32 from "crc-32";

export const getCrc = (data: string) => {
  return CRC32.str(data);
};
