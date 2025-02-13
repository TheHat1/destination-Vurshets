import { useEffect, useState } from "react"
import Map from "src/Components/Map.jsx"


export default function HomePage(){

    return(
        <>
        <div className="bg-white z-10 w-[400px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0" style={{ "--navbar-height": "110px" }}>

        </div>
        <Map/>
        </>
    )
}