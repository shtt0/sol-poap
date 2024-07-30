import React from "react";

interface POAP {
  issuer: string;
  recipient: string;
  comment: string;
  timestamp: Date;
}

interface POAPListProps {
  poaps: POAP[];
}

const POAPList: React.FC<POAPListProps> = ({ poaps }) => {
  if (poaps.length === 0) {
    return <p className="text-center text-gray-600">POAPがまだありません。</p>;
  }

  return (
    <div className="space-y-4">
      {poaps.map((poap, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500">発行者: {poap.issuer}</p>
              <p className="text-sm text-gray-500">受賞者: {poap.recipient}</p>
            </div>
            <p className="text-sm text-gray-500">
              {poap.timestamp.toLocaleDateString()}{" "}
              {poap.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <p className="text-gray-700">{poap.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default POAPList;
