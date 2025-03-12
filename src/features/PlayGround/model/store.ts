import { create } from "zustand";

interface EditorState {
  code: string;
  setCode: (code: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: `import React from 'react';
import ReactDOM from 'react-dom';
const App = () => <h1>Hello, Wasdfasdforld!</h1>;
ReactDOM.render(<App />, document.getElementById('root'));`,
  setCode: (code) => set({ code }),
}));
