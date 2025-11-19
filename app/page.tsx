"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import CategoryBrowser from "@/components/CategoryBrowser";

type ViewMode = "chat" | "browse";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("chat");

  return (
    <main 
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: viewMode === "chat" 
          ? "url('/ask_me_des166_chat.png')"
          : "url('/ask_me_des166_faq.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Navigation Tabs - Positioned absolutely at top */}
      <div className="absolute top-[24px] left-1/2 transform -translate-x-1/2 flex gap-[36px] items-start z-10">
        <button
          onClick={() => setViewMode("chat")}
          className="flex flex-col items-end"
          style={{ width: viewMode === "chat" ? "29px" : "auto" }}
        >
          <p 
            className={`font-semibold text-[12px] text-center text-[#160211]`}
            style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 600 }}
          >
            Chat
          </p>
          {viewMode === "chat" && (
            <div className="bg-[#160211] h-px w-full mt-1" />
          )}
        </button>
        <button
          onClick={() => setViewMode("browse")}
          className="flex flex-col items-end"
          style={{ width: viewMode === "browse" ? "64px" : "auto" }}
        >
          <p 
            className={`font-semibold text-[12px] text-center text-[#160211]`}
            style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 600 }}
          >
            FAQ Topics
          </p>
          {viewMode === "browse" && (
            <div className="bg-[#160211] h-px w-full mt-1" />
          )}
        </button>
      </div>

      {/* Content */}
      {viewMode === "chat" ? <ChatInterface /> : <CategoryBrowser />}
    </main>
  );
}
