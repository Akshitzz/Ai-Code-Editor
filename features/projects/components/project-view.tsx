"use client"
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa"
import { ProjectList } from "./project-list";
import { useCreateProject } from "../hooks/use-project";
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator
} from "unique-names-generator"
import { Kbd } from "@/components/ui/kbd";
import { useState } from "react";
import { ProjectCommandDialog } from "./project-command-dialog";
import { useEffect } from "react";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],

})

export const ProjectView = () => {

    const createProject = useCreateProject();

    const [open, setOpen] = useState(false);


    useEffect(()=>{
        const handleKeyDown =(e:KeyboardEvent)=>{
            if(e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setOpen(true);
            }
        }
        document.addEventListener("keydown",handleKeyDown);
        return ()=>{
            document.removeEventListener("keydown",handleKeyDown);
        }
    },[])



    return (
       <>
       <ProjectCommandDialog open={open} onOpenChange={setOpen} />
        <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16 w-full">
<div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
    <div className="flex justify-between gap-4 w-full items-center ">


        <div className=" flex items-center gap-2 w-full group/logo">
            <Image src="/logo.svg" alt="Daksha-ide" width={24} height={24}
                className="size-[32px] md:size:[46px]"
            />
            <h1 className={cn("text-4xl md:text-5xl font-semibold", poppins.className)}>
                Daksha
            </h1>
        </div>
    </div>

    <div className="flex flex-col gap-4 w-full">
        <div className=" grid grid-cols-2 gap-2">
            <Button
                variant="outline"
                onClick={() => {
                    const projectName = uniqueNamesGenerator({
                        dictionaries: [adjectives, animals, colors],
                        separator: "-",
                        length: 2,
                    })
                    createProject({
                        name: projectName
                    })
                }}
                className=" h-full items-start justify-start p-4 bg-background-color border flex flex-col gap-6 rounded-none"
            >
                <div className="flex items-center justify-between w-full">
                    <SparkleIcon className="size-4" />
                    <Kbd className="bg-accent border">
                        Ctrl+J
                    </Kbd>
                </div>
                <div>
                    <span className="text-sm">
                        New Project
                    </span>
                </div>
            </Button>
            <Button
                variant="outline"
                onClick={() => { }}
                className=" h-full items-start justify-start p-4 bg-background-color border flex flex-col gap-6 rounded-none"
            >
                <div className="flex items-center justify-between w-full">
                    <FaGithub className="size-4" />
                    <Kbd className="bg-accent border">
                        Ctrl+K
                    </Kbd>
                </div>
                <div>
                    <span className="text-sm">
                        Import
                    </span>
                </div>
            </Button>
        </div>
        <ProjectList onViewAll={() => setOpen(true)} />
    </div>
</div>
</div>
       </>

    )
};

