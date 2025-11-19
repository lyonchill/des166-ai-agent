"use client";

import { useState, useEffect } from "react";

type QAItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
  links?: string[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  count?: number;
};

export default function CategoryBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [filteredQAs, setFilteredQAs] = useState<QAItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load QAs from API
  useEffect(() => {
    setIsLoading(true);
    const url = selectedCategory
      ? `/api/qa?category=${selectedCategory}`
      : "/api/qa?onePerCategory=true";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setFilteredQAs(data.data);
        }
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Failed to load QAs:", err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  return (
    <div className="overflow-clip relative w-full min-h-screen flex flex-col">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-[4px] items-center px-8 md:px-[120px] pt-[100px] pb-6">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(isSelected ? null : category.id);
                setExpandedQuestion(null);
              }}
              className={`flex items-center gap-[4px] h-[34px] px-[14px] py-[6px] rounded-[17px] border border-neutral-200 transition-all ${
                isSelected
                  ? "bg-[#160211] text-white"
                  : "bg-white text-[#160211] hover:bg-gray-50"
              }`}
              style={{ 
                fontFamily: 'var(--font-manrope), sans-serif', 
                fontWeight: 400,
                fontSize: '16px'
              }}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-[14px] px-8 md:px-[120px] pb-[60px]">
        {isLoading ? (
          <div className="text-center py-8 text-[#56637e]">載入中...</div>
        ) : (
          filteredQAs.map((qa, index) => {
          const isExpanded = expandedQuestion === qa.id;
          return (
            <button
              key={qa.id}
              onClick={() => setExpandedQuestion(isExpanded ? null : qa.id)}
              className={`w-full p-[10px] rounded-[8px] border border-white text-left transition-colors ${
                isExpanded
                  ? "bg-[rgba(233,233,233,0.5)]"
                  : "bg-[rgba(233,233,233,0.5)] hover:bg-[rgba(233,233,233,0.7)]"
              }`}
            >
              <p 
                className="font-normal text-[#160211] text-[14px]"
                style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 400 }}
              >
                {qa.question}
              </p>
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[rgba(22,2,17,0.09)]">
                  <p 
                    className="text-[#160211] text-[14px] whitespace-pre-wrap mb-3"
                    style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontWeight: 400 }}
                  >
                    {qa.answer}
                  </p>
                  {qa.links && qa.links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[rgba(22,2,17,0.09)]">
                      <p 
                        className="text-xs font-medium text-[#56637e] mb-2"
                        style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 500 }}
                      >
                        Related Links:
                      </p>
                      {qa.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#008fb4] hover:underline mb-1"
                          style={{ fontFamily: 'var(--font-manrope), sans-serif', textDecoration: 'underline', textUnderlinePosition: 'from-font' }}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        }))}
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
