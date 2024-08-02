"use client";

import React, { useState, useRef } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useTranslation } from "@/i18n/client";
import { createNFTUsingAkord } from "../../components/utils";
import { PageParams } from "../../types/params";
import { ClipLoader } from "react-spinners";

const MyPage: React.FC<PageParams> = ({ params: { lng } }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { t } = useTranslation(lng, "my_page");
  const [isLoading, setIsLoading] = useState(false);
  const [explorerURL, setExplorerURL] = useState<string | null>(null);
  const [nftData, setNftData] = useState({
    name: "",
    symbol: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNftData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const createNFT = async () => {
    try {
      if (!wallet) {
        console.error("Wallet not connected");
        return;
      }

      if (!imageFile) {
        console.error("No image file selected");
        return;
      }

      setIsLoading(true);

      const data = {
        name: nftData.name,
        symbol: nftData.symbol,
        description: nftData.description,
        imageInput: imageFile,
        attributes: [],
      };

      const tokenID = await createNFTUsingAkord(data, wallet);
      const url = `https://core.metaplex.com/explorer/${tokenID}?env=devnet`;
      setExplorerURL(url);
    } catch (error) {
      console.error("Error creating NFT:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet) {
    return <div>{t("my_page.connect_wallet")}</div>;
  }

  return (
    <div className="min-h-screen bg-kumogray flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">{t("my_page.create_nft")}</h1>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_name")}
          </label>
          <input
            name="name"
            type="text"
            value={nftData.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_symbol")}
          </label>
          <input
            name="symbol"
            type="text"
            value={nftData.symbol}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_description")}
          </label>
          <input
            name="description"
            type="text"
            value={nftData.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_image")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={createNFT}
            className={`px-6 py-3 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-60 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-namiblue hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={24} color={"#fffff"} loading={isLoading} />
                <span className="ml-2">{t("my_page.processing")}</span>
              </div>
            ) : (
              t("my_page.issue_nft")
            )}
          </button>
        </div>

        {explorerURL && (
          <>
            <p className="mt-4 text-gray-700">
              {t("my_page.nft_reflection_message")}
            </p>
            <a
              href={explorerURL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full block text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t("my_page.view_on_explorer")}
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;
