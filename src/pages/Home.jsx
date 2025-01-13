import Map from "/src/assets/map.svg?react"
import { useEffect, useState } from "react"


export default function HomePage(){
    const [scrollValue, setScrollValue] = useState(screen.height)
    let tempVar = 0

    function onUserScroll(scrollObject){
       if(scrollObject.deltaY < 0){
        
        setScrollValue(scrollValue + 40)

       }else{

        setScrollValue(scrollValue - 40)

       }
    }

    useEffect(()=>{
        document.getElementById("Map").style.width = scrollValue
        document.getElementById("Map").style.height = scrollValue
    }, [scrollValue])
    
    return(
        <>
        <div className="bg-gray-300 w-screen h-screen overflow-hidden flex justify-center items-center relative" onWheel={onUserScroll} >
           <Map id="Map" />
        </div>
        </>
    )
}