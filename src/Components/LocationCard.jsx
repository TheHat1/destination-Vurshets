import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function LocationCard({id, imagePath, locationNameAndDesc}){
    let imgPathConc = imagePath ? "/assets/imgs/" + imagePath : null
    let navigate = useNavigate()
    const {t, i18n} = useTranslation()
    const name = 'locationNames.' + locationNameAndDesc
    const desc = 'locationDesc.' + locationNameAndDesc

    return(
        <div onClick={()=>{navigate('/' + id)}} className="shadow-lg w-[500px] h-[150px] flex-shrink-0 hover:bg-gray-200 hover:text-gray-600 cursor-pointer relative">
              <div className="h-[150px] w-[500px] pl-[220px] absolute">
              <h1 className="pt-[30px] font-oswald truncate text-2xl font-bold text-left overflow-hidden">{t(name)}</h1>
              <p className="font-robotoMono px-[15px] text-md text-left text-balance truncate line-clamp-2">{t(desc)}</p>
              </div>
              <img loading="lazy" src={imgPathConc} className="left-0 h-full w-[200px] z-30 absolute"/>
        </div>
    )
}