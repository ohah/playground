import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { Editor, Monaco, loader, useMonaco } from '@monaco-editor/react';
import parser from 'prettier/parser-babel';
import Prettier from 'prettier/standalone';

import { useFileStore } from '../model/store';

import { Tabs } from 'radix-ui';

import { type editor } from 'monaco-editor';

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

loader.config({
  'vs/nls': { availableLanguages: { '*': 'ko' } },
});

// TODO: 작업중.
const MonacoEditor = () => {
  const { files, updateFile } = useFileStore();

  const [file, setFile] = useState<string>('main.tsx');

  const monacoRef = useRef<Monaco>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFile({ id: file, content: value });
    }
  };

  const onFormatClick = async () => {
    if (monacoRef.current) {
      try {
        const unformatted = monacoRef.current?.editor
          ?.getModel(monacoRef?.current?.Uri.parse(`main.tsx`))
          ?.getValue();
        if (unformatted) {
          console.log('unformatted', unformatted.toString());
          const formatted = await Prettier.format(unformatted.toString(), {
            parser: 'babel',
            plugins: [parser],
            useTabs: true,
            semi: false,
            singleQuote: true,
          });

          console.log('formatted', formatted);

          // const editors = monacoRef.current.editor.getEditors();
          // if (editors.length > 0) {
          //   editors[0]?.setValue(formatted.replace(/\n$/, ''));
          // }
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const onMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    // monaco?.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    //   noSemanticValidation: true,
    //   noSyntaxValidation: false,
    // });
    monaco?.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.React, // JSX 지원 추가
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs, // 모듈 해석 설정
    });

    // useFileStore.getState().files.forEach((file, key) => {
    //   const model = monaco?.editor.getModel(monaco.Uri.parse(`${key}`));
    //   if (!model) {
    //     const newModel = monaco?.editor.createModel(
    //       file.content,
    //       'typescript',
    //       monaco.Uri.parse(`${key}`),
    //     );
    //     if (filename === key) {
    //       editor.setModel(newModel);
    //     }
    //   } else {
    //     if (filename === key) {
    //       editor.setModel(model);
    //     }
    //   }
    // });

    // editorRefs.current.set(filename, editor);
  };

  return (
    <Tabs.Root defaultValue='main.tsx' onValueChange={setFile}>
      <button onClick={onFormatClick}> asdf </button>
      <TabList>
        {files.size > 0 &&
          Array.from(files.keys()).map(key => (
            <TabTrigger key={key} value={key}>
              {key}
            </TabTrigger>
          ))}
      </TabList>
      <Editor
        height='90vh'
        path={file}
        defaultLanguage={files.get(file)?.type}
        defaultValue={files.get(file)?.content}
        onMount={(editor, monaco) => onMount(editor, monaco)}
        onChange={handleEditorChange}
      />
    </Tabs.Root>
  );
};

export default MonacoEditor;
