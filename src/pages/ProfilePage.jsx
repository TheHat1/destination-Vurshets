import { useNavigate } from "react-router-dom"
import supabase from "../backend/supabase"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export default function ProfilePage(){
    const navigate = useNavigate()
    const [username, setUsername] = useState()
    const [useremail, setUseremail] = useState()
    const [createdAt, setCreatedAt] = useState()
    const [Refresh, setRefresh] = useState()
    const [isChange, setIsChange] = useState(false)
    const [errorChange, setErrorChange] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const [msg, setMsg] = useState()
    const [newData, setNewData] = useState()
    const divRef = useRef()
    const {t} = useTranslation()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    async function getUser(){
        const {data, error} = await supabase.auth.getSession()
    
        if(data){
        const {data: userData, error: userError} = await supabase.
        from('profiles').
        select('*').
        eq('user_id', data.session.user.id).
        single()

        setUsername(userData.username)
        setUseremail(data.session.user.email)
        setCreatedAt(userData.date_created)
        }
    }

    async function signOut(){
        const {error} = await supabase.auth.signOut().then(()=>{navigate('/')})
    }

    async function changeUser(){
        setErrorMsg('')
        
        if(msg == 'profilePage.changeUser'){
            if(newData != undefined){
                const {error} = await supabase.from('profiles').update({username: newData}).eq('email', useremail)

                setRefresh(Math.random())
                setIsChange(false)
                setNewData('')
                
            }else{
                setErrorChange(true)
                setErrorMsg('prazno')
            }
        }else{

            if(emailRegex.test(newData)){
                const {error} = await supabase.auth.updateUser({
                    email: newData
                })

                const {error: errorUpdate} = await supabase.
                    from('profiles'). 
                    update({email: newData}). 
                    eq('username', username)
                
                setRefresh(Math.random())
                setIsChange(false)
                setNewData('')

            }else{
                setErrorChange(true)
                setErrorMsg('profile.notValidEmail')
            }

        }

    }

    function handleClickOutsideList(e){
        if(divRef.current && !divRef.current.contains(e.target) && !divRef.current.contains(e.target)){
          setIsChange(false)
        }
      }
    
      document.addEventListener('mousedown', handleClickOutsideList)

    useEffect(()=>{
        getUser()
    },[Refresh])

    return(
        <div className="w-screen h-screen flex justify-center lg:justify-start">
            <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-20 transition-opacity duration-300 ${isChange ? "opacity-100" : "opacity-0 pointer-events-none"}`}></div>
            <div className="absolute inset-0 flex justify-center">
                <div ref={divRef} className={`absolute flex flex-col space-y-5 justify-center items-center overflow-hidden mx-auto max-w-[500px] w-[90vw] min-h-[250px] h-fit bg-white rounded-md z-30 transition-transform duration-300 ease-out ${
                    isChange ? "translate-y-[200px] lg:translate-y-[300px]" : "-translate-y-[210px] pointer-events-none"}`}>
                    <h1 className="font-robotoMono text-lg px-5 text-center">
                       {t(msg)}
                    </h1>
                    <div className={`text-lg font-semibold text-red-800 bg-red-200 flex items-center pl-[10px] border border-red-950 rounded-md transition-all duration-300 ease-out ${
                        errorChange ? "max-w-[400px] w-[80vw] h-[50px]": "max-w-[450px] w-[80vw] border-slate-900"}`}>
                        {t(errorMsg)}
                    </div>
                    <input
                        className="border border-gray-900 w-[80vw] max-w-[400px] h-[50px] rounded-lg transition-transform ease-out duration-150 hover:scale-105"
                        type="text"
                        placeholder=" ..."
                        onChange={e => {setNewData(e.target.value)}}
                        value={newData}
                    />
                    <div onClick={changeUser} className="bg-slate-900 w-[100px] h-[40px] text-white text-xl rounded-lg text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">{t('profilePage.change')}</div>
                </div>                
            </div>

            <div className="bg-white mt-[150px] max-w-[900px] w-[90vw] h-[570px] lg:h-[450px] lg:mx-10 relative rounded-md shadow-lg">
                <div className="z-10 w-full h-full absolute flex flex-col space-y-5 items-center justify-end pb-5 md:flex-row-reverse md:items-end md:justify-between px-5">
                    <div onClick={signOut} className="bg-slate-900 w-[100px] h-[40px] text-white text-xl rounded-lg text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">{t('profilePage.signout')}</div>
                    <div className="max-w-[500px] w-[80vw] h-min text-wrap text-center md:text-left bottom-5 left-5 font-robotoMono ">{t('profilePage.createdAt')}{createdAt}</div>
                </div>
                <div className="w-full h-full absolute flex flex-col space-y-5 items-center justify-start pb-5 lg:flex-row lg:items-start lg:justify-between p-5">
                    <img src="/assets/misc/destination-vurshets-logo.png" className="bg-gray-700 object-cover shadow-lg w-[250px] h-[250px] rounded-full"/>
                    <div className="lg:pt-10 px-5 flex flex-col space-y-5 sm:space-y-1">
                        <div className="flex flex-row items-center">
                            <h1 className="max-w-[550px] w-[80vw] h-min max-h-[90px] text-5xl flex items-center font-robotoMono text-balance truncate">{username}</h1>
                            <img onClick={()=>{setIsChange(!isChange); setMsg('profilePage.changeUser'); setErrorChange(false); setErrorMsg('')}} className="w-[30px] h-[30px] z-10 cursor-pointer transition-transform ease-out duration-150 hover:scale-110" src="/assets/misc/edit.png"/>
                        </div>
                        <div className="flex flex-row items-start">
                            <h1 className="max-w-[545px] w-[80vw] h-[55px] font-robotoMono">{useremail}</h1>
                            <img onClick={()=>{setIsChange(!isChange); setMsg('profilePage.changeEmail'); setErrorChange(false); setErrorMsg('')}} className="w-[20px] h-[20px] z-10 cursor-pointer transition-transform ease-out duration-150 hover:scale-110" src="/assets/misc/edit.png"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}