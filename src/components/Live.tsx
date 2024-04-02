"use client"
import { useCallback, useEffect, useState } from "react";
import { useMyPresence, useOthers } from "../../liveblocks.config"
import LiveCursors from "./cursor/LiveCursors"
import { CursorMode, CursorState, Reaction } from "@/types/type";
import CursorChat from "./cursor/CursorChat";
import ReactionSelector from "./reaction/ReactionButton";
export default function Live() {

    const others = useOthers(); 

    const [{cursor}, updateMyPresence] = useMyPresence() as any ; 

    const [cursorState , setCursorState] = useState<CursorState>({ mode: CursorMode.Hidden })

    const [reactions, setReaction] = useState<Reaction[]>([])

    const handlePointerMove = useCallback((event : React.PointerEvent) => {
        event.preventDefault() ; 

        if(cursor == null || cursorState.mode !== CursorMode.ReactionSelector)
        {

            // Substract current width of cursor from the relative position on windows
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x

            const y = event.clientY - event.currentTarget.getBoundingClientRect().y

            updateMyPresence({cursor :  {x, y}})
        }

        
    }, [])

    const handlePointerDown = useCallback((event : React.PointerEvent) => {
        // Substract current width of cursor from the relative position on windows

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x

        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor :  {x, y}})

        setCursorState((state: CursorState) => cursorState.mode === CursorMode.ReactionSelector ? 
         {...state, isPressed: true} : state )
    }, [cursorState.mode, setCursorState])

    const handlePointerUp= useCallback((event: React.PointerEvent) => {
        setCursorState((state: CursorState) => cursorState.mode === CursorMode.ReactionSelector ? 
        {...state, isPressed: true} : state )
    }, [cursorState.mode , setCursorState])

    const handlePointerLeave = useCallback((event : React.PointerEvent) => {
        
        setCursorState({
            mode: CursorMode.Hidden
        })

        updateMyPresence({cursor : null, message: null})
    }, [])


    // track Cursor Chat mode
    
    useEffect(() => {
        const onKeyUp =  (e : KeyboardEvent) => {
            if(e.key === "/") {
                console.log('test')
                setCursorState({
                    mode : CursorMode.Chat, 
                    previousMessage : null , 
                    message : ''
                })
            } else if (e.key === "Escape") {

                updateMyPresence({message : ''}) ;
                setCursorState({mode : CursorMode.Hidden})
            }else if (e.key === 'e') {
                setCursorState({
                    mode: CursorMode.ReactionSelector,

                })
            }
        }

        const onKeyDown =  (e: KeyboardEvent) => {
            if(e.key === "/") {
                e.preventDefault()
            }
        }

        window.addEventListener('keyup', onKeyUp)

        window.addEventListener('keydown', onKeyDown)

        return () => {
            removeEventListener('keyup', onKeyUp)
            removeEventListener('keydown', onKeyDown)   
        }

    }, [updateMyPresence])


    const setReactions = useCallback((reaction: string) => {
        setCursorState({
            mode : CursorMode.Reaction, reaction , isPressed : false
        })
    }, [])

    return (
        <div 
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="min-h-screen w-full flex justify-center items-center text-center"
        >
            <h3 className="text-4xl"> Minimalist Figma  </h3> 
            <LiveCursors others={others} />
            {/** track and display chat mode  */}
            {
                cursor && (
                     <CursorChat cursor={cursor} 
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence} />
                )
            }

              {/** track and display reaction selector mode  */}

            {
                cursorState.mode === CursorMode.ReactionSelector && (
                    <ReactionSelector setReaction={setReactions}/>
                )
            }
           
        </div>
    )
}