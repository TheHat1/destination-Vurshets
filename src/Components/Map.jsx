import { MapContainer, Marker, ImageOverlay } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react"
import { LatLngBounds, CRS } from "leaflet"

export default function Map(){
    const [isMounted, setIsMounted] = useState(false)
    const bounds = new LatLngBounds(
        [0,0],
        [3500,3500]
    )

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return <p>Loading map...</p>

    return (
        <MapContainer center={[1750, 1750]} 
            crs={CRS.Simple} 
            zoom={-2} 
            minZoom={-3} 
            maxZoom={2} 
            maxBounds={[[0, 0], [4500, 4500]]} 
            className="h-screen w-[calc(100vw-var(--side-panel-width))] fixed z-0 right-0" style={{ "--side-panel-width": "400px" }}
        >
                <ImageOverlay url="/src/assets/map.svg" bounds={bounds}/>
        </MapContainer>
    );
}