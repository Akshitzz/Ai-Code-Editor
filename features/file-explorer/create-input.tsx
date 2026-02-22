import { ChevronRightIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";
import { useState, useRef, useEffect } from "react";


export const CreateInput =({
    type,
    level,
    onSubmit,
    onCancel,
    initialValue = "",
    selectFilenameOnly = false
}:{
    type:"file"|"folder",
    level:number,
    onSubmit:(name:string)=>void;
    onCancel:()=>void;
    initialValue?: string;
    /** When true (rename file), select only filename without extension */
    selectFilenameOnly?: boolean;
})=>{
    const [value,setValue] =useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialValue && inputRef.current) {
            if (selectFilenameOnly) {
                const lastDot = initialValue.lastIndexOf(".");
                const end = lastDot > 0 ? lastDot : initialValue.length;
                inputRef.current.setSelectionRange(0, end);
            } else {
                inputRef.current.select();
            }
        }
    }, [initialValue, selectFilenameOnly]);
    const handleSubmit =()=>{
        const trimmedValue = value.trim();
        if(trimmedValue){
            onSubmit(trimmedValue)
        }else{
            onCancel();
        }
    }
    return (
        <div className="w-full flex items-center gap-1 h-5.5 bg-accent/30">
            <div className="flex items-center gap-0.5">
                {type == "file" &&(
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground"/>
                )}
                {type ==="file"&& (
                    <FileIcon fileName={value} autoAssign className="size-4"/>
                )}
                {type ==="folder"&& (
                    <FolderIcon folderName={value} className="size-4"/>
                )}
            </div>
            <input 
            ref={inputRef}
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)} 
            className="flex-1 bg-transparent text-sm outline-none focus:ring-1 focus:ring-inset focus:ring-ring"
            onBlur={handleSubmit}
            onKeyDown={(e)=>{
                if(e.key === "Enter"){
                    handleSubmit();
                }
                if(e.key === "Escape"){
                    onCancel();
                }
            }}
            />
    </div>
    )
}