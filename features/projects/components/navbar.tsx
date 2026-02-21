"use client "

import { Id } from "@/convex/_generated/dataModel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useProject, userenameProjct } from "../hooks/use-project";
import { useState } from "react";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})
export const Navbar=({projectId}:{projectId:Id<"projects">})=>{
    const project = useProject(projectId);
    const renameProject = userenameProjct(projectId);

    const [isRename,setIsRenaming] = useState(false);
    const [name,setName] = useState("");

    const handleStartRename= ()=>{
        if(!project) return ;
        setName(project.name);
        setIsRenaming(true);
    }

    const handleFinishRename = () => {
        if (!project) return;
        setIsRenaming(false);

        const trimmedName = name.trim();
        if (!trimmedName || trimmedName === project.name) return;

        renameProject({ id: projectId, name: trimmedName });
    };

    


    return (
        <nav className="flex  justify-between p-2 items-center gap-x-2 bg-sidebar border-b">
            <div className="flex items-center gap-x-2">
                <Breadcrumb>
                    <BreadcrumbList className="gap-1.5">
                    <BreadcrumbItem>
                        <BreadcrumbLink 
                        className="flex items-center gap-1.5"
                        asChild
                        >
                        <Button
                        variant="outline"
                        className="w-fit! p-1.5! h-7"
                        asChild
                        >
                            <Link
                            href="/"
                            >
                                <Image
                                src="/logo.svg"
                                alt="Daksha-ide"
                                width={20}
                                height={20}
                                />
                                    <span className={cn("text-sm font-medium", poppins.className)}>
                                        Daksha
                                    </span>
                                
                            </Link>
                        </Button>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator  className="ml-0! mr-1"/>
                    <BreadcrumbItem>
                    {isRename ? (
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={(e) => e.currentTarget.select()}
                            onBlur={handleFinishRename}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleFinishRename();
                                if (e.key === "Escape") setIsRenaming(false);
                            }}
                            className="text-sm bg-transparent text-foreground outline-none
                                focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-40 truncate"
                            type="text"
                        />
                    ) : (
                        <BreadcrumbPage
                            onClick={handleStartRename}
                            className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
                        >
                            {project?.name || "Loading .."}
                        </BreadcrumbPage>
                    )}
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {project?.importStatus === "importing" ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
                        </TooltipTrigger>
                        <TooltipContent>Importing ... </TooltipContent>
                    </Tooltip>
                ) : (
                    project?.updatedAt && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CloudCheckIcon className="size-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                Saved{" "}
                                {formatDistanceToNow(
                                    project.updatedAt,
                                    { addSuffix: true }
                                )}
                            </TooltipContent>
                        </Tooltip>
                    )
                )}
            </div>
            <div className="flex items-center gap-2">
                {/* implement user button for logout */}
            </div>
        </nav>
    )
}