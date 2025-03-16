import React, { useEffect, useRef } from 'react';

import styled from '@emotion/styled';
import Editor, { loader, Monaco } from '@monaco-editor/react';

import { useFileStore } from '../model/store';

import { Tabs } from 'radix-ui';

import { type editor } from 'monaco-editor';

const TabList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const Editor = styled.div`
  height: 90vh;
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
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<Monaco>(null);
  const codeEditor = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    loader.init().then(monaco => {
      monacoRef.current = monaco;
      if (editorRef.current && monacoRef.current) {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2015,
          allowNonTsExtensions: true,
          jsx: monaco.languages.typescript.JsxEmit.React, // JSX 지원 추가
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs, // 모듈 해석 설정
        });

        useFileStore.getState().files.forEach((file, key) => {
          const models = monaco.editor.getModel(
            monaco.Uri.parse(`file:///${key}`),
          );
          if (!models) {
            monaco.editor.createModel(
              file.content,
              'typescript',
              monaco.Uri.parse(`file:///${key}`),
            );
          }
        });

        console.log(
          'monacoRef.current.editor.getEditors()',
          monacoRef.current.editor.getModels(),
        );
        console.log(
          `monaco.editor.getModel(monaco.Uri.parse('file:///main.tsx'))`,
          monaco.editor.getModel(monaco.Uri.parse('file:///main.tsx')),
        );
        const editors = monacoRef.current.editor.getEditors();
        if (editors.length === 0) {
          codeEditor.current = monacoRef.current.editor.create(
            editorRef.current,
            {
              model: monaco.editor.getModel(
                monaco.Uri.parse('file:///main.tsx'),
              ),
              language: 'typescript',
              theme: 'vs-dark',
            },
          );
        }
      }
    });
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (monacoRef.current && editorRef.current) {
      const model = monacoRef.current.editor.getModel(
        monacoRef.current.Uri.parse(`file:///${value}`),
      );
      monacoRef.current.editor.setModelMarkers;
      const editors = monacoRef.current.editor.getEditors();
      // urlParse를 알고 싶어요, 모델 명
      editors.forEach(editor => {
        if (editor.getModel()?.uri.toString() === `file:///${value}`) {
          if (editor && model) {
            editor.setModel(null); // 기존 모델 해제
            editor.setModel(model); // 다시 설정
          }
        }
      });
      if (model) {
        console.log('model.getValue()', model.getValue());
        model.setValue(model.getValue());
      }

      // console.log('model.getValue()', model?.getValue());
      // if (model) {
      //   model.setValue(model.getValue());
      //   model.f
      // }
    }
  };

  return (
    <Tabs.Root defaultValue='main.tsx' onValueChange={handleEditorChange}>
      <TabList>
        {files.size > 0 &&
          Array.from(files.keys()).map(key => (
            <TabTrigger key={key} value={key}>
              {key}
            </TabTrigger>
          ))}
      </TabList>
      <Editor ref={editorRef} />
    </Tabs.Root>
  );
};

export default MonacoEditor;
