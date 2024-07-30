import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "./idl.json";

const programId = new PublicKey("ZzMUp5YVGtW8R4FnAp8KxGCHKp6obbKKGfKqtb9bLWU");

export const getProgram = (wallet: AnchorWallet, connection: Connection) => {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  return new anchor.Program(idl as anchor.Idl, programId, provider);
};

export const issuePoap = async (
  wallet: AnchorWallet,
  connection: Connection,
  recipientAddress: string,
  comment: string
) => {
  const program = getProgram(wallet, connection);
  const recipient = new PublicKey(recipientAddress);

  const [poapAccount] = await PublicKey.findProgramAddressSync(
    [Buffer.from("poap"), wallet.publicKey.toBuffer(), recipient.toBuffer()],
    program.programId
  );

  try {
    await program.methods
      .issuePoap(comment)
      .accounts({
        issuer: wallet.publicKey,
        recipient: recipient,
        poap: poapAccount,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("POAP issued successfully");
  } catch (error) {
    console.error("Error issuing POAP:", error);
    throw error;
  }
};

export interface POAPData {
  issuer: PublicKey;
  recipient: PublicKey;
  comment: string;
  timestamp: number;
}

export const fetchUserPoaps = async (
  wallet: AnchorWallet,
  connection: Connection
): Promise<POAPData[]> => {
  const program = getProgram(wallet, connection);

  try {
    const poaps = await program.account.pOAPAccount.all([
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: wallet.publicKey.toBase58(),
        },
      },
    ]);

    return poaps.map((poap) => ({
      issuer: poap.account.issuer,
      recipient: poap.account.recipient,
      comment: poap.account.comment,
      timestamp: poap.account.timestamp.toNumber(),
    }));
  } catch (error) {
    console.error("Error fetching POAPs:", error);
    throw error;
  }
};
