"use client" 

import { useOthers } from "../../liveblocks.config"

export default function CollaborativeApp() {
    const others = useOthers() ; 
    const userCount = others.length
    
    return (
        <>
            There are {userCount} others users actually online 
        </>
    )
}