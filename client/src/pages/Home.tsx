import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Container } from '../styles/GlobalStyles';
import { Footer } from '../components/Footer';
import { TradeSection } from '../components/TradeSection';

export const Home = () => {
  return (
    <>
      <Container>
        <Header />
        <Hero />
        <TradeSection />
      </Container>
      <Footer />
    </>
  )
}
