import Map from "/src/assets/map.svg?react"
import { useEffect, useState } from "react"


export default function HomePage(){
    const [scrollValue, setScrollValue] = useState(screen.height)

    function onUserScroll(scrollObject){
      if(screen.height * 3 > scrollValue){ 
        if(scrollObject.deltaY < 0){
            setScrollValue(scrollValue + 40)
           }
      }
      if(screen.height / 3 < scrollValue){
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

    return(
        <>
        <div className="bg-gray-300 w-[300vw] h-[300vh] fixed top-[60vh] left-[60vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden flex justify-center items-center" onWheel={onUserScroll}>
           <Map id="Map" />
        </div>
        </>
    )
}