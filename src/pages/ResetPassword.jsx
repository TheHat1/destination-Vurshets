import { useTranslation } from "react-i18next"
import supabase from "../backend/supabase"
import { useState } from "react"


export default function resetPassword(){
    const {t} = useTranslation()
    const [email, setEmail] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [error, setError] = useState(false)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let isSuccsess = false

    async function resetPassword(){
        if(email != null){
            if(emailRegex.test(email)){
                const {data, error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo: "https://destination-vurshets.netlify.app/resetpasswordstep2"})
                isSuccsess = true
                setError(false)
                setErrorMsg("E-mail изпратен")
            }else{
                setError(true)
                setErrorMsg(t('profile.notValidEmail'))
            }
        }else{
            setErrorMsg(t('profile.emptyFields'))
            setError(true)
        }
    }

    return(
        <div className="w-screen h-screen bg-gray-300 flex justify-center">
            <div className="h-[300px] w-[90vw] max-w-[600px] fixed mt-36 bg-white flex items-center justify-center flex-col space-y-5 shadow-lg rounded-md">

            <div className={`text-lg font-semibold flex items-center pl-[10px] border rounded-md transition-all duration-300 ease-out ${
                error ? "w-[80vw] max-w-[400px] h-[50px] border-red-950 text-red-800 bg-red-200": "max-w-[450px] w-[80vw] border-slate-900"} ${isSuccsess ? "max-w-[400px] w-full h-[50px] border-slate-900 bg-slate-300 ":""}`}>
                {errorMsg}
            </div>

                <input 
                className="border border-gray-900 w-[80vw] max-w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105"
                type="text"
                placeholder="   E-mail"
                onChange={(e)=>{setEmail(e.target.value)}}
                />

                <div onClick={resetPassword} className="w-[160px] h-[45px] text-xl cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 hover:bg-slate-700 transition-transform ease-out duration-150 hover:scale-105">{t('profile.send')}</div>
            </div>
        </div>
    )
}