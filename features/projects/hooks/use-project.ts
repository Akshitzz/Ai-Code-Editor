import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const useProjects = (skip?: boolean) => {
    return useQuery(
        api.project.getProjects,
        skip ? "skip" : {}
    );
}


export const useProjectparital = (limit: number | "skip") => {
    return useQuery(
        api.project.getProjectsPartial,
        limit === "skip" ? "skip" : { limit }
    )
}


export const useCreateProject = () => {
    return useMutation(api.project.createProject).withOptimisticUpdate(
        (localStore,args)=>{
            const existingProjects = localStore.getQuery(api.project.getProjects);

            if(existingProjects!== undefined){
                const now = Date.now();

                const newProject = {
                    _id: crypto.randomUUID() as Id<"projects">,
                    _creationTime: now,
                    name: args.name,
                    ownerId: "anonymous",
                    updatedAt: now,
                };

                localStore.setQuery(api.project.getProjects,{},
                    [...existingProjects,newProject]
                )

            }
        }
    );
}