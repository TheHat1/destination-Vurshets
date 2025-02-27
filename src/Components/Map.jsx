import { MapContainer, Marker, ImageOverlay, Tooltip } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react"
import { LatLngBounds, CRS, Icon } from "leaflet"
import { useNavigate } from "react-router-dom"

export default function Map(){
    const navigate = useNavigate()
    const myMarker = new Icon({
        iconUrl:"/assets/pins/normalPin.png",
        iconSize: [35,35]
    })
    const markerWithCross = new Icon({
        iconUrl:"/assets/pins/pinWithCross.png",
        iconSize: [35,35]
    })
    const footballMarker = new Icon({
        iconUrl:"/assets/pins/footballPin.png",
        iconSize: [35,35]
    })
    const landMark = new Icon({
        iconUrl:"/assets/pins/landMark.png",
        iconSize: [35,35]
    })
    const waterPin = new Icon({
        iconUrl:"/assets/pins/water-pin.png",
        iconSize: [35,35]
    })
    const fountainPin = new Icon({
        iconUrl:"/assets/pins/fountain-pin.png",
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
            className="h-screen w-full lg:w-[calc(100vw-var(--side-panel-width))] fixed -z-50 right-0" style={{ "--side-panel-width": "500px" }}
        >
            <ImageOverlay url="/assets/map.svg" bounds={bounds}/>
            <Marker eventHandlers={{click:()=>{navigate("/paleopark")}}} position={[2070,2456]} icon={myMarker}>
                <Tooltip direction="top">Палеопарк</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/vujenpark")}}} position={[1915,2420]} icon={myMarker}>
                <Tooltip direction="top">Въжен парк</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/starata-banq")}}} position={[2135,2400]} icon={myMarker}>
                <Tooltip direction="top">Старата баня</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/stadion")}}} position={[1420,1960]} icon={footballMarker}>
                <Tooltip direction="top">Стадион</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/sluncheva-gradina")}}} position={[2152,2280]} icon={myMarker}>
                <Tooltip direction="top">Слънчева градина</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/vodopad")}}} position={[800,2850]} icon={landMark}>
                <Tooltip direction="top">Райски кът</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/pametnik-na-zagianlite")}}} position={[1780,2073]} icon={myMarker}>
                <Tooltip direction="top">Паметник на загиналите във Втората световна война</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/tsarskoto-kazino")}}} position={[2050,2400]} icon={myMarker}>
                <Tooltip direction="top">Царското казино</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/ivanchova-polqna")}}} position={[1460,2650]} icon={landMark}>
                <Tooltip direction="top">Иванчова поляна</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/gorski-park")}}} position={[2000,2460]} icon={myMarker}>
                <Tooltip direction="top">Горски парк</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/hram")}}} position={[2760,2630]} icon={markerWithCross}>
                <Tooltip direction="top">Храм Свети Георги Победоносец</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/amphitheatar")}}} position={[1930,2490]} icon={myMarker}>
                <Tooltip direction="top">Амфитеатър</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/rimski-stulbi")}}} position={[1775,2350]} icon={myMarker}>
                <Tooltip direction="top">Римски стълби</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/muzei")}}} position={[2360,2370]} icon={myMarker}>
                <Tooltip direction="top">Общински музей</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/mineralna-voda")}}} position={[2225,2455]} icon={waterPin}>
                <Tooltip direction="top">Минерална чешма</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/mineralna-voda2")}}} position={[2295,2355]} icon={waterPin}>
                <Tooltip direction="top">Минерална чешма</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/")}}} position={[2230,2290]} icon={fountainPin}>
                <Tooltip direction="top">Фонтан</Tooltip>
            </Marker>
        </MapContainer>
    );
}