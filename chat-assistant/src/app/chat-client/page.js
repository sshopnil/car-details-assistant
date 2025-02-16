"use client";
import { useState } from "react";
import Image from "next/image";
import { Suspense } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "assistant" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true); // Set loading to true when message is sent

    setTimeout(async () => {
      let botResponse;
      try {
        const res = await fetch("/chat-client/api", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text: userMessage.text }),
        });

        const { data } = await res.json();
        botResponse = { text: data, sender: "assistant" };
      } catch (e) {
        botResponse = { text: "Unable to retrieve data", sender: "assistant" };
      }

      setMessages((prev) => [...prev, botResponse]);
      setLoading(false); // Reset loading state after receiving response
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen p-1 bg-gray-100">
      <h1 className="text-center text-2xl">AI Chatbot</h1>
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-xl shadow-md">
        <Suspense fallback={<div className="text-sm text-gray-500">Generating text...</div>}>
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender === "user" ? (
                <Image
                  className="light:invert ml-auto"
                  src="https://cdn-icons-png.flaticon.com/512/5953/5953714.png"
                  alt="User"
                  width={25}
                  height={25}
                  priority
                />
              ) : (
                <Image
                  className="light:invert"
                  src="https://cdn-icons-png.flaticon.com/512/8649/8649607.png"
                  alt="Bot"
                  width={25}
                  height={25}
                  priority
                />
              )}
              <div
                className={`p-2 my-2 max-w-xs rounded-lg text-white ${
                  msg.sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-600 mr-auto"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-500 italic text-sm mt-2">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/891/891378.png"
                alt="Loading"
                width={20}
                height={20}
                className="inline-block animate-spin"
              />
              Generating response...
            </div>
          )}
        </Suspense>
      </div>

      <div className="flex mt-2 p-10">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
