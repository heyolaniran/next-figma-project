"use client"
import { useCallback, useEffect, useState } from "react";
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "../../liveblocks.config"
import LiveCursors from "./cursor/LiveCursors"
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import CursorChat from "./cursor/CursorChat";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";
export default function Live() {

    const others = useOthers(); 

    const [{cursor}, updateMyPresence] = useMyPresence() as any ; 

    const [cursorState , setCursorState] = useState<CursorState>({ mode: CursorMode.Hidden })

    const [reactions, setReaction] = useState<Reaction[]>([])

    // broadcast event to the others users in room 

    const broadcast = useBroadcastEvent(); 

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

    

    // track and apply fly reaction effect 

    useInterval(() => {
        if(cursor && cursorState.mode === CursorMode.Reaction && cursorState.isPressed) {

            setReaction((reactions) => reactions.concat([
                {
                    point : {x: cursor.x , y: cursor.y}, 
                    value : cursorState.reaction, 
                    timestamp :  Date.now()
                }
            ]))

            broadcast({
                x : cursor.x, 
                y: cursor.y, 
                value : cursorState.reaction
            })
        }
    }, 100)



    // listening reaction event 

    useEventListener((eventData) => {

        const event = eventData.event as ReactionEvent; 

        setReaction((reactions) => reactions.concat([
            {
                point : {x: event.x , y: event.y}, 
                value : event.value, 
                timestamp :  Date.now()
            }
        ]))
    })

    // limit flying reaction duration 

    useInterval(() => {
        setReaction((reaction) => reaction.filter((react) => react.timestamp > Date.now() - 4000))
    }, 1000)

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
            }else if (e.key === '$') {
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

            {/** Flying reaction  */}

            {
                reactions.map((reaction) => (
                    <FlyingReaction 
                    key={reaction.timestamp.toString()}
                    x={reaction.point.x}
                    y={reaction.point.y}
                    timestamp={reaction.timestamp}
                    value={reaction.value}
                    />
                ))
            }

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