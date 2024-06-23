import {
  PublicKey,
  Connection,
  Transaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Program, Idl, AnchorProvider } from "@coral-xyz/anchor";
// import IDL_pyusd from "../idl.json";
import IDL_pyusd from "../types/idl_pyusd";
import IDL_pyusd_test from "../types/idl_pyusd_test";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import BN from "bn.js";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createV1 } from "@metaplex-foundation/mpl-core";
import { Keypair } from "@solana/web3.js";
import { Application } from "../types/application";
import { Transfer } from "../types/transfer";
import { Profile } from "../types/profile";
import { Donation } from "../types/donation";
import { MonthlyTotal } from "../types/monthlyTotal";
import { Message } from "../types/message";
import { Member } from "../types/member";

export function createProvider(wallet: AnchorWallet, connection: Connection) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  // const provider = new Provider(connection, wallet, {
  //   preflightCommitment: "recent",
  // });

  anchor.setProvider(provider);
  return provider;
}

export async function saveDataAsJSON(
  profile: Profile,
  transferHistory: Transfer[],
  totalAmount: number
): Promise<void> {
  const data = {
    name: profile.name,
    symbol: profile.name,
    description: profile.description,
    image: profile.imageUrl,
    attributes: [
      { trait_type: "totalAmount", value: totalAmount.toString() },
      ...transferHistory.map((transfer, index) => ({
        trait_type: `recipient${index + 1}`,
        value: transfer.recipient,
      })),
    ],
  };

  const jsonString = JSON.stringify(data);
  const blob = new Blob([jsonString], { type: "application/json" });
  const storageRef = ref(storage, "test.json");

  try {
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "savedDataURLs"), {
      url: url,
      createdAt: new Date(),
    });

    console.log("JSON file uploaded and URL saved successfully");
  } catch (error) {
    console.error("Error uploading JSON file: ", error);
  }
}

export const saveDataToAkord = async (data: object): Promise<string> => {
  try {
    const akordApiKey = process.env.NEXT_PUBLIC_AKORD_API_KEY;
    if (!akordApiKey) {
      throw new Error("Akord API key not found in environment variables.");
    }
    const jsonString = JSON.stringify(data);
    const response = await fetch("https://api.akord.com/files", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Api-Key": akordApiKey,
        "Content-Type": "text/plain",
      },
      body: jsonString,
    });

    if (response.ok) {
      const responseData = await response.json();
      const txId = responseData.tx.id; // Akordから返されたtxのIDを取得
      return txId;
    } else {
      throw new Error("Failed to upload data to Akord");
    }
  } catch (error) {
    console.error("Error uploading JSON file to Akord:", error);
    throw error;
  }
};

export const saveDataURLToFirestore = async (tokenID: string) => {
  try {
    const docRef = doc(db, "tokens", tokenID);
    await setDoc(docRef, {
      tokenID: tokenID,
      explorerURL: `https://core.metaplex.com/explorer/${tokenID}?env=devnet`,
    });
    console.log("Document written with ID: ", tokenID);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const createNFT = async (
  txId: string,
  saveToFirestore: boolean = true
) => {
  const endpoint = "https://api.devnet.solana.com";
  const umi = createUmi(endpoint);

  const payerSecretKey = process.env.NEXT_PUBLIC_PAYER_SECRET_KEY;
  if (!payerSecretKey) {
    throw new Error("payerSecretKey not found in environment variables.");
  }
  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  const asset = generateSigner(umi);
  const uri = `https://arweave.net/${txId}`;

  const creatingResult = await createV1(umi, {
    asset,
    name: "My Core NFT",
    uri: uri,
  }).sendAndConfirm(umi);

  console.log("payer =>", payerKeypair.publicKey.toString());
  console.log("asset =>", asset.publicKey.toString());

  const tokenID = asset.publicKey.toString();
  if (saveToFirestore) {
    await saveDataURLToFirestore(tokenID);
  }
  return tokenID;
};

export const createNFTUsingAkord = async (
  data: object,
  saveToFirestore: boolean = true
) => {
  try {
    const txId = await saveDataToAkord(data);
    const tokenID = await createNFT(txId, saveToFirestore);
    return tokenID;
  } catch (error) {
    console.error("Error creating NFT using Akord:", error);
    throw error;
  }
};
