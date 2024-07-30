import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { issuePoap } from "../anchorClient";

const POAPForm: React.FC = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const { connection } = useConnection();
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) return;

    setStatus("POAP発行中...");
    try {
      await issuePoap(wallet, connection, recipientAddress, comment);
      setStatus("POAPが正常に発行されました");
      setRecipientAddress("");
      setComment("");
    } catch (error) {
      setStatus(`POAPの発行に失敗しました: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="recipientAddress"
          className="block text-sm font-medium text-gray-700"
        >
          受賞者のウォレットアドレス
        </label>
        <input
          type="text"
          id="recipientAddress"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          評価コメント (300文字以内)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={300}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows={4}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        POAP発行
      </button>
      {status && (
        <p className="mt-2 text-sm text-center text-gray-600">{status}</p>
      )}
    </form>
  );
};

export default POAPForm;
