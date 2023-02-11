import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Container } from '../styles/GlobalStyles';
import { Footer } from '../components/Footer';

export const Home = () => {
  return (
    <>
      <Container>
        <Header />
        <Hero />
      </Container>
      <Footer />
    </>
  )
}
