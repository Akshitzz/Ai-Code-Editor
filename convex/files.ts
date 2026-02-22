import {v} from "convex/values"
import {mutation ,query} from "./_generated/server"
import { verifyAuth } from "./auth";
import type { Doc, Id } from "./_generated/dataModel";


export const getFiles = query({
    args: {projectId : v.id("projects")},
    handler:async(ctx,args)=>{

        const identity = await verifyAuth(ctx);

        const project = await ctx.db.get("projects",args.projectId);

        if(!project){
            throw new Error("Project not found ")
        }

        if(project.ownerId!== identity.subject){
            throw new Error("Unauthorized to access this project")
        }

        return await ctx.db
        .query("files")
        .withIndex("by_project",(q)=>q.eq("projectId",args.projectId))
        .order("desc")
        .collect()
    }
})

export const getFile = query({
    args: {projectId : v.id("files")},
    handler:async(ctx,args)=>{

        const identity = await verifyAuth(ctx);

        const file = await ctx.db.get("files",args.projectId);

        if(!file){
            throw new Error("File not found")
        }
        const project = await ctx.db.get("projects",file.projectId)
        if(!project){
            throw new Error("Project not found ")
        }

        if(project.ownerId!== identity.subject){
            throw new Error("Unauthorized to access this project")
        }

        return file;
    }
})


export const getFolderContent = query({
    args: {
        projectId : v.id("projects"),
        parentId : v.optional(v.id("files"))
    },

    handler:async(ctx,args)=>{

        const identity = await verifyAuth(ctx);

        const project = await ctx.db.get("projects",args.projectId);

        if(!project){
            throw new Error("Project not found ")
        }

        if(project.ownerId!== identity.subject){
            throw new Error("Unauthorized to access this project")
        }

        const files = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) => q
                .eq("projectId", args.projectId)
                .eq("parentId", args.parentId)
            )
            .collect();

            // sort :foldersfirs ,then files .aplhabeticalls order
            return files.sort((a,b)=>{
                //folder come before file
                if(a.type == "folder" && b.type == "file") return -1;
                if(b.type === "file" && a.type === "folder") return 1;
                // wtihin same type .sort alphabetically 
                return a.name.localeCompare(b.name);
            })
    }
})


export const createFile = mutation({
    args :{
        projectId :v.id("projects"),
        parentId :v.optional(v.id("files")),
        name: v.string(),
        content:v.string(),
    },
    handler: async(ctx,args)=>{
        const identity = await verifyAuth(ctx);

        const project = await ctx.db.get("projects",args.projectId)

        if(!project){
            throw new Error("Project not found")
        }

        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorzied to access this project")
        }
        //checking if same files exist within same folder or not 
        const files = await ctx.db.query("files")
        .withIndex("by_project_parent",(q)=>q.eq("projectId",args.projectId)
        .eq("parentId",args.parentId)
        ).collect();

        const existing = files.find(
            (file)=>file.name == args.name && file.type === "file"
        );

        if(existing) throw new Error("file already exists")

            await ctx.db.insert("files",{
                projectId: args.projectId,
                name:args.name,
                content:args.content,
                type : "file",
                parentId :args.parentId,
                updatedAt :Date.now()
            })
            await ctx.db.patch("projects",args.projectId,{
                updatedAt:Date.now()
            })

    }
})


export const createFolder = mutation({
    args :{
        projectId :v.id("projects"),
        parentId :v.optional(v.id("files")),
        name: v.string(),
    },
    handler: async(ctx,args)=>{
        const identity = await verifyAuth(ctx);

        const project = await ctx.db.get("projects",args.projectId)

        if(!project){
            throw new Error("Project not found")
        }

        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorzied to access this project")
        }
        //checking if same folder exist within same folder or not 
        const files = await ctx.db.query("files")
        .withIndex("by_project_parent",(q)=>q.eq("projectId",args.projectId)
        .eq("parentId",args.parentId)
        ).collect();

        const existing = files.find(
            (file)=>file.name == args.name && file.type === "folder"
        );

        if(existing) throw new Error("folder already exists")

            await ctx.db.insert("files",{
                projectId: args.projectId,
                name:args.name,
                type : "folder",
                parentId :args.parentId,
                updatedAt :Date.now()
            })
            await ctx.db.patch("projects",args.projectId,{
                updatedAt:Date.now()
            })

    }
})

export const renameFile  = mutation({
    args:{
        id:v.id("files"),
        newName :v.string(),
    },
    handler:async(ctx,args)=>{
        const identity = await verifyAuth(ctx);
        const file  = await ctx.db.get("files",args.id);

        if(!file) throw new Error("file not found");

        const project = await ctx.db.get("projects",file.projectId)

        if(!project){
            throw new Error("Project not found");
        }
        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorzied to access this project")
        }
        // checking if a file with new mane already exists in the same project or not 
        const siblings = await ctx.db.query("files")
        .withIndex("by_project_parent",(q)=>
        q
        .eq("projectId",file.projectId)
        .eq("parentId",file.parentId)
        )
        .collect();

        const existing = siblings.find(
            (siblings)=>
                siblings.name === args.newName &&
            siblings.type === file.type &&
            siblings._id !== args.id
        );
        if(existing){
            throw new Error(` A ${file} with name aready exists in this location`)
        }
        // updating the file name 

        await ctx.db.patch("files",args.id,{
            name :args.newName,
            updatedAt :Date.now(),
        })
        await ctx.db.patch("projects",file.projectId,{
            updatedAt:Date.now()
        })
    },
})

export const deleteFile  = mutation({
    args:{
        id:v.id("files"),
    },
    handler:async(ctx,args)=>{
        const identity  = await verifyAuth(ctx);
        const file  = await ctx.db.get("files",args.id);
        if(!file) throw new Error("file not found");

        const project = await ctx.db.get("projects",file.projectId)

        if(!project){
            throw new Error("Project not found");
        }
        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorzied to access this project")
        }
        //recursivly delete file/folder 
        const deleteRecursive = async (fileID :Id<"files">)=>{
            const item = await ctx.db.get("files",fileID);

            if(!item){
                return ;
            }
            // if its a folder delete all files
            if(item.type === "folder"){
                const children = await ctx.db.query("files")
                .withIndex("by_project_parent",(q)=>
                q
                .eq("projectId",file.projectId)
                .eq("parentId",fileID)
                )
                .collect();

                for(const child of children){
                    await deleteRecursive(child._id)
                }
            }
            //delete storage file if it exists
            await ctx.db.delete("files",fileID);

        }
        await deleteRecursive(args.id);
        await ctx.db.patch("projects",file.projectId,{
            updatedAt:Date.now()
        })
    }
})

export const moveFile = mutation({
    args: {
        id: v.id("files"),
        newParentId: v.optional(v.id("files")),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const file = await ctx.db.get("files", args.id);
        if (!file) throw new Error("file not found");

        const project = await ctx.db.get("projects", file.projectId);
        if (!project) throw new Error("Project not found");
        if (project.ownerId !== identity.subject) {
            throw new Error("Unauthorized to access this project");
        }

        const newParentId = args.newParentId;

        // Cannot move to self
        if (newParentId === args.id) {
            throw new Error("Cannot move a folder into itself");
        }

        // If moving to a folder, ensure target is not a descendant (prevent cycles)
        if (newParentId && file.type === "folder") {
            let currentId: Id<"files"> | undefined = newParentId;
            while (currentId) {
                if (currentId === args.id) {
                    throw new Error("Cannot move a folder into its own subfolder");
                }
                const currentFile: Doc<"files"> | null = await ctx.db.get("files", currentId);
                currentId = currentFile?.parentId;
            }
        }

        // Check for name conflict in target
        const siblings = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) =>
                q.eq("projectId", file.projectId).eq("parentId", newParentId)
            )
            .collect();
        const existing = siblings.find(
            (s) => s.name === file.name && s.type === file.type
        );
        if (existing && existing._id !== args.id) {
            throw new Error(`A ${file.type} with name "${file.name}" already exists in this location`);
        }

        await ctx.db.patch("files", args.id, {
            parentId: newParentId,
            updatedAt: Date.now(),
        });
        await ctx.db.patch("projects", file.projectId, {
            updatedAt: Date.now(),
        });
    },
});

export const updateFile = mutation({
    args:{
        id:v.id("files"),
        content :v.string()
    },
    handler:async(ctx,args)=>{
        const identity  = await verifyAuth(ctx);
        const file  = await ctx.db.get("files",args.id);
        if(!file) throw new Error("file not found");

        const project = await ctx.db.get("projects",file.projectId)

        if(!project){
            throw new Error("Project not found");
        }
        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorzied to access this project")
        }
        const now =Date.now();
        await ctx.db.patch("files",args.id,{
            content:args.content,
            updatedAt:now
        })
        await ctx.db.patch("projects",file.projectId,{
            updatedAt:now
        })
    }
})