import React from "react";

export default function CodeBlockCard({ block, onClick }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{block.title}</h2>
      <button
        onClick={() => onClick(block)}
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Enter Room
      </button>
    </div>
  );
}
