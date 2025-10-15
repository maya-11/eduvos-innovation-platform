import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eduvos-deep via-purple-900/10 to-eduvos-deep">
      <Navigation />
      <main>
        <HeroSection />
        {/* We'll add more sections here */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
