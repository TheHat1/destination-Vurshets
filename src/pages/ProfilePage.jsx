import { useNavigate } from "react-router-dom"
import supabase from "../backend/supabase"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import locations from "src/assets/cards-info.json"
import outsideLocations from "src/assets/locations-near.json"
import ReviewCard from "../Components/ReviewCard"

export default function ProfilePage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState()
    const [useremail, setUseremail] = useState()
    const [createdAt, setCreatedAt] = useState()
    const [userid, setUserid] = useState()
    const [img, setImg] = useState("")
    const [file, setFile] = useState()
    const [userReviews, setUserReviews] = useState()
    const [Refresh, setRefresh] = useState(0)
    const [isChange, setIsChange] = useState(false)
    const [errorChange, setErrorChange] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const [msg, setMsg] = useState()
    const [newData, setNewData] = useState()
    const [signingout, setSigningout] = useState(false)
    const [divKey, setDivKey] = useState()
    const divRef = useRef()
    const inputRef = useRef()
    const { i18n, t } = useTranslation()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    async function getUser() {
        try {
            const { data, error } = await supabase.auth.getSession()

            if (!data?.session) {
                navigate("/signin")
                return
            }

            if (data?.session?.user?.id) {
                const { data: userData, error: userError } = await supabase.
                    from('profiles').
                    select('*').
                    eq('user_id', data.session.user.id).
                    single()

                setUsername(userData.username)
                setUseremail(userData.email)
                setCreatedAt(userData.date_created)
                setUserid(data.session.user.id)

                if (data.session.user.email !== userData.email) {

                    const { data: insert2, error: insertError } = await supabase.
                        from('profiles').
                        update({ email: data?.session?.user?.email }).
                        eq('user_id', data?.session?.user?.id)

                    setRefresh(Math.random())
                }

                getUserReview(data.session.user.id)

                const cacheData = localStorage.getItem("img_cache_" + data?.session?.user?.id)

                if (cacheData) {
                    const { url, expiry } = JSON.parse(cacheData)
                    if (Date.now() < expiry) {
                        setImg(url)
                        return
                    }
                }

                const { data: listData, error: listError } = await supabase.storage.from('destination-vurshets-bucket').list("userPFP/" + data.session.user.id)

                if (listData.length != 0) {
                    const { data: PFPdata, error: PFPerror } = await supabase.
                        storage.
                        from('destination-vurshets-bucket').
                        createSignedUrl("userPFP/" + data.session.user.id + "/" + listData[0].name, 60 * 60 * 24)

                    localStorage.setItem("img_cache_" + data?.session?.user?.id, JSON.stringify({
                        url: PFPdata.signedUrl,
                        expiry: Date.now() + 60 * 60 * 24 * 1000
                    }))

                    setImg(PFPdata.signedUrl)

                } else {
                    setImg('/assets/misc/default-user.png')
                }
            }
        } catch (err) {
            console.error("There was an error! :( " + err)
        }
    }

    async function getUserReview(id) {
        const reviews = await Promise.all(
            locations.locations.map(async (loc) => {
                const { data: review, error: errorReview } = await supabase
                    .from(loc.id + '-reviews')
                    .select()
                    .eq('user_id', id)
                    .maybeSingle()

                if (review) {
                    return (
                        <div className="flex flex-col space-y-1 mt-6">
                            <div className="bg-slate-900 rounded-lg h-[35px] flex items-center font-bold px-5 text-white text-lg shadow-lg">
                                {t('locationNames.' + loc.locationNameAndDesc)}
                            </div>
                            <ReviewCard key={review.user_id} id={review.user_id} desc={review.review_desc} date={review.created_at} review={review.review} />
                        </div>

                    )
                } else {
                    return
                }
            })
        )
        setUserReviews(reviews)
    }

    async function signOut() {
        setSigningout(true)
        const { } = await supabase.auth.signOut().then(() => { navigate('/') })
    }

    async function changeUser() {
        setErrorMsg('')

        if (msg == 'profilePage.changeUser') {
            if (newData != null) {
                const { error } = await supabase.from('profiles').update({ username: newData }).eq('user_id', userid)

                setRefresh(Math.random())
                setIsChange(false)
                setNewData('')

            } else {
                setErrorChange(true)
                setErrorMsg('profilePage.prazno')
            }
        } else {

            if (emailRegex.test(newData)) {
                const { error } = await supabase.auth.updateUser({
                    email: newData
                })

                const { error: errorUpdate } = await supabase.
                    from('profiles').
                    update({ email: newData }).
                    eq('user_id', userid)

                setRefresh(Math.random())
                setIsChange(false)
                setNewData('')

            } else {
                setErrorChange(true)
                setErrorMsg('profile.notValidEmail')
            }

        }

    }

    async function uploadPFP() {
        try {
            setSigningout(true)

            const { data: listData } = await supabase.storage.from('destination-vurshets-bucket').list('userPFP/' + userid)

            if (listData.length != 0) {
                const { } = await supabase.storage.from('destination-vurshets-bucket').remove(['userPFP/' + userid + '/' + listData[0].name])
            }

            const filePath = "userPFP/" + userid + '/' + file.name.replaceAll(/[^\w.-]/g, "")

            const { data, error: uploadError } = await supabase
                .storage
                .from('destination-vurshets-bucket')
                .upload(filePath, file, {
                    upsert: true,
                    contentType: file.type
                })

            setSigningout(false)
            
            if (uploadError) {
                console.error("There was an error: " + JSON.stringify(uploadError, null, 2))
                return
            }

            const { data: listData1, error: listError } = await supabase.storage.from('destination-vurshets-bucket').list("userPFP/" + userid)

            const { data: PFPdata, error: PFPerror } = await supabase.
                storage.
                from('destination-vurshets-bucket').
                createSignedUrl("userPFP/" + userid + "/" + listData1[0].name, 60 * 60 * 24)

            localStorage.setItem("img_cache_" + userid, JSON.stringify({
                url: PFPdata.signedUrl,
                expiry: Date.now() + 60 * 60 * 24 * 1000
            }))

            setImg(PFPdata.signedUrl)
            setFile()
            setRefresh(Math.random())
            setDivKey(Math.random())

        } catch (err) {
            console.error("There was an error uploading PFP: " + err)
        }
    }

    function handleClickOutsideList(e) {
        if (divRef.current && !divRef.current.contains(e.target) && !divRef.current.contains(e.target)) {
            setIsChange(false)
        }
    }

    function handlePFPupload() {
        inputRef.current.click()
    }

    document.addEventListener('mousedown', handleClickOutsideList)

    useEffect(() => {
        getUser()
    }, [Refresh])

    useEffect(() => {
        getUserReview(userid)
    }, [i18n.language, Refresh])

    useEffect(() => {
        if (file != undefined) {
            if (file.type.includes("image")) {
                uploadPFP()
            }
        }
    }, [file])


    return (
        <div className="w-screen h-screen flex justify-center lg:justify-start ">
            <div className={`absolute flex justify-center items-center inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isChange || signingout ? "opacity-100 z-30" : "opacity-0 pointer-events-none -z-50"}`}>
                <img loading="lazy" className={`z-50 w-[180px] h-[180px] ${signingout ? "opacity-100" : "opacity-0"}`} src="assets/misc/loading.gif" />
            </div>
            <div className="absolute inset-0 flex justify-center">
                <div ref={divRef} className={`absolute flex flex-col space-y-5 justify-center items-center overflow-hidden mx-auto p-5 max-w-[500px] w-[90vw] min-h-[250px] h-fit bg-white rounded-md z-30 transition-transform duration-300 ease-out ${isChange ? "translate-y-[200px] lg:translate-y-[300px]" : "-translate-y-[210px] pointer-events-none"}`}>
                    <h1 className="font-robotoMono text-lg px-5 text-center">
                        {t(msg)}
                    </h1>
                    <div className={`text-lg font-semibold text-red-800 bg-red-200 flex items-center pl-[10px] border border-red-950 rounded-md transition-all duration-300 ease-out ${errorChange ? "max-w-[400px] w-[80vw] h-[50px]" : "max-w-[450px] w-[80vw] border-slate-900"}`}>
                        {t(errorMsg)}
                    </div>
                    <input
                        className="border border-gray-900 w-[80vw] max-w-[400px] h-[50px] rounded-lg transition-transform ease-out duration-150 hover:scale-105 pl-5"
                        type="text"
                        placeholder="..."
                        onChange={e => { setNewData(e.target.value) }}
                        value={newData}
                    />
                    <div onClick={changeUser} className="bg-slate-900 w-[100px] h-[40px] text-white text-xl rounded-lg text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">{t('profilePage.change')}</div>
                </div>
            </div>

            <div className="min-h-screen flex flex-col overflow-x-hidden space-y-5">
                <main className="flex-grow w-screen flex flex-col space-y-5 items-center lg:items-start z-0 mt-[110px] relative">
                    <div className="bg-white mt-[20px] max-w-[900px] w-[90vw] min-h-[570px] lg:min-h-[450px] lg:mx-10 relative rounded-md shadow-lg">
                        <div className="z-10 w-full h-full absolute flex flex-col space-y-5 items-center justify-end pb-5 md:flex-row-reverse md:items-end md:justify-between px-5">
                            <div onClick={signOut} className="bg-slate-900 w-[100px] h-[40px] text-white text-xl rounded-lg text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">
                                {t('profilePage.signout')}
                            </div>
                            <div className="max-w-[500px] w-[80vw] h-min text-wrap text-center md:text-left bottom-5 left-5 font-robotoMono">
                                {t('profilePage.createdAt')}{createdAt}
                            </div>
                        </div>
                        <div className="w-full h-full absolute flex flex-col space-y-5 items-center justify-start pb-5 lg:flex-row lg:items-start lg:justify-between p-5">
                            <div className="relative group">
                                <img src={img} className="bg-gray-300 object-cover shadow-lg w-[250px] h-[250px] rounded-full" />
                                <div className="w-[250px] h-[250px] flex justify-center items-center rounded-full absolute top-0 opacity-0 group-hover:opacity-75 bg-black z-10">
                                    <img onClick={handlePFPupload} src="/assets/misc/edit.png" className="w-[45px] h-[45px] opacity-100 invert transition-transform ease-out duration-150 hover:scale-110 cursor-pointer" />
                                    <input ref={inputRef} type="file" className="absolute hidden" onChange={(e) => { setFile(e.target.files[0]) }} />
                                </div>
                            </div>

                            <div className="lg:pt-10 px-5 flex flex-col space-y-5 sm:space-y-1">
                                <div className="flex flex-row items-center">
                                    <h1 className="max-w-[550px] w-[80vw] h-min max-h-[90px] text-5xl flex items-center font-robotoMono text-balance truncate">{username}</h1>
                                    <img onClick={() => { setIsChange(!isChange); setMsg('profilePage.changeUser'); setErrorChange(false); setErrorMsg('') }} className="w-[30px] h-[30px] z-10 cursor-pointer transition-transform ease-out duration-150 hover:scale-110" src="/assets/misc/edit.png" />
                                </div>
                                <div className="flex flex-row items-start">
                                    <h1 className="max-w-[545px] w-[80vw] h-[55px] font-robotoMono">{useremail}</h1>
                                    <img onClick={() => { setIsChange(!isChange); setMsg('profilePage.changeEmail'); setErrorChange(false); setErrorMsg('') }} className="w-[20px] h-[20px] z-10 cursor-pointer transition-transform ease-out duration-150 hover:scale-110" src="/assets/misc/edit.png" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white max-w-[900px] w-[90vw] min-h-[500px] lg:mx-10 relative rounded-md shadow-lg flex flex-col">
                        <h1 className="font-robotoMono text-3xl pl-[20px] pt-5">{t('profilePage.reviews')}</h1>
                        <div key={divKey} className="m-5 flex-1 p-5 bg-gray-300 rounded-md">
                            {userReviews}
                        </div>
                    </div>
                </main>

                <footer className="bg-slate-900 w-full min-h-[110px] flex items-center pl-7 text-gray-400 text-md">
                    <h1>{t('ui.createdBy')}</h1>
                    <a href="https://github.com/TheHat1" target="_blank" rel="noopener noreferrer">
                        <div className="transition-transform ease-out duration-150 hover:scale-105 w-[140px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center pr-5 brightness-75 hover:brightness-50">
                            <img src="/assets/misc/githubLogo.png" className="w-[25px] h-[25px] mx-[8px]" />
                            TheHat1
                        </div>
                    </a>
                </footer>
            </div>
        </div>
    )
}