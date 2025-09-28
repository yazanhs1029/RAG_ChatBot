import { useState } from "react";

const Title = ({ DarkMode }: { DarkMode: boolean }) => {
  return (
    <h1
      className={`font-Ubuntu transition-all duration-300 ml-24 ${
        DarkMode ? "text-white" : "text-black"
      }`}
    >
      Hello
    </h1>
  );
};

export default Title;
