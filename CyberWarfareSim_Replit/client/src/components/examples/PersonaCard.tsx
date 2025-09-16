import PersonaCard from '../PersonaCard';
import { PERSONAS } from "@shared/schema";

export default function PersonaCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-4xl">
      <PersonaCard
        name="Alex Chen"
        persona={PERSONAS.CISO}
        isOnline={true}
        currentRoom="executive"
        score={85}
        decisionsCount={3}
      />
      <PersonaCard
        name="Maria Santos"
        persona={PERSONAS.SOC_LEAD}
        isOnline={true}
        currentRoom="soc"
        score={92}
        decisionsCount={5}
      />
      <PersonaCard
        name="David Kim"
        persona={PERSONAS.SOC_ANALYST}
        isOnline={false}
        currentRoom="main"
        score={78}
        decisionsCount={2}
      />
      <PersonaCard
        name="Sarah Johnson"
        persona={PERSONAS.IT_HEAD}
        isOnline={true}
        currentRoom="it"
        score={88}
        decisionsCount={4}
      />
      <PersonaCard
        name="Michael Brown"
        persona={PERSONAS.PR_HEAD}
        isOnline={true}
        currentRoom="public"
        score={76}
        decisionsCount={1}
      />
      <PersonaCard
        name="Emily Davis"
        persona={PERSONAS.CEO}
        isOnline={false}
        currentRoom="executive"
        score={90}
        decisionsCount={2}
      />
    </div>
  );
}