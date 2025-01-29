import Map from "/src/assets/map.svg?react"
import { useEffect, useState } from "react"


export default function HomePage(){
    const [scrollValue, setScrollValue] = useState(screen.height)
    const [isHoldingMouse1, setIsHoldingMouse1] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    function onUserScroll(scrollObject){
      if(screen.height * 3 > scrollValue){ 
        if(scrollObject.deltaY < 0){
            setScrollValue(scrollValue + 40)
           }
      }
      if(screen.height / 2 < scrollValue){
        if(scrollObject.deltaY > 0){
            setScrollValue(scrollValue - 40)
        }
      }
    }

    useEffect(()=>{
        if(scrollValue < screen.height * 3 && scrollValue > screen.height /2){
            document.getElementById("Map").style.width = scrollValue
            document.getElementById("Map").style.height = scrollValue        
        }
    }, [scrollValue])

    useEffect(()=>{
       if(isHoldingMouse1){
         const handleMouseMove = (mouseXY) => {
             setMousePosition({ x: mouseXY.clientX, y: mouseXY.clientY });
           }
      
           window.addEventListener("mousemove", handleMouseMove)
      
           return () => {
             window.removeEventListener("mousemove", handleMouseMove)
           }
       }
    })

    return(
        <>
        <div className="bg-white w-[400px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0" style={{ "--navbar-height": "110px" }}>
            {isHoldingMouse1 ? <h1>holding mouse 1</h1>:<h1>Not holding mouse 1</h1>}
            <h1>X:{mousePosition.x} Y:{mousePosition.y} </h1>
        </div>
        <div className="bg-gray-300 w-[300vw] h-[300vh] fixed top-[60vh] left-[60vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden flex justify-center items-center -z-10" onWheel={onUserScroll} onMouseDown={()=>{setIsHoldingMouse1(true)}} onMouseUp={()=>{setIsHoldingMouse1(false)}}>
           <Map id="Map" />
        </div>
        </>
    )
}