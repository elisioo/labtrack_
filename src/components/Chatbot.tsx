import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import ChatbotLogo from "../assets/LMO.png";
import { chatWithBot } from "../lib/chatbot-api";

const DEBUG_MODE = true; // Set to false to disable verbose logging

// ══════════════════════════════════════════════
// LOGO CONFIGURATION
// ══════════════════════════════════════════════
const LOGO_TYPE = "image"; // "emoji" or "image" - Changed to use your LMO logo
const LOGO_EMOJI = "🤖"; // Fallback emoji if image fails to load

const LOGO_IMAGE = ChatbotLogo; // Using your LMO.png logo

// ── Types ──────────────────────────────────────
interface Message {
  id: number;
  text: string;
  role: "user" | "bot";
  isTyping?: boolean;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// ── ChatWidget Component ────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "👋 Wazzup! I'm LiMO. Your LabTracker. How can I help you with laboratory management today?", role: "bot" },
  ]);
  const [isSending, setIsSending] = useState(false);
  const conversationHistory = useRef<ConversationMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Auto-resize textarea
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
  };

  // Send on Enter (Shift+Enter for newline)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    const userMsgId = nextId.current++;
    const typingId = nextId.current++;

    // Show user message
    setMessages((prev) => [...prev, { id: userMsgId, text, role: "user" }]);
    conversationHistory.current.push({ role: "user", content: text });

    // Reset input
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setIsSending(true);

    // Show typing indicator
    setMessages((prev) => [
      ...prev,
      { id: typingId, text: "Typing...", role: "bot", isTyping: true },
    ]);

    try {
      if (DEBUG_MODE) {
        console.log("🔵 Calling server function chatWithBot");
        console.log("📤 Request payload:", { messages: conversationHistory.current });
      }

      const data = await chatWithBot({ data: { messages: conversationHistory.current } });

      if (DEBUG_MODE) {
        console.log("✅ Response data:", data);
      }

      // Remove typing indicator and add reply
      setMessages((prev) => {
        const without = prev.filter((m) => m.id !== typingId);
        const reply = data.reply ?? data.error ?? "Sorry, I couldn't get a response. Please try again.";
        
        if (data.reply) {
          conversationHistory.current.push({ role: "assistant", content: data.reply });
        }
        
        return [...without, { id: nextId.current++, text: reply, role: "bot" }];
      });
    } catch (err) {
      if (DEBUG_MODE) {
        console.error("❌ Chat error details:", err);
        console.error("❌ Error name:", (err as Error).name);
        console.error("❌ Error message:", (err as Error).message);
        console.error("❌ Error stack:", (err as Error).stack);
      }
      
      let errorMessage = "Connection error. Please check your internet and try again.";
      
      if ((err as Error).message) {
        errorMessage = `❌ Error: ${(err as Error).message}\n\nCheck the server terminal for error logs.`;
        console.error("🔴 Server function error - check terminal logs");
      }
      
      setMessages((prev) => {
        const without = prev.filter((m) => m.id !== typingId);
        return [
          ...without,
          {
            id: nextId.current++,
            text: errorMessage,
            role: "bot",
          },
        ];
      });
    }

    setIsSending(false);
    inputRef.current?.focus();
  };

  return (
    <div style={styles.widget}>
      {/* Chat Box */}
      <div
        style={{
          ...styles.chatBox,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          pointerEvents: isOpen ? "all" : "none",
        }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.avatar}>
              {LOGO_TYPE === "image" && LOGO_IMAGE ? (
                <img src={LOGO_IMAGE} alt="Bot" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                LOGO_EMOJI
              )}
            </div>
            <div>
              <div style={styles.headerName}>LiMO Tracker</div>
              <div style={styles.headerStatus}>● Online</div>
            </div>
          </div>
          <button
            style={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.msg,
                ...(msg.role === "user" ? styles.msgUser : styles.msgBot),
                ...(msg.isTyping ? styles.msgTyping : {}),
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input */}
        <div style={styles.footer}>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            style={styles.input}
            aria-label="Chat message input"
          />
          <button
            onClick={sendMessage}
            disabled={isSending || !inputValue.trim()}
            style={{
              ...styles.sendBtn,
              background: isSending || !inputValue.trim() ? "#dadce0" : "#1a73e8",
              cursor: isSending || !inputValue.trim() ? "not-allowed" : "pointer",
            }}
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          style={styles.toggleBtn}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          {LOGO_TYPE === "image" && LOGO_IMAGE ? (
            <img src={LOGO_IMAGE} alt="Chat" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
          ) : (
            "💬"
          )}
        </button>
      )}
    </div>
  );
}

// ── Inline Styles ──────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  widget: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  chatBox: {
    width: 360,
    height: 480,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    marginBottom: 12,
    transition: "opacity 0.22s ease, transform 0.22s ease",
  },
  header: {
    background: "rgba(13, 148, 136, 1)",
    color: "white",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  headerName: {
    fontWeight: 600,
    fontSize: 15,
  },
  headerStatus: {
    fontSize: 12,
    opacity: 0.85,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: 22,
    cursor: "pointer",
    opacity: 0.8,
    lineHeight: 1,
    padding: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f8f9fa",
  },
  msg: {
    maxWidth: "82%",
    padding: "10px 14px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.5,
    wordWrap: "break-word",
  },
  msgBot: {
    background: "#fff",
    color: "#202124",
    borderBottomLeftRadius: 4,
    alignSelf: "flex-start",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  msgUser: {
    background: "#1a73e8",
    color: "white",
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  msgTyping: {
    color: "#999",
    fontStyle: "italic",
    background: "#fff",
  },
  footer: {
    padding: 12,
    background: "#fff",
    borderTop: "1px solid #e8eaed",
    display: "flex",
    gap: 8,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    border: "1px solid #dadce0",
    borderRadius: 20,
    padding: "9px 14px",
    fontSize: 14,
    resize: "none",
    outline: "none",
    maxHeight: 80,
    lineHeight: 1.4,
    fontFamily: "inherit",
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    color: "white",
    border: "none",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.2s",
  },
  toggleBtn: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
};