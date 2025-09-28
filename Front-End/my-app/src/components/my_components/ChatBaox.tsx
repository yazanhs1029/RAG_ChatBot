"use client";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

const ChatBox = ({
  DarkMode,
  HandleTextInTextAreaInParent,
}: {
  DarkMode: boolean;
  HandleTextInTextAreaInParent: (value: string) => void;
}) => {
  const [TextInTextArea, setTextInTextArea] = useState<string | "">("");

  const handleTextAreaSend = () => {
    HandleTextInTextAreaInParent(TextInTextArea);
    setTextInTextArea("");
  };

  return (
    <div className="flex flex-col items-start">
      <div
        className={`w-[850px] h-[120px] rounded-2xl border transition-all duration-300 relative p-4 flex items-start justify-between ${
          DarkMode ? "bg-[rgb(34,37,42)] border-[rgb(78,84,93)]" : "bg-white"
        }`}
      >
        <textarea
          value={TextInTextArea || ""}
          rows={3}
          onChange={(e) => setTextInTextArea(e.target.value)}
          placeholder="Start here..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!e.shiftKey) {
                e.preventDefault(); // لازم يكون أول شيء
                if (TextInTextArea.trim() !== "") {
                  handleTextAreaSend();
                }
              }
              // لو Shift+Enter → تسمح بسطر جديد، إذا بدك
            }
          }}
          className={`w-[730px] text-lg rounded-lg resize-none border-none outline-none transition-all duration-300 scrollbar ${
            DarkMode
              ? "placeholder-white scrollbar-thumb-gray-400 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
              : "placeholder-gray-300 scrollbar-thumb-gray-400 scrollbar-track-white scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          }`}
        />

        <button
          onClick={() => {
            handleTextAreaSend();
          }}
          disabled={TextInTextArea == null}
          className={`w-10 h-10 rounded-4xl flex items-center justify-center transition-all duration-300 mr-4 flex-shrink-0 ${
            !TextInTextArea || TextInTextArea.trim() === ""
              ? "opacity-50 cursor-not-allowed"
              : "bg-[rgb(58,77,214)] hover:bg-[rgb(81,97,215)] transition-transform hover:scale-95 cursor-pointer"
          }`}
        >
          <IoSend size={20} className="transition-all duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
