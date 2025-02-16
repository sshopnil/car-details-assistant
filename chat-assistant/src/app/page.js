'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sun, Moon, Car, MessageSquare, Database } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Header with dark mode toggle */}
      <header className="fixed w-full top-0 p-4 flex justify-end bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-12 flex flex-col items-center gap-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Car Specifications Chat System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Intelligent conversation interface powered by LangChain and Hugging Face API
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <Car className="w-8 h-8 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Extensive Database
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed specifications of 20 carefully selected vehicles at your fingertips.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <MessageSquare className="w-8 h-8 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Smart Chat System
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Intelligent responses based on context and comprehensive car knowledge.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105">
            <Database className="w-8 h-8 text-purple-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Context Awareness
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Maintains chat history for more relevant and accurate responses.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/chat-client"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-full overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-600 rounded-full group-hover:w-full group-hover:h-full"></span>
          <span className="relative flex items-center gap-2">
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={24}
              height={24}
            />
            Start Chatting
          </span>
        </Link>

        {/* Additional Info */}
        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm max-w-2xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            How It Works
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
            <li>Comprehensive database with detailed specifications of various cars</li>
            <li>Natural language processing for intuitive car information retrieval</li>
            <li>Contextual understanding for more accurate and relevant responses</li>
            <li>Real-time updates and seamless conversation flow</li>
          </ol>
        </div>
      </main>
    </div>
  );
}