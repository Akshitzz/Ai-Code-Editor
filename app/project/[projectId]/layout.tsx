import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { ProjectIdLayout } from "@/features/projects/components/project-id-layout";
import type { Id } from "@/convex/_generated/dataModel";

const Layout = async ({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
}) => {
    const authed = await isAuthenticated();
    if (!authed) {
        redirect("/auth");
    }

    const { projectId } = await params;
    return (
        <ProjectIdLayout projectId={projectId as Id<"projects">}>
            {children}
        </ProjectIdLayout>
    );
};
export default Layout;