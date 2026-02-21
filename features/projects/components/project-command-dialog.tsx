import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import { useProjects } from "../hooks/use-project";
import { authClient } from "@/lib/auth-client";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Doc } from "@/convex/_generated/dataModel";



interface ProjectsCommandDialogProps {
    open:boolean;
    onOpenChange  : (open:boolean )=>void;

}
const getProjectIcon = (project: Doc<"projects">) => {
    if (project.importStatus === "completed") {
        return <FaGithub className="size-4 text-foreground" />
    }
    if (project.importStatus === "failed") {
        return <AlertCircleIcon className="size-4 text-foreground" />
    }
    if (project.importStatus === "importing") {
        return <Loader2Icon className="size-4 text-foreground animate-spin" />
    }
    return <GlobeIcon className="size-4 text-foreground" />
}

export const ProjectCommandDialog = ({
    open,
    onOpenChange,
}: ProjectsCommandDialogProps) => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const projects = useProjects(!session);

    const handleSelect =(projectId:string)=>{
        onOpenChange(false);
        router.push(`/projects/${projectId}`);
    }
    return (
       <CommandDialog open={open} onOpenChange={onOpenChange}
       title="Search Projects" description ="Search and navigate to your projects"
       >
        <CommandInput placeholder="Search projects..." />
        <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup heading="Recent Projects">
                {projects?.map((project)=>(
                    <CommandItem 
                    key={project._id} 
                    value={project._id} 
                    onSelect={()=>handleSelect(project._id)}>
                        {getProjectIcon(project)}
                        {project.name}   
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
       </CommandDialog>
    )
}