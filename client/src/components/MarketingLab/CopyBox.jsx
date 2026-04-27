import React, {useState} from "react";
import {Copy, Check} from "lucide-react";

export default function CopyBox({text, isLarge = false}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative group bg-[#110f14] rounded-lg border border-white/5 p-4 hover:border-pink-500/30 transition-colors ${isLarge ? "min-h-[100px]" : ""}`}
    >
      <p className="pr-8 whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
        {text}
      </p>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 bg-white/5 rounded hover:bg-pink-500/20 text-gray-400 hover:text-pink-400 transition-colors"
        title="העתק טקסט"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
