import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";

import IDL from "./idl.json";
import { Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const programId_pyusd = new PublicKey(
  "H5U88wk7D8Qj7KeztdrJJcWqLwAgZLyMVozrigd2D1Ue"
);

export async function createCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program = new Program(IDL, programId_pyusd, provider);

  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );
  console.log("counter", counter.toString());

  return await program.methods
    .createCounter()
    .accounts({
      authority: wallet.publicKey,
      counter: counter,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
}
