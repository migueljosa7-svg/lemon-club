import { Suspense, lazy, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Events from "./components/Events";
import LemonCoins from "./components/LemonCoins";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import MemberCard from "./components/MemberCard";

const LegalModal = lazy(() => import("./components/LegalModal"));
const StaffScannerModal = lazy(() => import("./components/StaffScannerModal"));

function LemonSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-2xl animate-pulse rounded-[2rem] border-2 border-ink bg-cream p-8">
      <div className="h-6 w-1/3 rounded-full bg-ink/10" />
      <div className="mt-4 h-10 rounded-2xl bg-ink/10" />
      <div className="mt-3 h-24 rounded-2xl bg-ink/10" />
    </div>
  );
}

export default function App() {
  const [memberCode, setMemberCode] = useState<string | null>(null);

  useEffect(() => {
    const readHash = () => {
      const m = window.location.hash.match(/^#\/socio\/([A-Za-z0-9-]{2,32})/);
      setMemberCode(m ? m[1].toUpperCase() : null);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-cream">
      <Nav />
      <main id="contenido-principal">
        <Hero />
        <Manifesto />
        <Events />
        <LemonCoins />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
      <CookieBanner />
      <Suspense fallback={<LemonSkeleton />}>
        <LegalModal />
      </Suspense>
      <Suspense fallback={null}>
        <StaffScannerModal />
      </Suspense>
      {memberCode && <MemberCard code={memberCode} onClose={() => { window.location.hash = "#talleres"; }} />}
    </div>
  );
}

