import { useEffect } from "react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import supabase from "../backend/supabase"
import { useTranslation } from "react-i18next"


export default function ResetPasswordStep2(){
    const [password, setPassword] = useState()
    const [secondPassword, setSecondPassword] = useState()
    const [errorReseting, setErrorReseting] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const {t} = useTranslation()

    useEffect(()=>{
        const token = searchParams.get('access_token')
        if(!token){
            navigate('/signin')
        }
    },[])

    async function resetPassword(){
        if(password != null && secondPassword != null){
            if(password == secondPassword){
                const {error} = await supabase.auth.updateUser({password: password})

                if(error){
                    setErrorReseting(true)
                    setErrorMsg(t('profile.errorReseting'))
                }else{
                    navigate('/signin')
                }
            }else{
                setErrorReseting(true)
                setErrorMsg(t('profile.notMatching'))
            }            
        }else{
            setErrorReseting(true)
            setErrorMsg(t('profile.emptyFields'))
        }

    }

    return (
        <div className="w-screen h-screen bg-gray-300 flex justify-center">
            <div className="h-[400px] max-w-[570px] w-full mx-5 fixed mt-40 bg-white flex items-center justify-center flex-col space-y-5 shadow-lg rounded-md">

            <div className={`text-lg font-semibold flex items-center pl-[10px] border rounded-md transition-all duration-300 ease-out ${
                errorReseting ? "max-w-[400px] w-full h-[50px] border-red-950 text-red-800 bg-red-200": "max-w-[450px] w-full border-slate-900"}`}>
                {errorMsg}
            </div>

                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105"
                type="password"
                placeholder={t('profile.parola')}
                onChange={(e)=>{setPassword(e.target.value)}}
                />

                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105"
                type="password"
                placeholder={t('profile.parola2')}
                onChange={(e)=>{setSecondPassword(e.target.value)}}
                />

                <div onClick={resetPassword} className="w-[160px] h-[45px] text-xl cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 hover:bg-slate-700 transition-transform ease-out duration-150 hover:scale-105">{t('profile.reset2')}</div>
            </div>
        </div>
    )
}