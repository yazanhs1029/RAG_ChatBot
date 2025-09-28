"use client";

import { useState } from "react";
import DarkModeButton from "../components/my_components/DarkModeButton";
import SourceComponent from "@/components/my_components/Source";
import ChatComponent from "../components/my_components/ChatComponent";

const App = () => {
  const [DarkMode, SetDarkMode] = useState(false);
  const [FileUploadingStatus, setFileUploadingStatus] = useState(false);
  const [FileName, setFileName] = useState<string | null>(null);

  // هذه الدالة لتحديث حالة رفع الملف
  const setFileUploading = (status: boolean) => {
    setFileUploadingStatus(status);
  };

  // هذه الدالة لتحديث اسم الملف بعد رفعه
  const handleFile = (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setFileUploading(true); // يبدأ التحميل مباشرة عند اختيار الملف
  };

  return (
    <div
      className={`h-screen w-screen transition-all duration-300 flex flex-col ${
        DarkMode ? "bg-[rgb(55,56,60)]" : "bg-[rgb(225,232,240)]"
      }`}
    >
      {/* زر الداكن */}
      <div className="flex justify-end pt-8 pr-8">
        <DarkModeButton SetDarkMode={SetDarkMode} DarkMode={DarkMode} />
      </div>

      {/* الحاوية الرئيسية للمكونات */}
      <div className="flex justify-center items-start gap-8 flex-1 pt-5">
        <SourceComponent
          DarkMode={DarkMode}
          FileStatusFunction={setFileUploading} // هنا نمرّر الدالة
          FileUploadingStatus={FileUploadingStatus}
          HandleFile={handleFile}
          SelectedFileInChatComponent={FileName}
          onDeleteFile={() => setFileName(null)}
        />
        <ChatComponent
          DarkMode={DarkMode}
          HandleFile={handleFile}
          FileStatusFunction={setFileUploading}
          FileUploadingStatus={FileUploadingStatus}
        />
      </div>
    </div>
  );
};

export default App;
