import { useState } from "react"
import supabase from "../backend/supabase"
import { useTranslation } from "react-i18next"

export default function ReviewCard({id, review, desc, date}){
    const [username, setUsername] = useState()
    const [pfp, setPfp] = useState()
    const {t} = useTranslation()
    
    async function fetchUserInfo(){
        const {data, error} = await supabase.from('profiles').select().eq('user_id', id).single()

        if(data){
            setUsername(data.username)
        }
    }

    async function fetchPFP(){
        const cacheData = localStorage.getItem("img_cache_" + id)
            
        if(cacheData){
            const {url, expiry} = JSON.parse(cacheData)
            if(Date.now() < expiry){
                setImg(url)
                return
            }
        }
        
        const {data: PFPdata, error: PFPerror} = await supabase.
            storage.
            from('destination-vurshets-bucket').
            createSignedUrl("userPFP/" + id + ".jpg", 60 * 60 * 24)
                
            if(PFPerror){
                if(PFPerror == "StorageApiError: Object not found"){
                    setPfp(null)
                    return
                }
                console.log("error fetching pfp:  " + PFPerror)
                return
            }
    
        localStorage.setItem("img_cache_" + id, JSON.stringify({
            url: PFPdata.signedUrl,
            expiry: Date.now() + 60 * 60 * 24 * 1000
        }))
    
        setPfp(PFPdata.signedUrl)
    }

    fetchUserInfo()

    return(
        <div className="w-full min-h-[150px] h-fit p-5 rounded-md shadow-lg bg-white">
            <div className="flex flex-row space-x-5">
                <img src={pfp} loading="lazy" className="bg-gray-700 object-cover w-[100px] h-[100px] rounded-full"/>
                <div>
                    <h1 className="font-bold font-robotoMono text-lg">{username}</h1>
                    <div className="flex flex-row ml-2 text-gray-500">
                        <h1 className="text-md font-robotoMono">{t('ui.otceni')}{review}/10</h1>
                        <img className="w-[25px] h-[25px] brightness-90 ml-[3px]" src="/assets/misc/star.png"/>   
                    </div>

                    <p className="font-robotoMono pl-5 text-wrap overflow-hidden break-all">{desc}</p>
                </div>
            </div>
            <div className="mt-2 font-robotoMono text-right text-sm text-gray-500">{t('profilePage.createdAt')}{date}</div>
        </div>
    )
}