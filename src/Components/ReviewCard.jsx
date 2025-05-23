import { useEffect, useState } from "react"
import supabase from "../backend/supabase"
import { useTranslation } from "react-i18next"

export default function ReviewCard({ id, review, desc, date }) {
    const [username, setUsername] = useState()
    const [pfp, setPfp] = useState()
    const { t } = useTranslation()

    async function fetchUserInfo() {
        const { data, error } = await supabase.from('profiles').select().eq('user_id', id).single()

        if (data) {
            setUsername(data.username)
        }
    }

    async function fetchPFP() {
        try {
            const cacheData = localStorage.getItem("img_cache_" + id)

            if (cacheData) {
                const { url, expiry } = JSON.parse(cacheData)
                if (Date.now() < expiry) {
                    setPfp(url)
                    return
                }
            }

            const { data: listData, error: listError } = await supabase.storage.from('destination-vurshets-bucket').list("userPFP/" + id)

            if (listData.length != 0) {

                const { data: PFPdata, error: PFPerror } = await supabase.
                    storage.
                    from('destination-vurshets-bucket').
                    createSignedUrl("userPFP/" + id + "/" + listData[0].name, 60 * 60 * 24)

                localStorage.setItem("img_cache_" + id, JSON.stringify({
                    url: PFPdata.signedUrl,
                    expiry: Date.now() + 60 * 60 * 24 * 1000
                }))

                setPfp(PFPdata.signedUrl)

            } else {
                setPfp('/assets/misc/default-user.png')
                return
            }
        }
        catch (err) {
            console.error("Error getting pfp at review card: " + err)
        }
    }

    useEffect(() => {
        fetchUserInfo()
        fetchPFP()
    }, [])


    return (
        <div className="w-full min-h-[150px] h-fit p-5 rounded-md shadow-lg bg-white">
            <div className="flex flex-row space-x-5">
                <img src={pfp} loading="lazy" className="bg-gray-300 object-cover w-[100px] h-[100px] rounded-full" />
                <div>
                    <h1 className="font-bold font-robotoMono text-lg">{username}</h1>
                    <div className="flex flex-row ml-2 text-gray-500">
                        <h1 className="text-md font-robotoMono">{t('ui.otseni')}{review}/10</h1>
                        <img className="w-[25px] h-[25px] brightness-90 ml-[3px]" src="/assets/misc/star.png" />
                    </div>
                    <p className="font-robotoMono pl-5 text-wrap overflow-hidden break-before-auto">{desc}</p>
                </div>
            </div>
            <div className="mt-2 font-robotoMono text-right text-sm text-gray-500">{t('profilePage.createdAt')}{date}</div>
        </div>
    )
}