import { PlayGround } from '@/features';
import { Header } from '@/widgets';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Home = () => {
  return (
    <Container>
      <Header />
      <PlayGround />
    </Container>
  );
};

export default Home;
