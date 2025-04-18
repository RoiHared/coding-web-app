import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlockCard from "../components/CodeBlockCard";
import { v4 as uuidv4 } from "uuid";
import { axiosInstance } from "../lib/axios";

function LobbyPage() {
  const [username, setUsername] = useState("");
  const [codeBlocks, setCodeBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/codeblocks")
      .then((res) => setCodeBlocks(res.data))
      .catch((err) => console.error("Failed to fetch code blocks", err));
  }, []);

  const handleEnterRoom = (block) => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    const userId = uuidv4();
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);

    navigate(`/codeblock/${block._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-8">
          Choose code block
        </h1>

        <div className="mb-12 flex justify-center items-center gap-4">
          <label className="text-lg font-medium text-indigo-700">
            Your Name:
          </label>
          <input
            type="text"
            placeholder="e.g. Tom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-indigo-300 rounded-lg px-5 py-3 w-80 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {codeBlocks.map((block) => (
            <CodeBlockCard
              key={block._id}
              block={block}
              onClick={handleEnterRoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LobbyPage;
