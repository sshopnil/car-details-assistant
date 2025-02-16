'use client'


import { useState, useEffect } from "react";
import { MessageCircle, Send, Bot, User, Moon, Sun } from "lucide-react";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "assistant" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or saved preference on mount
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      // Update localStorage
      localStorage.theme = newDarkMode ? 'dark' : 'light';
      // Toggle class on document element
      document.documentElement.classList.toggle('dark', newDarkMode);
      return newDarkMode;
    });
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      const botResponse = { 
        text: "This is a simulated response. In a real application, this would come from your API.", 
        sender: "assistant" 
      };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto flex flex-col h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">AI Assistant</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 message-appear ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${msg.sender === "user" ? "bg-gray-100 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-700"}`}
              >
                {msg.sender === "user" ? (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3 message-appear">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full typing-indicator"></span>
                  <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full typing-indicator" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full typing-indicator" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              className="flex-1 px-4 py-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-4 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;