import { MapContainer, Marker, ImageOverlay, Tooltip } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react"
import { LatLngBounds, CRS, DivIcon } from "leaflet"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Map(){
    const navigate = useNavigate()
    const {t} = useTranslation()
    const myMarker = new DivIcon({
        iconSize: [35, 35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/assets/pins/normalPin.png" 
            class="w-[35px] h-[35px] transition-transform ease-out duration-150 group-hover:scale-150" />
        </div>
      `,
    })
    const markerWithCross = new DivIcon({
        iconSize: [35,35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/assets/pins/pinWithCross.png" 
            class="w-[35px] h-[35px] transition-transform ease-out duration-150 group-hover:scale-150" />
        </div>
      `,
    })
    const footballMarker = new DivIcon({
        iconSize: [35,35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/assets/pins/footballPin.png" 
            class="w-[35px] h-[35px] transition-transform ease-out duration-150 group-hover:scale-150" />
        </div>
      `,
    })
    const landMark = new DivIcon({
        iconSize: [35,35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/assets/pins/landMark.png" 
            class="w-[35px] h-[35px] transition-transform ease-out duration-150 group-hover:scale-150" />
        </div>
      `,
    })
    const waterPin = new DivIcon({
        iconSize: [35,35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/assets/pins/water-pin.png" 
            class="w-[35px] h-[35px] transition-transform ease-out duration-150 group-hover:scale-150" />
        </div>
      `,
    })
    const fountainPin = new DivIcon({
        iconSize: [35,35],
        className: "group",
        html: `
        <div class="relative">
          <img src="/assets/pins/fountain-pin.png" 
            class="w-[35px] h-[35px] transition-transform ease-out duration-150 group-hover:scale-150" />
        </div>
      `,
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
            <Marker  eventHandlers={{click:()=>{navigate("/paleopark")}}} position={[2070,2456]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.paleopark')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/vujenpark")}}} position={[1915,2420]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.vujenpark')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/starata-banq")}}} position={[2135,2400]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.staratabanq')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/stadion")}}} position={[1420,1960]} icon={footballMarker}>
                <Tooltip direction="top">{t('locationNames.stadion')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/sluncheva-gradina")}}} position={[2152,2280]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.slunchevaGradina')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/vodopad")}}} position={[800,2850]} icon={landMark}>
                <Tooltip direction="top">{t('locationNames.rajskiKat')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/pametnik-na-zagianlite")}}} position={[1780,2073]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.pametnik')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/tsarskoto-kazino")}}} position={[2050,2400]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.kazino')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/ivanchova-polqna")}}} position={[1460,2650]} icon={landMark}>
                <Tooltip direction="top">{t('locationNames.ivanchovaPolqna')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/gorski-park")}}} position={[2000,2460]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.gorskiPark')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/hram")}}} position={[2760,2630]} icon={markerWithCross}>
                <Tooltip direction="top">{t('locationNames.hram')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/amphitheatar")}}} position={[1930,2490]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.amphiteatur')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/rimski-stulbi")}}} position={[1775,2350]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.rimskiStulbi')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/muzei")}}} position={[2360,2370]} icon={myMarker}>
                <Tooltip direction="top">{t('locationNames.muzei')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/mineralna-voda")}}} position={[2225,2455]} icon={waterPin}>
                <Tooltip direction="top">{t('locationNames.cheshma')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/mineralna-voda2")}}} position={[2295,2355]} icon={waterPin}>
                <Tooltip direction="top">{t('locationNames.cheshma')}</Tooltip>
            </Marker>
            <Marker eventHandlers={{click:()=>{navigate("/")}}} position={[2230,2290]} icon={fountainPin}>
                <Tooltip direction="top">{t('locationNames.fontan')}</Tooltip>
            </Marker>
        </MapContainer>
    );
}