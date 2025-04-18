import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LobbyPage from "./pages/LobbyPage";
import CodeBlockPage from "./pages/CodeBlockPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/codeblock/:roomId" element={<CodeBlockPage />} />
    </Routes>
  );
}

export default App;
