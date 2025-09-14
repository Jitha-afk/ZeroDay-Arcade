import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { SocialProof } from '@/components/social-proof';
import { Team } from '@/components/team';
import { Contact } from '@/components/contact';
import { Testimonials } from '@/components/testimonials';

export default function Page() {
  return (
    <main>
  <Hero />
  <Testimonials />
      <Features />
      <SocialProof />
      <Team />
      <Contact />
    </main>
  );
}
