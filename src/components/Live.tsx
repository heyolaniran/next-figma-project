"use client"
import { useCallback, useState } from "react";
import { useMyPresence, useOthers } from "../../liveblocks.config"
import LiveCursors from "./cursor/LiveCursors"
import { CursorMode } from "@/types/type";
import CursorChat from "./cursor/CursorChat";
export default function Live() {

    const others = useOthers(); 

    const [{cursor}, updateMyPresence] = useMyPresence() as any ; 

    const [cursorState , setCursorState] = useState({ mode: CursorMode.Hidden })

    const handlePointerMove = useCallback((event : React.PointerEvent) => {
        event.preventDefault() ; 

        // Substract current width of cursor from the relative position on windows

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x

        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor :  {x, y}})
    }, [])

    const handlePointerDown = useCallback((event : React.PointerEvent) => {
        // Substract current width of cursor from the relative position on windows

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x

        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor :  {x, y}})
    }, [])

    const handlePointerLeave = useCallback((event : React.PointerEvent) => {
        
        setCursorState({
            mode: CursorMode.Hidden
        })

        updateMyPresence({cursor : null, message: null})
    }, [])

    return (
        <div 
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        className="min-h-screen w-full flex justify-center items-center text-center"
        >
            <h3 className="text-4xl"> Minimalist Figma  </h3> 
            <LiveCursors others={others} />

            {
                cursor && (
                     <CursorChat cursor={cursor} 
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence} />
                )
            }
           
        </div>
    )
}