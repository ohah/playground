import React, { useEffect, useRef } from 'react';

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

// const Editor = styled.div`
//   height: 90vh;
// `;

const TabContent = styled(Tabs.Content)`
  padding: 20px;
  background-color: #fff;
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
  const editorRefs = useRef<Map<string, editor.IStandaloneCodeEditor>>(
    new Map(),
  );
  const monacoRef = useRef<Monaco>(null);
  const codeEditor = useRef<editor.IStandaloneCodeEditor[]>([]);

  const handleEditorChange = (value: string | undefined) => {
    if (monacoRef.current) {
      const model = monacoRef.current.editor.getModel(
        monacoRef.current.Uri.parse(`file:///${value}`),
      );
      console.log('value', value);
      monacoRef.current.editor.setModelMarkers;
      const editors = monacoRef.current.editor.getEditors();
      editors.forEach(editor => {
        if (editor.getModel()?.uri.toString() === `file:///${value}`) {
          if (editor && model) {
            editor.setModel(null);
            if (model) {
              console.log('model.getValue()', model.getValue());
              // model.setValue(model.getValue());
              // editor.setValue(value?.toString() || '');
            }
          }
        }
      });

      // console.log('model.getValue()', model?.getValue());
      // if (model) {
      //   model.setValue(model.getValue());
      //   model.f
      // }
    }
  };

  const onFormatClick = async () => {
    if (monacoRef.current) {
      try {
        const unformatted = monacoRef.current?.editor
          ?.getModel(monacoRef?.current?.Uri.parse(`file:///main.tsx`))
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

  const onMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
    filename: string,
  ) => {
    monaco?.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    monaco?.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.React, // JSX 지원 추가
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs, // 모듈 해석 설정
    });

    useFileStore.getState().files.forEach((file, key) => {
      const model = monaco?.editor.getModel(monaco.Uri.parse(`file:///${key}`));
      if (!model) {
        const newModel = monaco?.editor.createModel(
          file.content,
          'typescript',
          monaco.Uri.parse(`file:///${key}`),
        );
        if (filename === key) {
          editor.setModel(newModel);
        }
      } else {
        if (filename === key) {
          editor.setModel(model);
        }
      }
    });

    editorRefs.current.set(filename, editor);
  };

  return (
    <Tabs.Root defaultValue='main.tsx' onValueChange={handleEditorChange}>
      <button onClick={onFormatClick}> asdf </button>
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
              <Editor
                height='90vh'
                defaultLanguage={type}
                value={content}
                onMount={(editor, monaco) => onMount(editor, monaco, key)}
                // onChange={handleEditorChange}
              />
            </TabContent>
          );
        })}
    </Tabs.Root>
  );
};

export default MonacoEditor;
