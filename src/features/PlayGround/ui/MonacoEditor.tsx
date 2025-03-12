import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../model/store';

const MonacoEditor = () => {
  const { code, setCode } = useEditorStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      value={code}
      onChange={handleEditorChange}
    />
  );
};

export default MonacoEditor;