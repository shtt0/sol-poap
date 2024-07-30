"use client";

import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchUserPoaps } from "../../anchorClient";
import POAPList from "../../components/POAPList";

interface POAP {
  issuer: string;
  recipient: string;
  comment: string;
  timestamp: Date;
}

const ProfilePage: React.FC = () => {
  const [poaps, setPoaps] = useState<POAP[]>([]);
  const [loading, setLoading] = useState(true);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    const loadPoaps = async () => {
      if (wallet.publicKey) {
        try {
          const userPoaps = await fetchUserPoaps(wallet, connection);
          setPoaps(userPoaps);
        } catch (error) {
          console.error("Failed to fetch POAPs:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPoaps();
  }, [wallet.publicKey, connection]);

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-center text-gray-600">
            ウォレットを接続してプロフィールを表示してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">MY POAP</h1>
        {loading ? (
          <p className="text-center text-gray-600">POAPを読み込んでいます...</p>
        ) : (
          <POAPList poaps={poaps} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
