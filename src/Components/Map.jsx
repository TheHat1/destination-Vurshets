import { MapContainer, Marker, ImageOverlay } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react"
import { LatLngBounds, CRS, Icon } from "leaflet"
import { useNavigate } from "react-router-dom"

export default function Map(){
    const navigate = useNavigate()
    const myMarker = new Icon({
        iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png",
        iconSize: [35,35]
    })
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
            className="h-screen w-[calc(100vw-var(--side-panel-width))] fixed z-0 right-0" style={{ "--side-panel-width": "500px" }}
        >
            <ImageOverlay url="/src/assets/map.svg" bounds={bounds}/>
            <Marker eventHandlers={{click:()=>{navigate("/paleopark")}}} position={[2070,2456]} icon={myMarker}/>
            <Marker eventHandlers={{click:()=>{navigate("/vujenpark")}}} position={[1915,2420]} icon={myMarker}/>
            <Marker eventHandlers={{click:()=>{navigate("/banq")}}} position={[2135,2400]} icon={myMarker}/>
        </MapContainer>
    );
}