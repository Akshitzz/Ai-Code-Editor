import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { ProjectView } from "@/features/projects/components/project-view";

export default async function Home() {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect("/auth");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ProjectView />
    </div>
  );
}
