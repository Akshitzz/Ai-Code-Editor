"use client"

import { Authenticated, AuthLoading } from "convex/react";
import { Navbar } from "./navbar";
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/ui/spinner";
import {Allotment} from "allotment"
import "allotment/dist/style.css"

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH =800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH =400;
const DEFAULT_MAIN_SIZE = 1000;


export const ProjectIdLayout = ({
    children,
    projectId,
}: {
    children: React.ReactNode;
    projectId: Id<"projects">;
}) => {
    return (
        <div className="w-full h-screen flex flex-col">
            <AuthLoading>
                <nav className="flex justify-between p-2 items-center gap-x-2 bg-sidebar border-b">
                    <Spinner className="size-4 text-muted-foreground" />
                </nav>
            </AuthLoading>
            <Authenticated>
               <div className="w-full h-screen flex flex-col">
                <Navbar projectId={projectId} />
                    <Allotment
                    className="flex-1"
                    defaultSizes={[
                        DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
                        DEFAULT_MAIN_SIZE
                    ]}
                    >
                        <Allotment.Pane
                        snap
                        minSize={MIN_SIDEBAR_WIDTH}
                        maxSize={MAX_SIDEBAR_WIDTH}
                        preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}

                        >
                            <div>Conversational Sidebar</div>   
                        </Allotment.Pane>
                        <Allotment.Pane>
                            {children}

                        </Allotment.Pane>
                    </Allotment>
               </div>
            </Authenticated>
        </div>
    );
};