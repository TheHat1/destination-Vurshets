import { useState } from "react"
import supabase from "../backend/supabase"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function Signin() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [inProgress, setInProgress] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [errorSignIn, setErrorSignIn] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const [resendEmail, setResendEmail] = useState(false)

    async function SignIn() {
        try {
            if (email != null && password != null) {
                if (emailRegex.test(email)) {

                    setInProgress(true)

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    })

                    navigate('/')
                    if (error) {
                        if (error.message.includes("Email not confirmed")) {
                            setErrorSignIn(true)
                            setErrorMsg(t('profile.notConfirmed'))
                            setResendEmail(true)
                            setInProgress(false)
                            return
                        }

                        if (error.message.includes("Invalid login credentials")) {
                            setErrorSignIn(true)
                            setErrorMsg(t('profile.wrongCrd'))
                            setResendEmail(false)
                            setInProgress(false)
                            return
                        }
                    }
                } else {
                    setErrorSignIn(true)
                    setErrorMsg(t('profile.notValidEmail'))
                    setResendEmail(false)
                    return
                }
            } else {
                setErrorSignIn(true)
                setErrorMsg(t('profile.emptyFields'))
                setResendEmail(false)
                return
            }

        } catch (err) {
            console.error("Unexpected error:", err)
            setInProgress(false)
        }
    }

    return (
        <div className="w-screen h-screen bg-gray-300 flex justify-center">
            <div className={`absolute flex justify-center items-center inset-0 bg-black/30 backdrop-blur-sm z-20 transition-opacity duration-300 ${inProgress ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <img className="z-50 w-[180px] h-[180px] " src="assets/misc/loading.gif"/>
            </div>
            <div className="h-[450px] w-[90vw] max-w-[600px] fixed mt-36 bg-white flex items-center justify-center flex-col space-y-5 shadow-lg rounded-md">

                <div className={`text-lg font-semibold text-red-800 bg-red-200 flex items-center pl-[10px] border border-red-950 rounded-md transition-all duration-300 ease-out ${errorSignIn ? "max-w-[400px] w-[80vw] h-[50px]" : "max-w-[450px] w-[80vw] border-slate-900"}`}>
                    {errorMsg}
                    {resendEmail ? <p onClick={() => { supabase.auth.resend({ type: "signup", email }) }} className="w-max h-min pl-1 underline cursor-pointer hover:text-red-600">{t('profile.resend')}</p> : null}
                </div>

                <input
                    className="border border-gray-900 w-[80vw] max-w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105 pl-5"
                    type="text"
                    placeholder="E-mail"
                    onChange={(e) => { setEmail(e.target.value) }}
                />

                <input
                    className="border border-gray-900 w-[80vw] max-w-[400px] h-[50px] rounded-md transition-transform ease-out duration-150 hover:scale-105 pl-5"
                    type="password"
                    placeholder={t('profile.parola')}
                    onChange={(e) => { setPassword(e.target.value) }}
                />

                <div className="flex flex-col space-y-4 justify-center items-center">
                    <div className="flex items-center justify-center flex-col">
                        <p className="text-md">{t('profile.noProfile')} <a className="text-slate-700 font-bold hover:text-gray-500" href="/signup">{t('profile.registerHere')}</a></p>
                        <p className="text-lg">{t('profile.forgotenPassword')} <a href="/resetpassword" className="text-slate-700 font-bold hover:text-gray-500">{t('profile.reset')}</a></p>
                    </div>
                    <div onClick={SignIn} className="w-[160px] h-[45px] text-xl cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 hover:bg-slate-700 transition-transform ease-out duration-150 hover:scale-105">{t('profile.vlezVprofil')}</div>
                </div>

            </div>
        </div>
    )
}