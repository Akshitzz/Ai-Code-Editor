import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export const useProject = (projectId:Id<"projects">,skip?: boolean)=>{
        return useQuery(api.project.getProjectsById,
            skip ? "skip" : {id:projectId}
        )
}


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

export const userenameProjct =(projectId:Id<"projects">)=>{
    return useMutation(api.project.renameProjct).withOptimisticUpdate(
        (localStore,args)=>{
            const existingProject = localStore.getQuery(
                api.project.getProjectsById,
                {id:projectId}
            );
            if(existingProject!== undefined && existingProject!== null){
                localStore.setQuery(
                    api.project.getProjectsById,
                    {id:projectId},
                    {
                        ...existingProject,
                        name:args.name,
                        updatedAt : Date.now()
                    }
                )
            }

            const existingProjects = localStore.getQuery(api.project.getProjects);
            if(existingProjects!== undefined){
                localStore.setQuery(
                    api.project.getProjects,
                    {},
                    existingProjects.map((project)=>{
                        return project._id ===args.id ?{...project,
                            name:args.name,
                            updatedAt:Date.now()}
                            :project
                    })
                )
            }
        }
    )
}