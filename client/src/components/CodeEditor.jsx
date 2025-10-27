// src/components/CodeEditor.jsx
import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ language = 'python', value, onChange }) {
  return (
    <div className="border rounded shadow h-full">
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={(v) => onChange(v || '')}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          tabSize: 2,
          scrollBeyondLastLine: false
        }}
      />
    </div>
  );
}
