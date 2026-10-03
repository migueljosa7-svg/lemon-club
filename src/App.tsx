import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Events from "./components/Events";
import LemonCoins from "./components/LemonCoins";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-cream">
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Events />
        <LemonCoins />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
