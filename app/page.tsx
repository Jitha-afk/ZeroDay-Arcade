import { Hero } from '@/components/hero';
import { Team } from '@/components/team';
import { Features } from '@/components/features';
import { SocialProof } from '@/components/social-proof';
import { Contact } from '@/components/contact';
import { Testimonials } from '@/components/testimonials';

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <div className="snap-start" id="hero-section">
        <Hero />
      </div>
      <div className="snap-start" id="testimonials-section">
        <Testimonials />
      </div>
      <div className="snap-start" id="team-section">
        <Team />
      </div>
      <div className="snap-start" id="features-section">
        <Features />
      </div>
      <div className="snap-start" id="social-proof-section">
        <SocialProof />
      </div>
      <div className="snap-start" id="contact-section">
        <Contact />
      </div>
    </main>
  );
}
