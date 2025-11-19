"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

type QAItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
  links?: string[];
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [featuredQuestions, setFeaturedQuestions] = useState<QAItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load featured questions from API
  useEffect(() => {
    fetch("/api/qa?limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setFeaturedQuestions(data.data);
        }
      })
      .catch((err) => console.error("Failed to load featured questions:", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            sources: data.sources,
          },
        ]);
      } else {
        const errorMsg = data.error || "Sorry, I encountered an error. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${errorMsg}${data.details ? `\n\nDetails: ${data.details}` : ""}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the server. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="overflow-clip relative w-full min-h-screen flex flex-col">
      {/* Title - Moves to top when messages exist */}
      {hasMessages && (
        <div 
          className="flex items-center justify-center gap-[5px] pt-[80px] pb-6 transition-all duration-300"
        >
          <h2 
            className="font-medium text-[#160211] text-[32px] text-center whitespace-nowrap"
            style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
          >
            Ask Me About DES 166
          </h2>
        </div>
      )}

      {/* Messages Area - Only visible when messages exist */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto px-8 pb-[60px]">
          <div className="flex flex-col gap-4 max-w-[760px] mx-auto pt-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-[8px] px-4 py-3 ${
                    message.role === "user"
                      ? "bg-[#160211] text-white"
                      : "bg-[rgba(255,255,255,0.5)] border border-white text-[#160211]"
                  }`}
                  style={{ 
                    fontFamily: message.role === "user" 
                      ? 'var(--font-manrope), sans-serif' 
                      : 'var(--font-dm-sans), sans-serif',
                    fontWeight: 400
                  }}
                >
                  <p 
                    className="whitespace-pre-wrap text-[14px]"
                    style={{ 
                      fontFamily: message.role === "user" 
                        ? 'var(--font-manrope), sans-serif' 
                        : 'var(--font-dm-sans), sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {message.content}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[rgba(22,2,17,0.09)]">
                      <p 
                        className="text-xs opacity-75 mb-1"
                        style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                      >
                        Sources:
                      </p>
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline block opacity-75 hover:opacity-100 text-[#008fb4]"
                          style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                        >
                          {source}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[rgba(255,255,255,0.5)] border border-white rounded-[8px] px-4 py-3">
                  <Loader2 className="animate-spin text-[#160211]" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Container - Centered vertically when no messages */}
      <div className={`${hasMessages ? 'fixed bottom-[40px] left-0 right-0 pb-4 pt-8' : 'flex-1 flex items-center justify-center'}`} style={hasMessages ? {
        background: 'linear-gradient(to top, rgba(240, 247, 232, 0.95) 0%, rgba(232, 245, 240, 0.9) 50%, transparent 100%)'
      } : {}}>
        <div className={`flex flex-col gap-[32px] max-w-[760px] mx-auto w-full px-8 ${!hasMessages ? 'py-8' : ''}`}>
          {/* Title - Only visible when no messages */}
          {!hasMessages && (
            <div className="flex items-center justify-center gap-[5px]">
              <h2 
                className="font-medium text-[#160211] text-[32px] text-center whitespace-nowrap"
                style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
              >
                Ask Me About DES 166
              </h2>
            </div>
          )}
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-white border border-[rgba(22,2,17,0.09)] flex items-center justify-between pl-[24px] pr-[12px] py-[10px] rounded-[32px] w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-[#56637e] text-[14px] focus:outline-none"
                style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 400 }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 rounded-[32px] bg-[#160211] flex items-center justify-center hover:bg-[#2a1a2a] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={14} className="text-white animate-spin" />
                ) : (
                  <Send size={14} className="text-white" />
                )}
              </button>
            </div>
          </form>

          {/* Frequently Asked Questions Section - Only visible when no messages */}
          {!hasMessages && (
            <div className="flex flex-col gap-[14px]">
              <p 
                className="font-medium text-[#56637e] text-[12px] w-full"
                style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
              >
                Frequently Asked Questions
              </p>
              <div className="flex gap-[14px] justify-center">
                {featuredQuestions.map((qa, index) => {
                  // Shorter widths to fit three cards side by side
                  const widths = [220, 240, 220];
                  return (
                    <button
                      key={qa.id}
                      onClick={async () => {
                        const question = qa.question;
                        setInput("");
                        setMessages((prev) => [...prev, { role: "user", content: question }]);
                        setIsLoading(true);

                        try {
                          const response = await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: question }),
                          });

                          const data = await response.json();

                          if (response.ok) {
                            setMessages((prev) => [
                              ...prev,
                              {
                                role: "assistant",
                                content: data.message,
                                sources: data.sources,
                              },
                            ]);
                          } else {
                            const errorMsg = data.error || "Sorry, I encountered an error. Please try again.";
                            setMessages((prev) => [
                              ...prev,
                              {
                                role: "assistant",
                                content: `Error: ${errorMsg}${data.details ? `\n\nDetails: ${data.details}` : ""}`,
                              },
                            ]);
                          }
                        } catch (error) {
                          console.error("Error:", error);
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: "assistant",
                              content: "Sorry, I couldn't connect to the server. Please try again.",
                            },
                          ]);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="bg-[rgba(255,255,255,0.5)] border border-white flex items-center justify-center p-[10px] rounded-[8px] hover:bg-[rgba(255,255,255,0.8)] transition-colors flex-shrink-0"
                      style={{ width: `${widths[index]}px` }}
                    >
                      <p 
                        className="font-normal text-[#160211] text-[14px] text-left flex-1 line-clamp-2"
                        style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                      >
                        {qa.question}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 py-4 bg-transparent z-10">
        <p 
          className="font-normal text-[10px] text-center"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontWeight: 400,
            color: '#56637e'
          }}
        >
          <span>This is an AI assistant. For official information, please consult your </span>
          <a
            href="https://art.washington.edu/advising"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#008fb4]"
            style={{ textDecoration: 'underline', textUnderlinePosition: 'from-font' }}
          >
            academic advisor
          </a>
          .
        </p>
      </div>
    </div>
  );
}
