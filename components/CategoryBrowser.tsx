"use client";

import { useState } from "react";
import { qaData, categories } from "@/data/qa-data";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function CategoryBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const filteredQAs = selectedCategory
    ? qaData.filter((qa) => qa.category === selectedCategory)
    : qaData;

  return (
    <div className="p-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          All Topics
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* QA List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredQAs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No questions found in this category.
          </p>
        ) : (
          filteredQAs.map((qa) => (
            <div
              key={qa.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedQuestion(
                    expandedQuestion === qa.id ? null : qa.id
                  )
                }
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <span className="text-left font-medium text-gray-900 dark:text-white">
                  {qa.question}
                </span>
                {expandedQuestion === qa.id ? (
                  <ChevronUp className="flex-shrink-0 ml-2 text-gray-500" />
                ) : (
                  <ChevronDown className="flex-shrink-0 ml-2 text-gray-500" />
                )}
              </button>
              {expandedQuestion === qa.id && (
                <div className="px-4 py-3 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {qa.answer}
                  </p>
                  {qa.links && qa.links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Related Links:
                      </p>
                      {qa.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-1"
                        >
                          <ExternalLink size={14} />
                          {link}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
