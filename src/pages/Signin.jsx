import { useState } from "react"
import supabase from "../backend/supabase"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Login(){
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [errorSignIn, setErrorSignIn] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    async function SignIn(){
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error.message.includes("Email not confirmed")){
            setErrorSignIn(true)
            setErrorMsg(t('profile.notConfirmed'))
        }

        if(error.message.includes("Invalid login credentials")){
            setErrorSignIn(true)
            setErrorMsg(t('profile.wrongCrd'))
        }

        if(data){
            console.log(data)
        }

        
    }

    return(
        <div className="w-screen h-screen bg-gray-300 flex justify-center">
            <div className="h-[350px] w-[600px] fixed mt-36 bg-white flex items-center justify-center flex-col space-y-5 shadow-lg rounded-md">
            
            {errorSignIn ? <div className="text-lg font-semibold text-red-800 w-[400px] h-[50px] bg-red-200 flex items-center pl-[10px] border border-red-950 rounded-md">
                {errorMsg}
            </div> : null}

                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105" 
                type="text"
                placeholder="   E-mail"
                onChange={(e)=>{setEmail(e.target.value)}}
                />

                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105" 
                type="password"
                placeholder={t('profile.parola')}
                onChange={(e)=>{setPassword(e.target.value)}}
                />
                
                <button type="submit" className="flex flex-col space-y-4 justify-center items-center" onClick={SignIn}>
                    <p className="text-lg">{t('profile.noProfile')} <a className="text-slate-700 font-bold hover:text-gray-500" href="/signup">{t('profile.registerHere')}</a></p>
                    <div className="w-[160px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700 transition-transform ease-out duration-150 hover:scale-105">{t('profile.vlezVprofil')}</div>
                </button>

            </div>
        </div>
    )
}