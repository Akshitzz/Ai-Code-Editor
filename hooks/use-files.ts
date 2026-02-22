import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

export const useCreateFile = () => {
    return useMutation(api.files.createFile).withOptimisticUpdate(
        (localStore, args) => {
            const { projectId, parentId, name, content } = args;
            const existing = localStore.getQuery(api.files.getFolderContent, {
                projectId,
                parentId,
            });
            if (existing !== undefined) {
                const now = Date.now();
                const tempFile = {
                    _id: crypto.randomUUID() as Id<"files">,
                    _creationTime: now,
                    projectId,
                    parentId,
                    name,
                    content: content ?? "",
                    type: "file" as const,
                    updatedAt: now,
                };
                const sorted = [...existing, tempFile].sort((a, b) => {
                    if (a.type === "folder" && b.type === "file") return -1;
                    if (b.type === "file" && a.type === "folder") return 1;
                    return a.name.localeCompare(b.name);
                });
                localStore.setQuery(api.files.getFolderContent, { projectId, parentId }, sorted);
            }
        }
    );
};

export const useCreateFolder = () => {
    return useMutation(api.files.createFolder).withOptimisticUpdate(
        (localStore, args) => {
            const { projectId, parentId, name } = args;
            const existing = localStore.getQuery(api.files.getFolderContent, {
                projectId,
                parentId,
            });
            if (existing !== undefined) {
                const now = Date.now();
                const tempFolder = {
                    _id: crypto.randomUUID() as Id<"files">,
                    _creationTime: now,
                    projectId,
                    parentId,
                    name,
                    type: "folder" as const,
                    updatedAt: now,
                };
                const sorted = [...existing, tempFolder].sort((a, b) => {
                    if (a.type === "folder" && b.type === "file") return -1;
                    if (b.type === "file" && a.type === "folder") return 1;
                    return a.name.localeCompare(b.name);
                });
                localStore.setQuery(api.files.getFolderContent, { projectId, parentId }, sorted);
            }
        }
    );
};

export const useFolderContents = ({
    projectId,
    parentId,
    enabled = true,
}: {
    projectId: Id<"projects">;
    parentId?: Id<"files">;
    enabled?: boolean;
}) => {
    return useQuery(
        api.files.getFolderContent,
        enabled ? { projectId, parentId } : "skip"
    );
};

export const useRenameFile = () => {
    return useMutation(api.files.renameFile).withOptimisticUpdate(
        (localStore, args) => {
            const { id, newName } = args;
            const queries = localStore.getAllQueries(api.files.getFolderContent);
            for (const { args: qArgs, value } of queries) {
                if (value !== undefined) {
                    const idx = value.findIndex((f) => f._id === id);
                    if (idx >= 0) {
                        const updated = [...value];
                        updated[idx] = { ...updated[idx], name: newName };
                        localStore.setQuery(api.files.getFolderContent, qArgs, updated);
                        break;
                    }
                }
            }
        }
    );
};

export const useMoveFile = () => {
    return useMutation(api.files.moveFile).withOptimisticUpdate(
        (localStore, args) => {
            const { id, newParentId } = args;
            const queries = localStore.getAllQueries(api.files.getFolderContent);
            let item: { _id: Id<"files">; projectId: Id<"projects">; parentId?: Id<"files">; name: string; type: "file" | "folder"; content?: string; updatedAt: number; _creationTime: number } | undefined;

            for (const { args: qArgs, value } of queries) {
                if (value !== undefined) {
                    const idx = value.findIndex((f) => f._id === id);
                    if (idx >= 0) {
                        item = value[idx];
                        const updated = value.filter((f) => f._id !== id);
                        localStore.setQuery(api.files.getFolderContent, qArgs, updated);
                        break;
                    }
                }
            }
            if (item) {
                const newItem = { ...item, parentId: newParentId, updatedAt: Date.now() };
                const targetExisting = localStore.getQuery(api.files.getFolderContent, {
                    projectId: item.projectId,
                    parentId: newParentId,
                });
                if (targetExisting !== undefined) {
                    const sorted = [...targetExisting, newItem].sort((a, b) => {
                        if (a.type === "folder" && b.type === "file") return -1;
                        if (b.type === "file" && a.type === "folder") return 1;
                        return a.name.localeCompare(b.name);
                    });
                    localStore.setQuery(
                        api.files.getFolderContent,
                        { projectId: item.projectId, parentId: newParentId },
                        sorted
                    );
                }
            }
        }
    );
};

export const useDeleteFile = () => {
    return useMutation(api.files.deleteFile).withOptimisticUpdate(
        (localStore, args) => {
            const { id } = args;
            const queries = localStore.getAllQueries(api.files.getFolderContent);
            for (const { args: qArgs, value } of queries) {
                if (value !== undefined) {
                    const idx = value.findIndex((f) => f._id === id);
                    if (idx >= 0) {
                        const updated = value.filter((f) => f._id !== id);
                        localStore.setQuery(api.files.getFolderContent, qArgs, updated);
                        break;
                    }
                }
            }
            // Clear children view if this was a folder (its getFolderContent would show stale data)
            const childQueries = localStore.getAllQueries(api.files.getFolderContent);
            for (const { args: qArgs, value } of childQueries) {
                if (qArgs.parentId === id && value !== undefined) {
                    localStore.setQuery(api.files.getFolderContent, qArgs, []);
                }
            }
        }
    );
};
