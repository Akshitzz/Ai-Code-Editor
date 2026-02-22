import { ChevronRightIcon, FilePlusIcon, FolderPlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";

import {
    ContextMenu,
    ContextMenuItem,
    ContextMenuContent,
    ContextMenuTrigger,
    ContextMenuShortcut,
    ContextMenuSeparator
} from "@/components/ui/context-menu"

import { getItemPadding } from "./constants";
import { Doc, Id } from "@/convex/_generated/dataModel";

const DRAG_TYPE = "application/x-daksha-file";

export const TreeItemWrapper = ({
    item,
    children,
    level,
    isActive,
    isOpen,
    onClick,
    onDoubleClick,
    onRename,
    onDelete,
    onCreateFile,
    onCreateFolder,
    onMove,
    ancestorIds = [],
}: {
    item: Doc<"files">;
    children?: React.ReactNode;
    level: number;
    isActive: boolean;
    isOpen?: boolean;
    onClick: () => void;
    onDoubleClick?: () => void;
    onRename: () => void;
    onDelete: () => void;
    onCreateFile: () => void;
    onCreateFolder: () => void;
    onMove?: (id: Id<"files">, newParentId: Id<"files"> | undefined) => void;
    ancestorIds?: Id<"files">[];
}) => {
    const isFolder = item.type === "folder";
    const paddingLeft = getItemPadding(level, !isFolder);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation();
        e.dataTransfer.setData(DRAG_TYPE, item._id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.name);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!onMove) return;
        const draggedId = e.dataTransfer.getData(DRAG_TYPE) as Id<"files"> | "";
        if (!draggedId) return;
        if (draggedId === item._id) return;
        if (ancestorIds.includes(draggedId as Id<"files">)) return;
        if (!isFolder) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedId = e.dataTransfer.getData(DRAG_TYPE) as Id<"files"> | "";
        if (!draggedId || !onMove) return;
        if (draggedId === item._id) return;
        if (ancestorIds.includes(draggedId)) return;
        if (!isFolder) return;
        onMove(draggedId as Id<"files">, item._id);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    role="button"
                    tabIndex={0}
                    draggable={!!onMove}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        onDoubleClick?.();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onClick();
                        }
                    }}
                    className={cn(
                        "group/item w-full flex items-center gap-0.5 h-5.5 cursor-pointer text-left",
                        "hover:bg-accent/50",
                        isActive && "bg-accent",
                        isDragOver && "ring-1 ring-inset ring-ring bg-accent/70"
                    )}
                    style={{ paddingLeft }}
                >
                    {isFolder ? (
                        <ChevronRightIcon
                            className={cn(
                                "size-4 shrink-0 text-muted-foreground transition-transform",
                                isOpen && "rotate-90"
                            )}
                        />
                    ) : (
                        <div className="size-4 shrink-0" />
                    )}
                    {isFolder ? (
                        <FolderIcon folderName={item.name} className="size-4 shrink-0" />
                    ) : (
                        <FileIcon fileName={item.name} autoAssign className="size-4 shrink-0" />
                    )}
                    <span className="text-sm truncate flex-1">{item.name}</span>
                    {children}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={onRename}>
                    <PencilIcon className="size-4" />
                    Rename
                    <ContextMenuShortcut>F2</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                {isFolder && (
                    <>
                        <ContextMenuItem onClick={onCreateFile}>
                            <FilePlusIcon className="size-4" />
                            New File
                        </ContextMenuItem>
                        <ContextMenuItem onClick={onCreateFolder}>
                            <FolderPlusIcon className="size-4" />
                            New Folder
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                    </>
                )}
                <ContextMenuItem
                    variant="destructive"
                    onClick={onDelete}
                >
                    <TrashIcon className="size-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
