import { CursorProps } from "@/types/type";
import CursorSVG from "../../../public/assets/CursorSVG";

export default function Cursor ({color, x, y ,message} : CursorProps) {

    return (
        <>
            <div className="pointer-events-none absolute top-0 left-0" style={{transform : `translateX(${x}px) translateY(${y}px)`}}>
                <CursorSVG color={color} />
            </div>
        </>
    )
}