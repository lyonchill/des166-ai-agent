"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import CategoryBrowser from "@/components/CategoryBrowser";
import { MessageSquare, Grid3x3 } from "lucide-react";

type ViewMode = "chat" | "browse";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("chat");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            DES166 AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant answers to your questions about the course
          </p>
        </header>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setViewMode("chat")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "chat"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <MessageSquare size={20} />
            Chat
          </button>
          <button
            onClick={() => setViewMode("browse")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "browse"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Grid3x3 size={20} />
            Browse Topics
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {viewMode === "chat" ? <ChatInterface /> : <CategoryBrowser />}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>
            This is an AI assistant. For official information, please consult
            your academic advisor.
          </p>
          <p className="mt-2">
            <a
              href="https://art.washington.edu/advising"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact Academic Advising
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
