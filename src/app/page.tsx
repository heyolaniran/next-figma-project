"use client"
import LeftSideBar from "@/components/LeftSideBar";
import Live from "@/components/Live";
import NavBar from "@/components/NavBar";
import RightSideBar from "@/components/RightSideBar";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "@/lib/canvas";
import {fabric} from "fabric"
import { useEffect, useRef } from "react";



export default function page () {

  const canvasRef = useRef<HTMLCanvasElement>(null); 
  const fabricRef = useRef<fabric.Canvas | null>(null); 
  const isDrawing = useRef(false); 
  const shapeRef = useRef<fabric.Object | null>(null); 

  const selectedShapeRef = useRef<string|null>(null); 

  useEffect(() => {

    const instance = initializeFabric({canvasRef, fabricRef})
  }, [])

  {/*

  

  useEffect(() => {

    // iniliaze canvas Element 

    const canvas = initializeFabric({ canvasRef , fabricRef})

    canvas.on('mouse:down', (options) => {

        handleCanvasMouseDown({
          options, 
          canvas, 
          isDrawing, 
          shapeRef, 
          selectedShapeRef
        })

        window.addEventListener('resize', () => {
          handleResize(fabricRef)
        })

    })

  }, [])*/}

  return (
        <main className="h-screen overflow-hidden">
          <NavBar />

          <section className="flex h-full flex-row">
            <LeftSideBar />
            <Live />
            <RightSideBar />
          </section>

          
          
        </main>
  )
}