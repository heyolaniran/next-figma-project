
import { useCallback } from "react";
import { useMyPresence, useOthers } from "../../liveblocks.config"
import LiveCursors from "./cursor/LiveCursors"
export default function Live() {

    const others = useOthers(); 

    const [{cursor}, updateMyPresence] = useMyPresence() as any ; 

    const handlePointerMove = useCallback((event : React.PointerEvent) => {
        event.preventDefault() ; 

        // Substract current width of cursor from the relative position on windows

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x

        const y = event.clientY - event.currentTarget.getBoundingClientRect().y
    }, [])

    return (
        <>
         <LiveCursors others={others} />
        </>
    )
}