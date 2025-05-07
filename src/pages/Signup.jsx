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
    const [errorSignUp, setErrorSignUp] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    async function signUp(){
        if(email != null && password != null && userName != null){
            if(emailRegex.test(email)){
                if(true){
                    const {data, error} = await supabase.auth.signUp({
                        email: email,
                        password: password,
                        }
                    )

                    const {data: dataInsert, errorInsert} = await supabase.from("profiles").insert({ username: userName, email: email })

                    if (dataInsert?.user) {
                        const { data, error } = await supabase.functions.invoke('create-user-folder', {
                          body: {
                            user_id: signupData.user.id
                          }
                        })
                    }
                    
                    navigate('/signin')
                }else{
                    setErrorSignUp(true)
                    setErrorMsg(t('profile.short'))
                }

            }else{
                setErrorSignUp(true)
                setErrorMsg(t('profile.notValidEmail'))
            }

        }else{
            setErrorSignUp(true)
            setErrorMsg(t('profile.emptyFields'))
        }
    }

    return(
        <div className="w-screen h-screen bg-gray-300 flex justify-center overflow-y-auto">
            <div className="h-[500px] w-[90vw] max-w-[600px] fixed mt-36 bg-white flex items-center justify-center flex-col space-y-5 shadow-lg rounded-md">
            
            <div className={`text-lg font-semibold text-red-800 bg-red-200 flex items-center pl-[10px] border border-red-950 rounded-md transition-all duration-300 ease-out ${
                errorSignUp ? "w-[90vw] max-w-[400px] h-[50px]": "max-w-[450px] w-[80vw] border-slate-900"}`}>
                {errorMsg}
            </div>

                <input 
                className="border border-gray-900 max-w-[400px] w-[80vw] h-[50px] rounded-md" 
                type="text"
                placeholder={t('profile.ime')}
                onChange={(e)=>{setUserName(e.target.value)}}
                />

                <input 
                className="border border-gray-900 max-w-[400px] w-[80vw] h-[50px] rounded-md" 
                type="text"
                placeholder="   E-mail"
                onChange={(e)=>{setEmail(e.target.value)}}
                />

                <input 
                className="border border-gray-900 max-w-[400px] w-[80vw] h-[50px] rounded-md" 
                type="password"
                placeholder={t('profile.parola')}
                onChange={(e)=>{setPassword(e.target.value)}}
                />
                
                <div className="flex flex-col space-y-4 justify-center items-center">
                    <p className="text-lg">{t('profile.vecheImaAccount')} <a className="text-slate-700 font-bold pl-1 hover:text-gray-500" href="/signin">{t('profile.vlez')}</a></p>
                    <div onClick={signUp} className="w-[160px] h-[45px] text-xl cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 hover:bg-slate-700 transition-transform ease-out duration-150 hover:scale-105">{t('profile.register')}</div>
                </div>
            </div>
        </div>
    )
}