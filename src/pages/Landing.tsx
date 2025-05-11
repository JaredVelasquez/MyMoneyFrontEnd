import NavBar from '../components/landing/NavBar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing; 