import styled from '@emotion/styled';
import Editor from '@monaco-editor/react';
import { Tabs } from 'radix-ui';
import React, { useEffect, useRef } from 'react';
import { type FileData, useFileStore } from '../model/store';

const TabList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const TabTrigger = styled(Tabs.Trigger)`
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 16px;
  &:hover {
    background-color: #f0f0f0;
  }
  &[data-state="active"] {
    border-bottom: 2px solid #007acc;
    color: #007acc;
  }
`;

const TabContent = styled(Tabs.Content)`
  padding: 20px;
  background-color: #fff;
`;

const MonacoEditor = () => {
  const { files, updateFile } = useFileStore();
  const currentTab = useRef<string>('main.tsx');
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFile({
        id: currentTab.current,
        content: value,
      });
    }
  };

  return (
    <>
      <Tabs.Root defaultValue='main.tsx' onValueChange={value => (currentTab.current = value)}>
        <TabList>
          {files.size > 0 &&
            Array.from(files.keys()).map(key => (
              <TabTrigger key={key} value={key}>
                {key}
              </TabTrigger>
            ))}
        </TabList>
        {files.size > 0 &&
          Array.from(files.keys()).map(key => {
            const { content, type } = files.get(key) || {};
            return (
              <TabContent key={key} value={key}>
                <Editor height='90vh' defaultLanguage={type} value={content} onChange={handleEditorChange} />
              </TabContent>
            );
          })}
      </Tabs.Root>
    </>
  );
};

export default MonacoEditor;
