"use client";

import { useRef } from "react";
import Loading from "./Loading";
import { FaPlus } from "react-icons/fa";
import { MdPictureAsPdf, MdOutlineDelete } from "react-icons/md";
import { LuFiles } from "react-icons/lu";

interface SourceComponentProps {
  DarkMode: boolean;
  SelectedFileInChatComponent: string | null;
  onDeleteFile: () => void;
  FileStatusFunction: (status: boolean) => void;
  FileUploadingStatus: boolean;
  HandleFile: (file: File | null) => void;
}

const SourceComponent = ({
  DarkMode,
  SelectedFileInChatComponent,
  onDeleteFile,
  FileStatusFunction,
  FileUploadingStatus,
  HandleFile,
}: SourceComponentProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = () => onDeleteFile();

  const ReadAndSendTheFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    HandleFile(file); // يضبط اسم الملف ويبدأ الشعار

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error");

      const result = await response.json();
      console.log("Upload success:", result);
    } catch (error) {
      console.error(error);
    } finally {
      FileStatusFunction(false); // بعد ما يرجع الرد من الباك اند، يوقف الشعار
    }
  };

  return (
    <div
      className={`lg:w-[430px] lg:h-[600px] pt-5 rounded-3xl flex flex-col transition-all duration-300 ${
        DarkMode ? "bg-[rgb(34,37,42)] text-white" : "bg-white text-black"
      }`}
    >
      <p className="ml-6 text-lg">Source</p>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={ReadAndSendTheFile}
        accept=".pdf"
      />

      <hr
        className={`mt-6 w-full transition-all duration-300 ${
          DarkMode ? "border-[rgb(51,54,59)]" : "border-[rgb(229,228,230)]"
        }`}
      />

      <div className="flex w-full justify-center mt-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-2 w-44 rounded-3xl h-10 justify-center border transition-all duration-300 ${
            DarkMode
              ? "border-[rgb(51,54,59)] hover:bg-[rgb(44,48,54)]"
              : "hover:bg-gray-300"
          }`}
        >
          <FaPlus className="text-gray-400 transition-all duration-300" />
          Add
        </button>
      </div>

      {/* حالة رفع الملف */}
      {FileUploadingStatus && (
        <div className="flex justify-center mt-6">
          <Loading />
        </div>
      )}

      {/* اسم الملف بعد رفعه */}
      {SelectedFileInChatComponent && !FileUploadingStatus && (
        <div
          className={`flex items-center gap-2 mt-6 ml-4 w-[360px] rounded-2xl ${
            DarkMode ? "hover:bg-red-700" : "hover:bg-red-200"
          }`}
        >
          <MdPictureAsPdf size={24} />
          <div className="flex items-center justify-between flex-1 p-2">
            <p className="truncate w-[275px]">{SelectedFileInChatComponent}</p>
            <div className="cursor-pointer" onClick={handleDelete}>
              <MdOutlineDelete size={24} />
            </div>
          </div>
        </div>
      )}

      {/* نص افتراضي */}
      {!SelectedFileInChatComponent && !FileUploadingStatus && (
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
          <LuFiles size={36} className="text-gray-400" />
          <p className="text-2xl text-gray-400">
            Saved source will appear here
          </p>
          <p className="text-center text-gray-400 lg:w-[330px]">
            Click Add and choose your PDF file to start chatting with the bot
          </p>
        </div>
      )}
    </div>
  );
};

export default SourceComponent;
