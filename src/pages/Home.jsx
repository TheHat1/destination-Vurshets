
import { useEffect, useState } from "react"


export default function HomePage(){
    const [scrollValue, setScrollValue] = useState(screen.width)

    function onUserScroll(scrollObject){
       if(scrollObject.deltaY < 0){
        
        setScrollValue(scrollValue + 10)

       }else{

        setScrollValue(scrollValue - 10)

       }
    }
    
    return(
        <>
        <div className="bg-gray-400 w-screen h-screen" onWheel={onUserScroll} >
            
        </div>
        </>
    )
}