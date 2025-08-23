import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
//comment

const API_BASE = "http://127.0.0.1:5000"; // adjust for deployment

// Colors
const mutedGreen = "#6B8E6B";
const mutedBrown = "#8B5E3C";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]); // saved chat history
  const [activeChat, setActiveChat] = useState(null);

  const startNewChat = () => {
    const newChat = { id: Date.now(), title: "New Journey 🌍", messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setMessages([]);
  };

  const saveChatUpdate = (updatedMessages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat ? { ...chat, messages: updatedMessages } : chat
      )
    );
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessages = [...messages, { type: "user", text: message }];
    setMessages(newMessages);
    saveChatUpdate(newMessages);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, { message: currentMessage });
      const updatedMessages = [
        ...newMessages,
        { type: "ai", text: res.data.reply },
      ];
      setMessages(updatedMessages);
      saveChatUpdate(updatedMessages);
    } catch (err) {
      console.error(err);
      let errText = "⚠️ Time portal connection failed.";
      if (err.response?.data) {
        errText += ` (${err.response.data.debug || err.response.data.reply})`;
      }
      const updatedMessages = [...newMessages, { type: "ai", text: errText }];
      setMessages(updatedMessages);
      saveChatUpdate(updatedMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Trebuchet MS', sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "linear-gradient(to bottom, #2e3d23, #4a5b36)", // earthy green
          color: "white",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>🕰️ Journeys</h2>
        <button
          onClick={startNewChat}
          style={{
            backgroundColor: mutedBrown,
            color: "white",
            padding: "0.5rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ➕ New Journey
        </button>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setMessages(chat.messages);
              }}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor:
                  chat.id === activeChat ? mutedBrown : "transparent",
                marginBottom: "0.5rem",
              }}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            background: "linear-gradient(to bottom, #f0fff4, #faf6f1)", // greenish to beige (travel vibe)
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: messages.length === 0 ? "center" : "flex-start",
          }}
        >
          {messages.length === 0 ? (
            // Empty State
            <div style={{ textAlign: "center", maxWidth: "500px", width: "100%" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌍</div>
              <h1 style={{ marginBottom: "0.5rem" }}>Time Travel Concierge</h1>
              <p style={{ marginBottom: "2rem", color: "#555" }}>
                Ask me anything about history, the future, or imaginary journeys.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="E.g., 'Take me to Ancient Rome'"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.25rem",
                    backgroundColor: mutedGreen,
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  🚀 Travel
                </button>
              </form>
            </div>
          ) : (
            // Chat history
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.type === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    textAlign: msg.type === "user" ? "right" : "left",
                    margin: "0.5rem 0",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.6rem 1rem",
                      borderRadius: "12px",
                      backgroundColor: msg.type === "user" ? mutedGreen : "#eee",
                      color: msg.type === "user" ? "white" : "black",
                      maxWidth: "70%",
                      wordWrap: "break-word",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
                  style={{ fontStyle: "italic", color: "#888" }}
                >
                  🔮 Consulting the time streams...
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Input at bottom after chat starts */}
        {messages.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: "flex", padding: "1rem", borderTop: "1px solid #ccc" }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g., 'Take me to Ancient Rome'"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.25rem",
                marginLeft: "0.5rem",
                backgroundColor: mutedGreen,
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
              }}
            >
              🚀 Travel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
