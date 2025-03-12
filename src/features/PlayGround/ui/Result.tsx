import { useEffect, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import { useEditorStore } from '../model/store';

let esbuildInitialized = false;
const supportedExtensions = ['.tsx', '.ts', '.jsx', '.js'];

export const Result = () => {
  const { code, setCode } = useEditorStore();
  const [transpile, setTranspile] = useState('');

  useEffect(() => {
    const startService = async () => {
      if (!esbuildInitialized) {
        try {
          await esbuild.initialize({
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
          });
          esbuildInitialized = true;
        } catch (error) {
          console.error('esbuild 초기화 실패:', error);
          return;
        }
      }

      // 가상 파일 시스템 정의
      const files: Record<string, string> = {
        'index.tsx': `
          import React from 'react';
          import ReactDOM from 'react-dom';
          import { Foo } from './src/foo';
          
          const foo = new Foo();
          
          const App = () => <h1>Hello, World! {foo.constructor.name}</h1>;
          
          ReactDOM.render(<App />, document.getElementById('root'));
        `,
        'src/foo.ts': `
          export class Foo {
            constructor() {
              console.log("Foo instance created!");
            }
          }
        `,
      };
      console.log("🚀 Available files:", Object.keys(files));

      try {
        const result = await esbuild.build({
          entryPoints: ['index.tsx'],
          bundle: true,
          write: false,
          minify: true,
          plugins: [
            {
              name: 'virtual-filesystem',
              setup(build) {
                // React와 ReactDOM을 외부 CDN에서 가져오기
                build.onResolve({ filter: /^react$/ }, () => ({
                  path: 'https://unpkg.com/react@18/umd/react.production.min.js',
                  namespace: 'external',
                }));

                build.onResolve({ filter: /^react-dom$/ }, () => ({
                  path: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
                  namespace: 'external',
                }));

                build.onResolve({ filter: /^index\.tsx$/ }, () => ({
                  path: 'index.tsx',
                  namespace: 'virtual',
                }));

                build.onResolve({ filter: /^\.\// }, (args) => {
                  let basePath = args.path.replace(/^\.\//, '');

                  if (files[basePath]) {
                    return { path: basePath, namespace: 'virtual' };
                  }

                  for (const ext of supportedExtensions) {
                    if (files[basePath + ext]) {
                      return { path: basePath + ext, namespace: 'virtual' };
                    }
                  }

                  return { errors: [{ text: `File not found: ${args.path}` }] };
                });

                // ✅ 가상 파일 로드
                build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
                  if (!files[args.path]) {
                    return { errors: [{ text: `File not found: ${args.path}` }] };
                  }
                  return { contents: files[args.path], loader: 'tsx' };
                });

                build.onLoad({ filter: /.*/, namespace: 'external' }, async (args) => {
                  const response = await fetch(args.path);
                  const text = await response.text();
                  return { contents: text, loader: 'jsx' };
                });
              },
            },
          ],
        });

        if (result.outputFiles) {
          setTranspile(result.outputFiles[0].text);
        }
      } catch (error) {
        console.error('esbuild 빌드 실패:', error);
        return;
      }

    };

    startService();
  }, []);

  return (
    <div className="result" style={{ width: '100%', border: '1px solid black', height: '500px' }}>
      <iframe
        title="result"
        srcDoc={`<html><body><div id="root"></div><script>${transpile}</script></body></html>`}
        frameBorder="0"
        sandbox="allow-scripts"
      />
    </div>
  );
};
