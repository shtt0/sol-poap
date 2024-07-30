"use client";

import React from "react";
import POAPForm from "../components/POAPForm";
import { useWallet } from "@solana/wallet-adapter-react";

const Home: React.FC = () => {
  const { connected } = useWallet();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">POAP発行</h1>
        {connected ? (
          <POAPForm />
        ) : (
          <p className="text-center text-gray-600">
            ウォレットを接続してPOAPを発行してください。
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
