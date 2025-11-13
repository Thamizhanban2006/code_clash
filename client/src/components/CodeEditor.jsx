// src/components/CodeEditor.jsx
import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language = "python", value, onChange }) {
  return (
    <div className="border border-[#00FF41]/40 rounded-xl shadow-[0_0_10px_#00FF41] overflow-hidden">
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={(v) => onChange(v || "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          tabSize: 2,
          scrollBeyondLastLine: false,
          fontFamily: "Fira Code, monospace",
          lineNumbersMinChars: 3,
          cursorBlinking: "smooth",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
        }}
      />
    </div>
  );
}
