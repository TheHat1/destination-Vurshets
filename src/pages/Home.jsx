//import {ReactComponent as Map} from "/src/assets/destinationVurshets-map.svg"
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
        <div className="bg-gray-300 w-screen h-screen overflow-hidden" onWheel={onUserScroll} >
           
        </div>
        </>
    )
}