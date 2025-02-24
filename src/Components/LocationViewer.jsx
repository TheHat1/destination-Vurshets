import { useNavigate, useParams } from "react-router-dom"
import cardsInfo from "src/assets/cards-info.json"

export default function LocationViewer(){
    const {id} = useParams()
    const navigate = useNavigate()
    let imgPathConc = null
    let locationName = null
    let locationDesc = null
    let locationLink = null
    const foundLocation = cardsInfo.locations.find((location) => location.id == id)

    if(id != null){
        imgPathConc = "/assets/imgs/" + foundLocation.imagePath
        locationName = foundLocation.locationName
        locationDesc = foundLocation.locationDesc
        locationLink = foundLocation.link
    }

    return(
        <div className="h-[calc(100vh-var(--navbar-height))]  w-[calc(100vw-var(--side-panel-width))] fixed right-0 bottom-0 flex justify-center"  style={{ "--side-panel-width": "500px", "--navbar-height": "110px"}}>
            <div className="h-full  w-full relative z-0 overflow-y-auto overflow-x-hidden"> 
            <div className="w-full h-[300px] flex items-center shadow-lg bg-gray-100">
                <img src={imgPathConc} className="w-[450px] h-[300px] absolute right-0"/>
                <h1 className="w-[calc(100vw-var(--img-width))] font-oswald truncate text-5xl font-bold text-left text-wrap overflow-hidden absolute px-5" style={{ "--img-width": "950px"}}>{locationName}</h1>
            </div>
            <h1 className="p-5 text-xl text-wrap text-center">{locationDesc}</h1>
            <div className="m-5 p-5 h-[600px] bg-gray-500">3D Viewer</div>
            <div className="h-fit flex items-center justify-center gap-5 p-10">
                <div onClick={()=>{navigate('/')}} className="w-[140px] h-[45px] cursor-pointer rounded-lg text-white text-center flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                    <img src="/assets/home.png" className="w-[25px] h-[25px] mx-[8px]"/>
                    Назад
                </div>
                <a href={locationLink} target="_blank" rel="noopener noreferrer">
                    <div className="w-[140px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                        <img src="/assets/map-with-marker.png" className="w-[25px] h-[25px] mx-[8px]"/>
                        Отведи ме
                    </div>
                </a>
            </div>
        </div>
        </div>
    )
}