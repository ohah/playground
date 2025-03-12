import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { BrowserRouter, Route, Routes } from "react-router";

import { Global, css } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { Home } from "./pages";



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    {/* <React.StrictMode> */}
    <Global styles={css`
      ${emotionReset}
        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }
  	`} />
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/App" element={<App />} />
      </Routes>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </>
);
