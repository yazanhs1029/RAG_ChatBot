"use client";

import { useState, useRef, useEffect } from "react";
import ChatBox from "./ChatBaox";

const ChatComponent = ({
  DarkMode,
  HandleFile,
  FileStatusFunction,
  FileUploadingStatus,
}: {
  DarkMode: boolean;
  HandleFile: (file: File | null) => void;
  FileStatusFunction: (status: boolean) => void;
  FileUploadingStatus: boolean;
}) => {
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const FileInChatComponent = useRef<HTMLInputElement | null>(null);

  const HandleTextInTextAreaInParent = (value: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: value }]);
    fetch("http://localhost:8000/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TextContent: value }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      })
      .catch((err) => console.error(err));
  };

  const HandleFileSendingToSource = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    HandleFile(file);
    FileStatusFunction(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className={`rounded-3xl w-full max-w-[1000px] h-full max-h-[600px] transition-all duration-300 pt-5 flex flex-col ${
        DarkMode ? "bg-[rgb(34,37,42)] text-white" : "bg-white text-black"
      }`}
    >
      <input
        type="file"
        className="hidden"
        accept=".pdf"
        ref={FileInChatComponent}
        onChange={HandleFileSendingToSource}
      />
      <p className="ml-6 text-lg transition-all duration-300">Chat</p>
      <hr
        className={`mt-6 w-full transition-all duration-300 ${
          DarkMode ? "border-[rgb(51,54,59)]" : "border-[rgb(229,228,230)]"
        }`}
      />

      <div className="flex-1 flex flex-col pb-4 overflow-hidden">
        {/* Default view */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <p
              className={`text-gray-400 text-2xl ${
                FileUploadingStatus ? "hidden" : ""
              }`}
            >
              Powered by Gemini-2.5-flash
            </p>
            <p
              className={`text-gray-400 ${FileUploadingStatus ? "hidden" : ""}`}
            >
              Upload your source to start
            </p>
          </div>
        )}

        {/* Messages view */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col w-full">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-3 rounded-xl max-w-[60%] break-words ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ChatBox fixed at bottom */}
        <div className="mt-4 w-full flex justify-center items-center">
          <ChatBox
            DarkMode={DarkMode}
            HandleTextInTextAreaInParent={HandleTextInTextAreaInParent}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

