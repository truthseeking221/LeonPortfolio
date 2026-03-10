import { useWebGLBackground } from './hooks/useWebGLBackground';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ModelsCatalog from './components/ModelsCatalog';
import FeaturesGrid from './components/FeaturesGrid';
import CodePreview from './components/CodePreview';
import OrbitalSection from './components/OrbitalSection';
import Timeline from './components/Timeline';
import PricingSection from './components/PricingSection';
import DimensionsSection from './components/DimensionsSection';
import GallerySection from './components/GallerySection';
import MarqueeSection from './components/MarqueeSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function App() {
  const canvasRef = useWebGLBackground();

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none"
      />

      <Header />
      <HeroSection />

      <main className="z-10 w-full relative">
        <FeaturesGrid />
        <ModelsCatalog />
        <CodePreview />
        <OrbitalSection />
        <Timeline />
        <GallerySection />
        <MarqueeSection />
        <DimensionsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
