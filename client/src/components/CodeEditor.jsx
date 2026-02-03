// src/components/CodeEditor.jsx
import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language = "python", value, onChange, readOnly = false }) {
  return (
    <div className={`border rounded-xl overflow-hidden ${readOnly ? 'border-gray-600 opacity-75' : 'border-emerald-500/40'}`}>
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={(v) => !readOnly && onChange(v || "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          tabSize: 2,
          scrollBeyondLastLine: false,
          fontFamily: "Fira Code, Consolas, monospace",
          lineNumbersMinChars: 3,
          cursorBlinking: "smooth",
          readOnly: readOnly,
          domReadOnly: readOnly,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
        }}
      />
    </div>
  );
}
