import React, { useState, useRef, useEffect } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const userId = 5; // ID tài khoản bạn đang dùng
  const chatEndRef = useRef(null);

  // Scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Tin nhắn chào khi mở chat lần đầu
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Xin chào! Bạn cần mình tư vấn gì, xin cảm ơn.",
          products: [],
        },
      ]);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((msgs) => [...msgs, { sender: "user", text: userMessage }]);
    setInput("");

    const apiUrl = "http://localhost:8080/api/chats/auto-reply";
    const bodyData = { userId, message: userMessage };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text}`);
      }

      const data = await res.json();

      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: data.message || "Bot không trả lời được.",
          products: data.products || [], // hiển thị sản phẩm nếu có
        },
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: `Có lỗi xảy ra khi gọi API: ${err.message}`,
          products: [],
        },
      ]);
    }
  };

  return (
    <>
      {/* Bong bóng chat */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#00ff48ff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </div>

      {/* Chatbox */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 320,
            height: 400,
            border: "1px solid #ccc",
            borderRadius: 10,
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#00ff22ff",
              color: "white",
              padding: "8px 10px",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            Chat với chúng tôi
          </div>

          {/* Nội dung chat */}
          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: "auto",
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    color: msg.sender === "user" ? "blue" : "green",
                    textAlign: msg.sender === "user" ? "right" : "left",
                    wordBreak: "break-word",
                  }}
                >
                  <b>{msg.sender === "user" ? "Bạn" : "Bot"}:</b> {msg.text}
                </div>

                {/* Hiển thị sản phẩm nếu có */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ marginTop: 5 }}>
                    {msg.products.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <a
                          href={p.link}
                          target="_blank"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            width={50}
                            height={50}
                            style={{ marginRight: 5 }}
                          />
                          {p.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input chat */}
          <div
            style={{
              borderTop: "1px solid #ccc",
              padding: 5,
              display: "flex",
            }}
          >
            <input
              style={{ flex: 1, border: "none", outline: "none" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#0026ffff",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
