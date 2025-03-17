import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { BrowserRouter, Route, Routes } from 'react-router';

import { Global, css } from '@emotion/react';
import emotionReset from 'emotion-reset';
import * as esbuild from 'esbuild-wasm';
import { Home } from './pages';

try {
  await esbuild.initialize({
    worker: true,
    wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
  });
} catch (error) {
  console.error('esbuild 초기화 실패:', error);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    {/* <React.StrictMode> */}
    <Global
      styles={css`
        ${emotionReset}
        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }
      `}
    />
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/App' element={<App />} />
      </Routes>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </>,
);
