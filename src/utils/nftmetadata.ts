import { PublicKey } from "@solana/web3.js";

export interface POAPMetadata {
  issuer: PublicKey;
  recipient: PublicKey;
  comment: string;
  timestamp: number;
}

export const generatePOAPMetadata = (
  issuer: PublicKey,
  recipient: PublicKey,
  comment: string
): POAPMetadata => {
  return {
    issuer,
    recipient,
    comment,
    timestamp: Date.now(),
  };
};

export const serializePOAPMetadata = (metadata: POAPMetadata): Buffer => {
  const issuerBuffer = metadata.issuer.toBuffer();
  const recipientBuffer = metadata.recipient.toBuffer();
  const commentBuffer = Buffer.from(metadata.comment);
  const timestampBuffer = Buffer.alloc(8);
  timestampBuffer.writeBigInt64LE(BigInt(metadata.timestamp));

  return Buffer.concat([
    issuerBuffer,
    recipientBuffer,
    commentBuffer,
    timestampBuffer,
  ]);
};

export const deserializePOAPMetadata = (buffer: Buffer): POAPMetadata => {
  const issuer = new PublicKey(buffer.slice(0, 32));
  const recipient = new PublicKey(buffer.slice(32, 64));
  const commentLength = buffer.length - 72; // 32 (issuer) + 32 (recipient) + 8 (timestamp)
  const comment = buffer.slice(64, 64 + commentLength).toString();
  const timestamp = Number(buffer.readBigInt64LE(64 + commentLength));

  return {
    issuer,
    recipient,
    comment,
    timestamp,
  };
};
