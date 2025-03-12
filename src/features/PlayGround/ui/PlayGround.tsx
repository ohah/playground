import React from 'react';

import { Result } from './Result';
import styled from '@emotion/styled';
import MonacoEditor from './MonacoEditor';

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const EditorContainer = styled.div`
  flex: 1;
  border-right: 1px solid #ddd;
`;

const ResultContainer = styled.div`
  flex: 1;
  width: 50%;
`;

export const PlayGround = () => {
  return (
    <Container>
      <EditorContainer>
        <MonacoEditor />
      </EditorContainer>
      <ResultContainer>
        <Result />
      </ResultContainer>
    </Container>
  );
};