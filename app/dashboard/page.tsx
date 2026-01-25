"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth"); // Redirect to login after sign out
                },
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
                Welcome to your dashboard{session?.user?.name ? `, ${session.user.name}` : ""}!
            </p>
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <p>This is a protected sample page you see after signing up.</p>
            </div>

            <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
            </Button>
        </div>
    )
}
