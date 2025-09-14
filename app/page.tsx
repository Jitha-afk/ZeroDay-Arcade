import { Hero } from '@/components/hero';
import { Team } from '@/components/team';
import { Features } from '@/components/features';
import { SocialProof } from '@/components/social-proof';
import { Contact } from '@/components/contact';
import { Testimonials } from '@/components/testimonials';

export default function Page() {
  return (
    <main>
    <Hero />
    <Testimonials />
    <Team />
    <Features />
    <SocialProof />
    <Contact />
    </main>
  );
}
