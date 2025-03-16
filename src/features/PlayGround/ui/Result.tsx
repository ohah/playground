import styled from '@emotion/styled';
import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import { useFileStore } from '../model/store';

const supportedExtensions = ['.tsx', '.ts', '.jsx', '.js'];

const SandBoxFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const Result = () => {
  const { files } = useFileStore();

  const sandBoxRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const startService = async () => {
      try {
        const result = await esbuild.build({
          entryPoints: ['main.tsx'],
          bundle: true,
          write: false,
          minify: false,
          plugins: [
            {
              name: 'virtual-filesystem',
              setup(build) {
                build.onResolve({ filter: /^react$/ }, () => ({
                  path: './react/react.production.min.js',
                  namespace: 'external',
                }));

                build.onResolve({ filter: /^react-dom$/ }, () => ({
                  path: './react/react-dom.production.min.js',
                  namespace: 'external',
                }));

                build.onResolve({ filter: /^main\.tsx$/ }, () => ({
                  path: 'main.tsx',
                  namespace: 'virtual',
                }));

                build.onResolve({ filter: /^\.\// }, args => {
                  const basePath = args.path.replace(/^\.\//, '');

                  if (files.has(basePath)) {
                    return { path: basePath, namespace: 'virtual' };
                  }

                  for (const ext of supportedExtensions) {
                    if (files.has(basePath + ext)) {
                      return { path: basePath + ext, namespace: 'virtual' };
                    }
                  }

                  return { errors: [{ text: `File not found: ${args.path}` }] };
                });

                build.onLoad({ filter: /.*/, namespace: 'virtual' }, args => {
                  if (!files.has(args.path)) {
                    return {
                      errors: [{ text: `File not found: ${args.path}` }],
                    };
                  }
                  return {
                    contents: files.get(args.path)?.content,
                    loader: 'tsx',
                  };
                });

                build.onLoad({ filter: /.*/, namespace: 'external' }, async args => {
                  const response = await fetch(args.path);
                  const text = await response.text();
                  return { contents: text, loader: 'jsx' };
                });
              },
            },
          ],
        });

        if (result.outputFiles) {
          sandBoxRef.current?.contentWindow?.postMessage(result.outputFiles[0].text, '*');
        }
      } catch (error) {
        console.error('esbuild 빌드 실패:', error);
        return;
      }
    };

    startService();
  }, [files]);

  return (
    <Container>
      <SandBoxFrame ref={sandBoxRef} title='result' src='./sandbox.html' frameBorder='0' sandbox='allow-scripts' />
    </Container>
  );
};
