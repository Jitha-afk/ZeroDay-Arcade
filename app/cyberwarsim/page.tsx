import { AdminCard, JoinCard } from "@/components/cyberwarsim/cards";
import { Shield } from "lucide-react";

export default function Page() {
    return (
        <main className="min-h-screen w-full">
            <div className="flex items-center justify-center gap-2 min-h-screen">
                <div>
                    <div className="flex justify-center items-center mb-4">
                        <Shield className="w-12 h-12 text-primary animate-pulse" />
                        <h1 className="text-5xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
                    </div>
                    <div>
                        <h2 className="text-2xl font-mono text-foreground text-center">Cybersecurity Breach Response Training</h2>
                        <p className="text-muted-foreground max-w-lg mx-auto text-center">
                            Experience realistic AI-powered cyberattack scenarios. Train your incident response team
                            through immersive role-playing simulations with real-time decision making.
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                            <AdminCard />
                            <JoinCard />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
