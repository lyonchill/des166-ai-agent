"use client";

import { useState, useEffect } from "react";
import { Download, Search, Calendar, MessageSquare } from "lucide-react";

type InteractionRecord = {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  sources?: any[];
  fileSources?: any[];
  model?: string;
  sessionId: string;
  relevantQAs?: number[];
};

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<InteractionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    uniqueSessions: 0,
    today: 0,
  });

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const response = await fetch("/api/interactions");
      const data = await response.json();
      if (data.interactions) {
        setInteractions(data.interactions);
        calculateStats(data.interactions);
      }
    } catch (error) {
      console.error("Error fetching interactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records: InteractionRecord[]) => {
    const uniqueSessions = new Set(records.map((r) => r.sessionId));
    const today = new Date().toDateString();
    const todayRecords = records.filter(
      (r) => new Date(r.timestamp).toDateString() === today
    );

    setStats({
      total: records.length,
      uniqueSessions: uniqueSessions.size,
      today: todayRecords.length,
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchInteractions();
      return;
    }

    try {
      const response = await fetch(`/api/interactions?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.interactions) {
        setInteractions(data.interactions);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleExport = () => {
    window.location.href = "/api/interactions/export";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7e8] to-[#e8f5f0] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#160211] mb-2">Student Interactions</h1>
          <p className="text-gray-600">View and export student questions and AI responses</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-700">Total Interactions</h3>
            </div>
            <p className="text-2xl font-bold text-[#160211]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-700">Today</h3>
            </div>
            <p className="text-2xl font-bold text-[#160211]">{stats.today}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-700">Unique Sessions</h3>
            </div>
            <p className="text-2xl font-bold text-[#160211]">{stats.uniqueSessions}</p>
          </div>
        </div>

        {/* Search and Export */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search questions or answers..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#160211]"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#160211] text-white rounded-lg hover:bg-[#2a1a2a] transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Interactions List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : interactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No interactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(interaction.timestamp)}
                    </span>
                    {interaction.model && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {interaction.model}
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold text-[#160211] mb-1">Q: {interaction.question}</p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      A: {interaction.answer}
                    </p>
                  </div>
                  {(interaction.sources || interaction.fileSources) && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {interaction.fileSources?.map((file, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            📄 {file.title}
                            {file.pageNumber && ` (Page ${file.pageNumber})`}
                          </span>
                        ))}
                        {interaction.sources
                          ?.filter((s) => typeof s === "string" || s.type === "link")
                          .map((source, idx) => (
                            <a
                              key={idx}
                              href={typeof source === "string" ? source : source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:underline"
                            >
                              🔗 Link
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
