import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import InteractionExperiences from './components/InteractionExperiences.jsx';
import BrandStory from './components/BrandStory.jsx';
import WhyActiVA from './components/WhyActiVA.jsx';
import WorkedExample from './components/WorkedExample.jsx';
import HowWeWork from './components/HowWeWork.jsx';
import FAQ from './components/FAQ.jsx';
import DemoRequestForm from './components/DemoRequestForm.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="main">
        <Hero />
        <HowItWorks />
        <InteractionExperiences />
        <BrandStory />
        <WorkedExample />
        <WhyActiVA />
        <HowWeWork />
        <FAQ />
        <DemoRequestForm />
      </main>
      <Footer />
    </MotionConfig>
  );
}
