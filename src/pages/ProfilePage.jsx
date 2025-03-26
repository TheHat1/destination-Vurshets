import { useNavigate } from "react-router-dom"
import supabase from "../backend/supabase"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function ProfilePage(){
    const navigate = useNavigate()
    const [username, setUsername] = useState()
    const [useremail, setUseremail] = useState()
    const [createdAt, setCreatedAt] = useState()
    const {t} = useTranslation()

    async function getUser(){
        const {data, error} = await supabase.auth.getSession()
    
        if(data){
        const {data: userData, error: userError} = await supabase.
        from('profiles').
        select('*').
        eq('email', data.session.user.email).
        single()
        setUsername(userData.username)
        setUseremail(userData.email)
        setCreatedAt(userData.date_created)
        }
    }

    async function signOut(){
        const {error} = await supabase.auth.signOut().then(()=>{navigate('/')})
        
    }

    useEffect(()=>{
        getUser()
    },[])

    return(
        <div className="w-screen h-screen bg-gray-300 relative">
            <div className="bg-white mt-[150px] max-w-[900px] w-full h-[550px] mx-10 absolute rounded-md shadow-lg">
                <div onClick={signOut} className="bg-slate-900 w-[100px] h-[40px] text-white text-xl rounded-md text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105 absolute bottom-5 right-5">{t('profilePage.signout')}</div>
                <img src="/assets/misc/destination-vurshets-logo.png" className="bg-gray-700 object-cover w-[250px] h-[250px] absolute left-9 top-9 rounded-full"/>
                <div className="w-[550px] h-[85px] absolute top-[100px] right-5 text-5xl flex items-center font-robotoMono">{username}</div>
                <div className="w-[400px] h-[55px] absolute top-[190px] right-[140px] font-robotoMono">{useremail}</div>
                <div className="w-[500px] h-min bottom-5 left-5 font-robotoMono absolute">{t('profilePage.createdAt')}{createdAt}</div>
            </div>
        </div>
    )
}