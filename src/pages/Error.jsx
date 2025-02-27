import { useNavigate } from "react-router-dom"

export default function Error(){
const navigate = useNavigate()
    return(
        <>
        <div className="w-screen h-screen flex align-middle items-center">
           <h1 className="text-6xl font-robotoMono ">Възникна грешка</h1>
           <div onClick={()=>{navigate('/')}} className="w-[140px] h-[45px] cursor-pointer rounded-lg text-white text-center flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                <img src="/assets/home.png" className="w-[25px] h-[25px] mx-[8px]"/>
                Назад
            </div>
        </div>
        
        </>
    )
}