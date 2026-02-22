import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import { ChevronRightIcon, CopyMinusIcon, FilePlusCornerIcon, FilePlusIcon, FolderPlusIcon } from "lucide-react"
import { useState } from "react"
import { Id } from "@/convex/_generated/dataModel";
import { useProject } from "../projects/hooks/use-project";
import { Button } from "@/components/ui/button";
import { useCreateFile, useCreateFolder, useFolderContents, useMoveFile } from "@/hooks/use-files";
import { CreateInput } from "./create-input";
import { getItemPadding } from "./constants";
import { LoadingRow } from "./loading-row";
import { Tree } from "./tree";
export const FileExplorer = (
    {projectId}:{
        projectId  : Id<"projects">
    }
)=>{ 
    const [collapsekey,setcollapsekey] = useState(0);
    const [isopen,setisopen] = useState(false);
    const [creating,setiscreating] = useState<"file"|"folder" |null>(null);
    
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();
    const moveFile = useMoveFile();
    const rootFiles = useFolderContents({
        projectId,
        enabled :isopen
    })

    const handleCreate=(name:string)=>{
        setiscreating(null);
        if(creating === "file"){
            createFile({
                name,
                projectId,
                content:"",
                parentId:undefined
            });
        }else{
            createFolder({
                projectId,
                name,
                parentId:undefined,
            })
        }

    }

    const project = useProject(projectId);
    const [isRootDragOver, setIsRootDragOver] = useState(false);
    const DRAG_TYPE = "application/x-daksha-file";

    const handleRootDragOver = (e: React.DragEvent) => {
        const draggedId = e.dataTransfer.getData(DRAG_TYPE);
        if (draggedId) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setIsRootDragOver(true);
        }
    };
    const handleRootDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsRootDragOver(false);
        }
    };
    const handleRootDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsRootDragOver(false);
        const draggedId = e.dataTransfer.getData(DRAG_TYPE) as Id<"files"> | "";
        if (draggedId) {
            moveFile({ id: draggedId, newParentId: undefined });
            setisopen(true);
        }
    };

    return (
        <div className="h-full bg-sidebar">
            <ScrollArea>  
                <div
                    role="button"
                    onClick={()=>setisopen((value)=>!value)}
                    onDragOver={handleRootDragOver}
                    onDragLeave={handleRootDragLeave}
                    onDrop={handleRootDrop}
                    className={cn(
                        "group/project cursor-pointer w-full text-left flex items-center gap-0.5 h-5.5 bg-accent font-bold",
                        isRootDragOver && "ring-1 ring-inset ring-ring"
                    )}
                >
                        <ChevronRightIcon
                        className={cn("size-4 shrink-0 text-muted-foreground ",
                            isopen && "rotate-90"
                        )}
                        />
                        <p className="text-xs uppercase line-clmap-1">
                            {project?.name ?? "Loading.."}
                        </p>
                        <div className=" opacity-0 group-hover/project:opacity-100
                        transition-none duration-0 flex items-center gap-0.5 ml-auto
                        ">
                            <Button
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setisopen(true);
                                    setiscreating("file")
                                }}
                                variant="highlight"
                                size="icon-xs"
                            >
                                <FilePlusCornerIcon className="size-3.5"/>
                            </Button>
                            <Button
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setisopen(true);
                                    setiscreating("folder")
                                }}
                                variant="highlight"
                                size="icon-xs"
                            >
                                <FolderPlusIcon className="size-3.5"/>
                            </Button>
                            <Button
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setcollapsekey((prev)=>prev +1)
                                    setisopen(false);
                                }}
                                variant="highlight"
                                size="icon-xs"
                            >
                                <CopyMinusIcon className="size-3.5"/>
                            </Button>
                        </div>
                </div>
                {isopen && (
                    <>
                        {rootFiles === undefined && <LoadingRow level={0}/>}
                        {creating && (
                            <div style={{ paddingLeft: getItemPadding(0, creating === "file") }}>
                                <CreateInput
                                    type={creating}
                                    level={0}
                                    onSubmit={handleCreate}
                                    onCancel={()=>setiscreating(null)}
                                />
                            </div>
                        )}
                        {rootFiles?.map((item)=>(
                            <Tree
                                key={`${item._id}-${collapsekey}`}
                                item={item}
                                level={0}
                                projectId={projectId}
                                collapseKey={collapsekey}
                            />
                        ))}
                    </>
                )}
            </ScrollArea>
        </div>
    )
}