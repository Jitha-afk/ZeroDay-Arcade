"use client";

import { Settings, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

export function AdminCard() {
    const router = useRouter();
    return (
        <Card className="hover-elevate cursor-pointer" onClick={() => router.push('/cyberwarsim/admin')}>
            <CardHeader className="text-center">
                <Settings className="w-8 h-8 mx-auto text-primary" />
                <CardTitle className="font-mono text-lg">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                    Configure game sessions, assign player personas, and manage simulations
                </p>
            </CardContent>
        </Card>
    )
}

export function JoinCard() {
    const router = useRouter();
    return (
        <Card className="hover-elevate cursor-pointer" onClick={() => router.push('/cyberwarsim/join')}>
            <CardHeader className="text-center">
                <Users className="w-8 h-8 mx-auto text-primary" />
                <CardTitle className="font-mono text-lg">Join Game</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                    Enter an active simulation with your assigned cybersecurity role
                </p>
            </CardContent>
        </Card>
    )
}