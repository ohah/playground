import { create } from 'zustand';

export interface FileData {
  content: string; // 파일 내용
  isModified: boolean; // 수정 여부
  type?: string; // 파일 타입 (예: "typescript", "javascript")
}

interface EditorState {
  files: Map<string, FileData>; // key: 파일 ID or 경로, value: 파일 데이터
  addFile: ({ id, file }: { id: string; file: FileData }) => void;
  updateFile: ({ id, content }: { id: string; content: string }) => void;
  deleteFile: (id: string) => void;
}

const initialFiles = new Map<string, FileData>();
initialFiles.set('main.tsx', {
  content: `import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <h1>Hello, Wasdfasdforld!</h1>;

ReactDOM.render(<App />, document.getElementById('root'));`,
  isModified: false,
  type: 'typescript',
});

initialFiles.set('foo.ts', {
  content: `export class Foo {
  constructor() {
    console.log("Foo instance created!");
  }
}`,
  isModified: false,
  type: 'typescript',
});

export const useFileStore = create<EditorState>(set => ({
  files: initialFiles,
  addFile: ({ id, file }) =>
    set(state => {
      const newFiles = new Map(state.files).set(id, file);
      return { files: newFiles };
    }),

  updateFile: ({ id, content }) =>
    set(state => {
      const file = state.files.get(id);
      if (!file) return state; // 파일이 없으면 변경하지 않음
      const updatedFile = { ...file, content, isModified: true };
      const newFiles = new Map(state.files).set(id, updatedFile);
      return { files: newFiles };
    }),

  deleteFile: id =>
    set(state => {
      const newFiles = new Map(state.files);
      newFiles.delete(id);
      return { files: newFiles };
    }),
}));
