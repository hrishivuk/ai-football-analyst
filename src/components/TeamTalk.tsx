"use client";

import { useState } from "react";
import { MatchInput } from "@/types";
import { IconMic } from "@/components/Icons";

interface TeamTalkProps {
  input: MatchInput;
}

export default function TeamTalk({ input }: TeamTalkProps) {
  const [speech, setSpeech] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSpeech = async () => {
    setLoading(true);
    setSpeech("");

    try {
      const res = await fetch("/api/team-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) throw new Error("Failed to generate speech");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        result += chunk;
        setSpeech(result);
      }
    } catch {
      setSpeech("Failed to generate team talk. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={generateSpeech}
        disabled={loading || !input.opponentName}
        className="w-full py-4 bg-linear-to-r from-red-600 to-rose-500 text-white font-bold rounded-xl hover:from-red-500 hover:to-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 text-sm"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Writing Team Talk...
          </>
        ) : (
          <>
            <IconMic className="w-4.5 h-4.5" />
            Generate Pre-Match Team Talk
          </>
        )}
      </button>

      {speech && (
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-500 via-rose-500 to-amber-500" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <IconMic className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-(family-name:--font-display) text-base font-bold text-white">
                Pre-Match Team Talk
              </h3>
              <p className="text-xs text-slate-500">
                vs {input.opponentName}
              </p>
            </div>
          </div>

          <blockquote className="text-slate-200 leading-[1.8] text-[15px] whitespace-pre-wrap border-l-2 border-red-500/30 pl-5 italic">
            {speech}
            {loading && (
              <span className="inline-block w-0.5 h-5 bg-red-400 ml-0.5 animate-pulse align-middle" />
            )}
          </blockquote>
        </div>
      )}
    </div>
  );
}
