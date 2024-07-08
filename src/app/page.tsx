"use client";

import React, { useState } from "react";
import { createCounter } from "../anchorClient";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";

const Home: React.FC = () => {
  const { connected } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");

  const handleHelloClick = async () => {
    if (!connected) {
      setStatus("ウォレットが接続されていません");
      return;
    }

    if (!wallet) {
      setStatus("Anchorウォレットが接続されていません");
      return;
    }

    setStatus("プログラム実行中...");

    try {
      const result = await createCounter(wallet, connection, []); // No address and amount, empty array
      setStatus("プログラムが正常に実行されました");
      setResultUrl(`https://solscan.io/tx/${result}?cluster=devnet`);
    } catch (err: any) {
      setStatus(`プログラムの実行に失敗しました: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          PYUSDトークンの送付
        </h1>
        <button
          onClick={handleHelloClick}
          disabled={!connected}
          className="relative w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          プログラムを実行
        </button>
      </div>
      {status && (
        <div className="mt-4 p-4 bg-gray-200 rounded-md shadow-inner max-w-xl w-full text-center">
          <p className="text-sm text-gray-600 break-all">{status}</p>
        </div>
      )}
      {resultUrl && (
        <div className="mt-4 p-4 max-w-xl w-full text-center">
          <p className="text-left text-sm text-gray-600 break-all">
            <span className="font-semibold">実行結果</span>:{" "}
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {resultUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
