import { useState } from "react"
import supabase from "../backend/supabase"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Login(){
    const [email, setEmail] = useState()
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const {t} = useTranslation()

    async function signUp(){
        if(email != null && userName != null && password != null){
            const {errorSignUp} = await supabase.auth.signUp(
                {
                    email: email,
                    password: password
                }
            )

            const {data, error} = await supabase.from('users').insert([
                {
                    email: email,
                    user_name: userName
                }
            ])

            navigate('/signin')

        }else {
            console.log("empty fields")
        }

    }

    return(
        <div className="w-screen h-screen bg-gray-300 flex justify-center">
            <div className="h-[350px] w-[600px] fixed mt-36 bg-white flex items-center justify-center flex-col space-y-5 shadow-lg rounded-md">
                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md" 
                type="text"
                placeholder={t('profile.ime')}
                onChange={(e)=>{setUserName(e.target.value)}}
                />

                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md" 
                type="text"
                placeholder="   E-mail"
                onChange={(e)=>{setEmail(e.target.value)}}
                />

                <input 
                className="border border-gray-900 w-[400px] h-[50px] rounded-md" 
                type="password"
                placeholder={t('profile.parola')}
                onChange={(e)=>{setPassword(e.target.value)}}
                />
                
                <div onClick={signUp} className="flex flex-col space-y-4 justify-center items-center">
                    <p className="text-lg">{t('profile.vecheImaAccount')} <a className="text-slate-700 font-bold hover:text-gray-500" href="/signin">{t('profile.vlez')}</a></p>
                    <div className="w-[160px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">{t('profile.register')}</div>
                </div>
            </div>
        </div>
    )
}