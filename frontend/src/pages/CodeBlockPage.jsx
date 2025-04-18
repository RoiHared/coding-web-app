import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { socket } from "../lib/socket";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeBlockPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [role, setRole] = useState(null);
  const [solution, setSolution] = useState("");
  const [title, setTitle] = useState("");
  const [showSmiley, setShowSmiley] = useState(false);
  const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);

  const hasJoinedRoom = useRef(false);

  const sendMessage = (newCode) => {
    socket.emit("send_message", { code: newCode, codeBlockId: roomId });
  };

  const sendMessageToChat = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const msg = {
      sender: username || role,
      role: role,
      text: messageInput.trim(),
    };

    socket.emit("send_chat_message", { codeBlockId: roomId, msg });
    setMessages((prev) => [...prev, msg]);
    setMessageInput("");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username") || role;
    setUsername(storedUsername);

    if (!socket.connected) socket.connect();

    if (!hasJoinedRoom.current) {
      socket.emit("join_room", {
        codeBlockId: roomId,
        userId,
        username: storedUsername,
      });
      hasJoinedRoom.current = true;
    }

    socket.on("init_data", ({ title, code, role, solutionCode }) => {
      setCode(code);
      setRole(role);
      setSolution(solutionCode);
      setTitle(title);
    });

    socket.on("receive_message", (code) => {
      setIsRemoteUpdate(true);
      setCode(code);
      setTimeout(() => setIsRemoteUpdate(false), 0);
    });

    socket.on("student_count", (count) => {
      setStudentCount(count);
    });

    socket.on("mentor_left", () => {
      alert("The mentor left the session. Returning to lobby.");
      navigate("/");
    });

    socket.on("receive_chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("show_smiley", () => setShowSmiley(true));
    socket.on("hide_smiley", () => setShowSmiley(false));

    socket.on("users_in_room", (users) => {
      const sorted = users.sort((a, b) =>
        a.role === "mentor" ? -1 : b.role === "mentor" ? 1 : 0
      );
      setUsersInRoom(sorted);
    });

    return () => {
      const userId = localStorage.getItem("userId");

      if (socket.connected && userId && hasJoinedRoom.current) {
        socket.emit("leave_room", { codeBlockId: roomId, userId });
        socket.disconnect();
        hasJoinedRoom.current = false;
      }

      socket.off("init_data");
      socket.off("receive_message");
      socket.off("student_count");
      socket.off("mentor_left");
      socket.off("receive_chat_message");
      socket.off("show_smiley");
      socket.off("hide_smiley");
      socket.off("users_in_room");
    };
  }, [roomId, navigate]);

  const handleLeaveRoom = () => {
    const userId = localStorage.getItem("userId");
    socket.emit("leave_room", { codeBlockId: roomId, userId });
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] to-[#dbeafe] p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-6 text-center relative">
            <button
              onClick={handleLeaveRoom}
              className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Leave Room
            </button>
            <h1 className="text-5xl font-extrabold text-indigo-700 mb-3 tracking-tight">
              {title}
            </h1>
            <div className="text-gray-500 text-lg">
              <p>
                👤 <strong>{username}</strong> —{" "}
                <span className="capitalize">{role}</span>
              </p>
              <p>
                👥 Students in Room: <strong>{studentCount}</strong>
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-lg overflow-hidden border-2 border-indigo-200">
            <CodeMirror
              value={code}
              height="400px"
              theme={oneDark}
              extensions={[javascript()]}
              readOnly={role === "mentor"}
              onChange={(value) => {
                setCode(value);
                if (!isRemoteUpdate && role === "student") {
                  sendMessage(value);
                }
                if (value.trim() === solution.trim()) {
                  setShowSmiley(true);
                } else {
                  setShowSmiley(false);
                }
              }}
            />
          </div>

          {showSmiley && (
            <div className="text-center text-7xl mt-6 animate-bounce">😄</div>
          )}

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
              💬 Live Chat
            </h2>
            <div className="border border-gray-300 rounded-xl p-6 h-64 overflow-y-auto bg-gray-100 mb-6 shadow-inner">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm mb-3 ${
                    msg.sender === username
                      ? "text-indigo-700 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  <strong>
                    {msg.sender}{" "}
                    {msg.sender === username && role === "mentor" ? "🧑‍🏫" : ""}:
                  </strong>{" "}
                  {msg.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={sendMessageToChat}
              className="flex gap-4 items-center"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-grow border border-gray-300 rounded-full px-5 py-3 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition font-semibold shadow"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <aside className="w-full lg:w-64 bg-gray-50 rounded-xl p-4 border shadow-inner">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">
            Users in Room
          </h2>
          <ul>
            {usersInRoom.map((user, idx) => (
              <li key={idx} className="mb-2 text-sm flex items-center gap-2">
                <span className="font-medium text-gray-800">
                  {user.username}
                </span>
                {user.role === "mentor" && (
                  <span className="text-yellow-500 text-xs font-bold">
                    🧑‍🏫 Mentor
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default CodeBlockPage;
