import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";

export const create = mutation({
    args: {
        name: v.string(),

    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);

        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            ownerId: identity.subject,
            updatedAt: Date.now(),
        })

        return projectId;
    }
})

export const getProjectsPartial = query({
    args: {
        limit: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .order("desc")
            .take(args.limit)
    }
})

export const getProjects = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx)

        return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .collect()
    }
})

export const createProject = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);

        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            ownerId: identity.subject,
            updatedAt: Date.now(),
        })
        return projectId;
    }
})

export const getProjectsById = query({
    args:{
        id:v.id("projects")
    },handler:async (ctx,args)=>{
        const identity = await verifyAuth(ctx);
        const projects = await ctx.db.get("projects",args.id);

        if(!projects){
            throw new Error("Project not found");
        }
        if(!identity){
            throw new Error("Project not found")
        }
        
        if(projects.ownerId!== identity.subject){
            throw new Error("UnAuthorized Access to this Project")
        }
        return projects;
    }
})

export const renameProjct = mutation({
    args:{
        id:v.id("projects"),
        name:v.string()
    },handler:async (ctx,args)=>{
        const identity = await verifyAuth(ctx);
        const projects = await ctx.db.get("projects",args.id);

        if(!projects){
            throw new Error("Project not found");
        }
        if(!identity){
            throw new Error("Project not found")
        }
        
        if(projects.ownerId!== identity.subject){
            throw new Error("UnAuthorized Access to this Project")
        }
      await ctx.db.patch("projects",args.id,{
        name:args.name,
        updatedAt:Date.now()
      })
    }
})