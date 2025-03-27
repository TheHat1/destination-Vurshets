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
        <div className="w-screen h-screen flex justify-center lg:flex-none lg:justify-start ">
            <div className="bg-white mt-[150px] max-w-[900px] w-[90vw] h-[570px] lg:h-[450px] lg:mx-10 relative rounded-md shadow-lg">
                <div className="w-full h-full absolute flex flex-col space-y-5 items-center justify-end pb-5 md:flex-row-reverse md:items-end md:justify-between px-5">
                    <div onClick={signOut} className="bg-slate-900 w-[100px] h-[40px] text-white text-xl rounded-md text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105 bottom-5 right-5">{t('profilePage.signout')}</div>
                    <div className="max-w-[500px] w-[80vw] h-min text-wrap text-center md:text-left bottom-5 left-5 font-robotoMono ">{t('profilePage.createdAt')}{createdAt}</div>
                </div>
                <div className="w-full h-full absolute flex flex-col space-y-5 items-center justify-start pb-5 lg:flex-row lg:items-start lg:justify-between p-5">
                    <img src="/assets/misc/destination-vurshets-logo.png" className="bg-gray-700 object-cover w-[250px] h-[250px] rounded-full"/>
                    <div className="lg:pt-10 px-5 flex flex-col space-y-5 sm:space-y-1">
                        <h1 className="max-w-[550px] w-[80vw] h-min max-h-[90px] text-5xl flex items-center font-robotoMono text-balance truncate">{username}</h1>
                        <h1 className="max-w-[400px] w-[80vw] h-[55px] font-robotoMono">{useremail}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}