import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import AuthPageClient from "./AuthPageClient";

export default async function AuthPage() {
    const authed = await isAuthenticated();

    if (authed) {
        redirect("/");
    }

    return <AuthPageClient />;
}
