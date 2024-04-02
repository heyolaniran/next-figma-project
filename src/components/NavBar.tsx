"use client"
import Image from "next/image"
import { memo } from "react"

import ActiveUsers from "./users/ActiveUsers"

import { NavbarProps } from "@/types/type"


const NavBar = ({activeElement} : NavbarProps) => {
    return (
        <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">

            <Image src={'/assets/logo.svg'} alt="Fig Pic" width={58} height={20} />
            <ActiveUsers />

        </nav>
    )
}

export default memo(NavBar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement)