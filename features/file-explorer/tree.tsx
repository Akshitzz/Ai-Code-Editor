import { Doc, Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

import { getItemPadding } from "./constants";
import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";
import { TreeItemWrapper } from "./tree-item-wrapper";

import {
    useCreateFile,
    useCreateFolder,
    useFolderContents,
    useRenameFile,
    useDeleteFile,
    useMoveFile,
} from "@/hooks/use-files";

export const Tree = ({
    item,
    level = 0,
    projectId,
    collapseKey = 0,
    ancestorIds = [],
}: {
    item: Doc<"files">;
    level?: number;
    projectId: Id<"projects">;
    collapseKey?: number;
    ancestorIds?: Id<"files">[];
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);

    const renameFile = useRenameFile();
    const deleteFile = useDeleteFile();
    const moveFile = useMoveFile();
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();

    const folderContents = useFolderContents({
        projectId,
        parentId: item._id,
        enabled: item.type === "folder" && isOpen,
    });

    const isFolder = item.type === "folder";

    const handleRename = () => {
        setIsRenaming(true);
    };

    const handleRenameSubmit = (newName: string) => {
        renameFile({ id: item._id, newName });
        setIsRenaming(false);
    };

    const handleDelete = () => {
        deleteFile({ id: item._id });
    };

    const handleCreateFile = () => {
        setCreating("file");
        setIsOpen(true);
    };

    const handleCreateFolder = () => {
        setCreating("folder");
        setIsOpen(true);
    };

    const handleCreate = (name: string) => {
        setCreating(null);
        if (creating === "file") {
            createFile({
                name,
                projectId,
                content: "",
                parentId: item._id,
            });
        } else {
            createFolder({
                projectId,
                name,
                parentId: item._id,
            });
        }
    };

    const handleClick = () => {
        if (isFolder) {
            setIsOpen((prev) => !prev);
        }
    };

    const handleMove = (id: Id<"files">, newParentId: Id<"files"> | undefined) => {
        moveFile({ id, newParentId });
    };

    return (
        <div className="w-full">
            {isRenaming ? (
                <div style={{ paddingLeft: getItemPadding(level, item.type === "file") }}>
                    <CreateInput
                        type={item.type === "file" ? "file" : "folder"}
                        level={level}
                        initialValue={item.name}
                        selectFilenameOnly={item.type === "file"}
                        onSubmit={handleRenameSubmit}
                        onCancel={() => setIsRenaming(false)}
                    />
                </div>
            ) : (
                <TreeItemWrapper
                    item={item}
                    level={level}
                    isActive={false}
                    isOpen={isOpen}
                    onClick={handleClick}
                    onDoubleClick={handleRename}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onCreateFile={handleCreateFile}
                    onCreateFolder={handleCreateFolder}
                    onMove={handleMove}
                    ancestorIds={ancestorIds}
                />
            )}
            {isFolder && isOpen && (
                <div className="w-full">
                    {folderContents === undefined && <LoadingRow level={level + 1} />}
                    {creating && (
                        <div style={{ paddingLeft: getItemPadding(level + 1, creating === "file") }}>
                            <CreateInput
                                type={creating}
                                level={level + 1}
                                onSubmit={handleCreate}
                                onCancel={() => setCreating(null)}
                            />
                        </div>
                    )}
                    {folderContents?.map((child) => (
                        <Tree
                            key={`${child._id}-${collapseKey}`}
                            item={child}
                            level={level + 1}
                            projectId={projectId}
                            collapseKey={collapseKey}
                            ancestorIds={isFolder ? [...ancestorIds, item._id] : ancestorIds}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
