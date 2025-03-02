import { useNavigate, useParams } from "react-router-dom"
import cardsInfo from "src/assets/cards-info.json"
import locationsNear from "src/assets/locations-near.json"
import { Canvas, useLoader } from "@react-three/fiber"
import { BackSide, RepeatWrapping, TextureLoader } from "three"
import { OrbitControls } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"

function PanoramicViewer({texture}){
    const [loadedTexture, setLoadedTexture] = useState(null)

    useEffect(()=>{
        const loadTexture = new Image()
        loadTexture.src = texture
        loadTexture.onload = () => {
            const newTexture = new TextureLoader().load(loadTexture.src)
            setLoadedTexture(newTexture)
        }
    },[texture])

    if(!loadedTexture){return null}

    return(
        <mesh rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[10, 10, 10, 50, 1, true]} />
            <meshBasicMaterial map={loadedTexture} side={BackSide} />
        </mesh>
    )
}

function PanoramicSkeleton(){
    return(
        <div className="bg-gray-500 animate-pulse h-[600px] w-screen"></div>
    )
}

export default function LocationViewer(){
    const {id} = useParams()
    const navigate = useNavigate()
    let imgPathConc = null
    let locationName = null
    let locationDesc = null
    let locationLink = null
    let texturePath = null
    let foundLocation = cardsInfo.locations.find((location) => location.id == id)
    
    if(foundLocation == null){
        foundLocation = locationsNear.locations.find((location) => location.id == id)
    }

    if(id != null){
        imgPathConc = "/assets/imgs/" + foundLocation.imagePath
        locationName = foundLocation.locationName
        locationDesc = foundLocation.locationDesc
        locationLink = foundLocation.link
        texturePath = "/assets/panoramicImgs/" + foundLocation.panoramicPath
    }

    return(
        <div className="w-screen pt-[50px] pb-[150px] lg:pt-0 lg:pb-0 h-[calc(100vh-var(--navbar-height))] lg:w-[calc(100vw-var(--side-panel-width))] fixed right-0 bottom-0 flex justify-center -z-10"  style={{ "--side-panel-width": "500px", "--navbar-height": "110px"}}>
            <div className="h-full w-full z-0 overflow-y-auto overflow-x-hidden relative"> 
            <div className="w-full min-h-[300px] flex flex-col space-y-5 md:space-y-0 lg:flex-col lg:space-y-5 xl:flex-row xl:space-y-0 md:flex-row items-center shadow-lg bg-gray-100">
                <h1 className="w-full mt-[55px] md:mt-0 md:w-[calc(100vw-450px)] lg:w-full xl:w-[calc(100vw-var(--img-width))] line-clamp-4 font-oswald truncate text-5xl font-bold text-left text-wrap overflow-hidden px-5" style={{ "--img-width": "950px"}}>{locationName}</h1>
                <img src={imgPathConc} className="w-[450px] h-[300px] right-0 object-cover flex-shrink-0"/>
            </div>
            <h1 className="p-10 text-xl text-pretty indent-7 font-robotoMono">{locationDesc}</h1>
            <Suspense fallback={PanoramicSkeleton}>
                <div className="m-5 h-[600px] bg-gray-400">
                    <Canvas camera={{position: [0, 0, 0.1], fov: 45}}>
                        <OrbitControls reverseHorizontalOrbit reverseVerticalOrbit rotateSpeed={0.25} minPolarAngle={Math.PI / 2.095} maxPolarAngle={Math.PI / 1.915} enableZoom={false}/>
                        <PanoramicViewer texture={texturePath}/>
                    </Canvas>
                </div>
            </Suspense>
            <div className="h-fit flex items-center justify-center gap-5 p-10">
                <div onClick={()=>{navigate('/')}} className="w-[140px] h-[45px] cursor-pointer rounded-lg text-white text-center flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                    <img src="/assets/home.png" className="w-[25px] h-[25px] mx-[8px]"/>
                    Назад
                </div>
                <a href={locationLink} target="_blank" rel="noopener noreferrer">
                    <div className="min-w-[140px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                        <img src="/assets/map-with-marker.png" className="w-[25px] h-[25px] mx-[8px]"/>
                        Отведи ме
                    </div>
                </a>
            </div>
            <div className="bg-slate-900 w-full h-[110px] bottom-0 flex items-center pl-7 text-gray-400 text-md">
                <h1>
                    Създадено от Роберто Николов
                </h1>
                <a href="https://github.com/TheHat1?tab=overview&from=2025-02-01&to=2025-02-26" target="_blank" rel="noopener noreferrer">
                    <div className="w-[140px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center pr-5 brightness-75 hover:brightness-50">
                        <img src="/assets/githubLogo.png" className="w-[25px] h-[25px] mx-[8px]"/>
                        TheHat1
                    </div>
                </a>
            </div>
            </div>
        </div>
    )
}