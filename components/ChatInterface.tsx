"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: (string | { type: "file" | "link"; url?: string; title?: string; pageNumber?: number })[];
  fileSources?: { title: string; path: string; pageNumber?: number }[];
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
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 150);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

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
            fileSources: data.fileSources,
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
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Title - Moves to top when messages exist */}
      {hasMessages && (
        <div 
          className="flex-shrink-0 flex items-center justify-center gap-[5px] pt-[60px] sm:pt-[80px] pb-4 sm:pb-6 transition-all duration-300 px-4"
        >
          <h2 
            className="font-medium text-[#160211] text-[24px] sm:text-[32px] text-center whitespace-nowrap"
            style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
          >
            Ask Me About DES 166
          </h2>
        </div>
      )}

      {/* Messages Area - Only visible when messages exist */}
      {hasMessages && (
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 pb-[200px] sm:pb-[160px] overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex flex-col gap-3 sm:gap-4 max-w-[760px] mx-auto pt-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-[8px] px-3 sm:px-4 py-2 sm:py-3 ${
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
                    className="whitespace-pre-wrap text-[13px] sm:text-[14px] leading-relaxed"
                    style={{ 
                      fontFamily: message.role === "user" 
                        ? 'var(--font-manrope), sans-serif' 
                        : 'var(--font-dm-sans), sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {message.content}
                  </p>
                  {(message.sources && message.sources.length > 0) || (message.fileSources && message.fileSources.length > 0) ? (
                    <div className="mt-2 pt-2 border-t border-[rgba(22,2,17,0.09)]">
                      <p 
                        className="text-[10px] sm:text-xs opacity-75 mb-1"
                        style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                      >
                        Sources:
                      </p>
                      {message.sources && message.sources.map((source, idx) => {
                        if (typeof source === "string") {
                          return (
                            <a
                              key={idx}
                              href={source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] sm:text-xs underline block opacity-75 hover:opacity-100 text-[#008fb4] break-all"
                              style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                            >
                              {source}
                            </a>
                          );
                        } else if (source.type === "file") {
                          return (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] sm:text-xs underline block opacity-75 hover:opacity-100 text-[#008fb4] break-all flex items-center gap-1"
                              style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                            >
                              <span>📄</span>
                              <span>{source.title || source.url}</span>
                              {source.pageNumber && <span className="opacity-60">(Page {source.pageNumber})</span>}
                            </a>
                          );
                        } else if (source.type === "link" && source.url) {
                          return (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] sm:text-xs underline block opacity-75 hover:opacity-100 text-[#008fb4] break-all flex items-center gap-1"
                              style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                            >
                              <span>🔗</span>
                              <span>{source.title || source.url}</span>
                            </a>
                          );
                        }
                        return null;
                      })}
                      {message.fileSources && message.fileSources.map((file, idx) => {
                        // 判斷是否是外部連結（Google Sheets 等）
                        const isExternalLink = file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'));
                        return (
                          <a
                            key={`file-${idx}`}
                            href={file.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] sm:text-xs underline block opacity-75 hover:opacity-100 text-[#008fb4] break-all flex items-center gap-1"
                            style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 400 }}
                          >
                            <span>{isExternalLink ? '🔗' : '📄'}</span>
                            <span>{file.title}</span>
                            {file.pageNumber && !isExternalLink && <span className="opacity-60">(Page {file.pageNumber})</span>}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[rgba(255,255,255,0.5)] border border-white rounded-[8px] px-3 sm:px-4 py-2 sm:py-3">
                  <Loader2 className="animate-spin text-[#160211]" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Container - Centered vertically when no messages */}
      <div className={`${hasMessages ? 'fixed bottom-0 left-0 right-0 z-20' : 'flex-1 flex items-center justify-center overflow-y-auto'}`} style={hasMessages ? {
        background: 'linear-gradient(to top, rgba(240, 247, 232, 1) 0%, rgba(240, 247, 232, 0.98) 30%, rgba(232, 245, 240, 0.95) 60%, transparent 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      } : {}}>
        <div className={`flex flex-col gap-[24px] sm:gap-[32px] max-w-[760px] mx-auto w-full px-4 sm:px-8 ${!hasMessages ? 'py-6 sm:py-8' : 'pt-3 sm:pt-4 pb-0'}`}>
          {/* Title - Only visible when no messages */}
          {!hasMessages && (
            <div className="flex items-center justify-center gap-[5px] px-4">
              <h2 
                className="font-medium text-[#160211] text-[24px] sm:text-[32px] text-center whitespace-nowrap"
                style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
              >
                Ask Me About DES 166
              </h2>
            </div>
          )}
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-white border border-[rgba(22,2,17,0.09)] flex items-center justify-between pl-[16px] sm:pl-[24px] pr-[8px] sm:pr-[12px] py-[8px] sm:py-[10px] rounded-[32px] w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-[#56637e] text-[13px] sm:text-[14px] focus:outline-none"
                style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 400 }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-[32px] bg-[#160211] flex items-center justify-center hover:bg-[#2a1a2a] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={12} className="sm:w-[14px] sm:h-[14px] text-white animate-spin" />
                ) : (
                  <Send size={12} className="sm:w-[14px] sm:h-[14px] text-white" />
                )}
              </button>
            </div>
          </form>

          {/* Frequently Asked Questions Section - Only visible when no messages */}
          {!hasMessages && (
            <div className="flex flex-col gap-[12px] sm:gap-[14px]">
              <p 
                className="font-medium text-[#56637e] text-[11px] sm:text-[12px] w-full"
                style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
              >
                Frequently Asked Questions
              </p>
              <div className="flex flex-col sm:flex-row gap-[10px] sm:gap-[14px] justify-center">
                {featuredQuestions.map((qa, index) => {
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
                                fileSources: data.fileSources,
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
                      className="bg-[rgba(255,255,255,0.5)] border border-white flex items-center justify-center p-[10px] rounded-[8px] hover:bg-[rgba(255,255,255,0.8)] transition-colors w-full sm:w-auto sm:flex-shrink-0"
                      style={{ 
                        width: `100%`,
                        maxWidth: '100%'
                      }}
                      data-width={widths[index]}
                    >
                      <p 
                        className="font-normal text-[#160211] text-[13px] sm:text-[14px] text-left flex-1 line-clamp-2"
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

        {/* Footer - Inside input container when messages exist */}
        {hasMessages && (
          <div className="py-2 sm:py-2 px-4" style={{
            background: 'rgba(240, 247, 232, 1)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}>
            <p 
              className="font-normal text-[9px] sm:text-[10px] text-center leading-tight"
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
              <span> and the team of DESIGN 166 instructors.</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer - Only visible when no messages */}
      {!hasMessages && (
        <div className="fixed bottom-0 left-0 right-0 py-2 sm:py-2 z-30 px-4" style={{
          background: 'rgba(240, 247, 232, 1)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}>
          <p 
            className="font-normal text-[9px] sm:text-[10px] text-center leading-tight"
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
            <span> and the team of DESIGN 166 instructors.</span>
          </p>
        </div>
      )}
    </div>
  );
}
