import { useNavigate } from "react-router-dom"

export default function LocationCard({id, imagePath, locationName, locationDesc}){
    let imgPathConc = imagePath ? "/assets/imgs/" + imagePath : null
    let navigate = useNavigate()

    return(
        <div onClick={()=>{navigate('/' + id)}} className="shadow-lg w-full h-[150px] hover:bg-gray-200 hover:text-gray-600 cursor-pointer relative">
              <div className="h-[150px] w-[500px] pl-[220px] absolute">
              <h1 className="pt-[30px] font-oswald truncate text-2xl font-bold text-left overflow-hidden">{locationName}</h1>
              <p className="font-robotoMono px-[15px] text-md text-left text-balance truncate line-clamp-2">{locationDesc}</p>
              </div>
              <img src={imgPathConc} className="left-0 h-full w-[200px] z-30 absolute"/>
        </div>
    )
}