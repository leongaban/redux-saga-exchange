import * as base32 from 'hi-base32';
import * as crc from 'crc';
import { Buffer } from 'buffer';

function calculateChecksum(payload: Buffer): Buffer {
  const checksum = Buffer.alloc(2);
  checksum.writeUInt16LE(crc.crc16xmodem(payload), 0);
  return checksum;
}

function verifyChecksum(expected: Buffer, actual: number[]) {
  if (expected.length !== actual.length) {
    return false;
  }

  if (expected.length === 0) {
    return true;
  }

  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      return false;
    }
  }

  return true;
}

function validate(address: string): boolean {
  if (address.length !== 56) {
    return false;
  }
  try {
    const decoded = base32.decode.asBytes(address);
    const payload = decoded.slice(0, -2);
    const checksum = decoded.slice(-2);
    const expectedChecksum = calculateChecksum(Buffer.from(payload));
    return verifyChecksum(expectedChecksum, checksum);
  } catch (error) {
    return false;
  }
}

export default validate;
