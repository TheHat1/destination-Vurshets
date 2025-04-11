import { useNavigate, useParams } from "react-router-dom"
import cardsInfo from "src/assets/cards-info.json"
import locationsNear from "src/assets/locations-near.json"
import { Canvas } from "@react-three/fiber"
import { BackSide, TextureLoader } from "three"
import { OrbitControls } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import supabase from "../backend/supabase"
import ReviewCard from "./ReviewCard"

function PanoramicViewer({ texture }) {
    const [loadedTexture, setLoadedTexture] = useState(null)

    useEffect(() => {
        const loadTexture = new Image()
        loadTexture.src = texture
        loadTexture.onload = () => {
            const newTexture = new TextureLoader().load(loadTexture.src)
            setLoadedTexture(newTexture)
        }
    }, [texture])

    if (!loadedTexture) { return null }

    return (
        <mesh rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[10, 10, 10, 50, 1, true]} />
            <meshBasicMaterial map={loadedTexture} side={BackSide} />
        </mesh>
    )
}

function PanoramicSkeleton() {
    return (
        <div className="bg-gray-500 animate-pulse h-[600px] w-screen"></div>
    )
}

export default function LocationViewer() {
    const { id } = useParams()
    const ref = useRef(null)
    const [isUserTried3D, setIsUserTried3D] = useState(false)
    const [reviews, setReviews] = useState()
    const [reviewAvg, setReviewAvg] = useState()
    const [isSignedIn, setIsSignedIn] = useState()
    const [username, setUsername] = useState()
    const [userId, setUserId] = useState()
    const [pfp, setPfp] = useState()
    const [desc, setDesc] = useState()
    const [userReview, setUserReview] = useState()
    const [isUserReviewed, setIsUserReviewed] = useState(false)
    const [Refresh, setRefresh] = useState()
    const textareaRef = useRef()
    const navigate = useNavigate()
    const { t } = useTranslation()
    let imgPathConc = null
    let locationName = null
    let locationDesc = null
    let locationLink = null
    let texturePath = null
    let authLink = null
    let foundLocation = cardsInfo.locations.find((location) => location.id == id)

    if (foundLocation == null) {
        foundLocation = locationsNear.locations.find((location) => location.id == id)
    }

    if (id != null) {
        imgPathConc = "imgs/" + foundLocation.imagePath
        locationName = 'locationNames.' + foundLocation.locationNameAndDesc
        locationDesc = 'locationDesc.' + foundLocation.locationNameAndDesc
        locationLink = foundLocation.link
        texturePath = "/assets/panoramicImgs/" + foundLocation.panoramicPath
        authLink = foundLocation.imgAuthor
    }

    const [img, setImg] = useState()

    async function fetchImg() {
        const cacheData = localStorage.getItem("img_cache_" + foundLocation.imagePath)

        if (cacheData) {
            const { url, expiry } = JSON.parse(cacheData)
            if (Date.now() < expiry) {
                setImg(url)
                return
            }
        }
        const { data, error } = await supabase.storage.from('destination-vurshets-bucket').createSignedUrl(imgPathConc, 60 * 60 * 24)

        if (error) {
            ("hmmm there was an error fetching img")
        }

        localStorage.setItem("img_cache_" + foundLocation.imagePath, JSON.stringify({
            url: data.signedUrl,
            expiry: Date.now() + 60 * 60 * 24 * 1000
        }))

        setImg(data.signedUrl)
    }

    async function fetchReviews() {
        const { data, error } = await supabase.from(id + '-reviews').select()
        let br = 0
        let sum = 0

        if (data) {
            setReviews(data.slice().reverse().map((row) => {
                br++
                sum += row.review
                return (
                    <ReviewCard id={row.user_id} desc={row.review_desc} date={row.created_at} review={row.review} />
                )
            }

            ))
            if (!Number.isNaN(sum / br)) {
                setReviewAvg(sum / br)
            } else {
                setReviewAvg(0)
            }
        }

    }

    async function getUser() {
        try {
            const { data, error } = await supabase.auth.getSession()

            if (!data?.session?.user?.id) {
                setPfp('/assets/misc/default-user.png')
                return
            }
            const { data: userData, error: userError } = await supabase.
                from('profiles').
                select('*').
                eq('user_id', data.session.user.id).
                single()

            const { data: review, error: errorReview } = await supabase.
                from(id + '-reviews').
                select().
                eq('user_id', data.session.user.id).
                single()

            if (errorReview) {
                setIsUserReviewed(false)
                setUserReview(1)
                setDesc('')
            } else {
                setIsUserReviewed(true)
                setDesc(review.review_desc)
                setUserReview(review.review)
            }

            setUsername(userData?.username)
            setUserId(data.session.user.id)

            const cacheData = localStorage.getItem("img_cache_" + data.session.user.id)

            if (cacheData) {
                const { url, expiry } = JSON.parse(cacheData)
                if (Date.now() < expiry) {
                    setPfp(url)
                    return
                }
            }

            const { data: PFPdata, error: PFPerror } = await supabase.
                storage.
                from('destination-vurshets-bucket').
                createSignedUrl("userPFP/" + data.session.user.id + ".jpg", 60 * 60 * 24)

            if (PFPerror) {
                if (PFPerror?.message?.includes("Object not found") || PFPerror.statusCode === 400) {
                    setPfp('/assets/misc/default-user.png')
                    return
                }
                console.log("error fetching pfp:  " + PFPerror)
                return
            }

            localStorage.setItem("img_cache_" + data.session.user.id, JSON.stringify({
                url: PFPdata.signedUrl,
                expiry: Date.now() + 60 * 60 * 24 * 1000
            }))

            setPfp(PFPdata.signedUrl)

        } catch (err) {
            console.error("There was an error! :(   | " + err)
        }
    }

    async function PostOrEditReview() {
            const { data, error } = await supabase.
                from(id + '-reviews').
                upsert({
                    user_id: userId,
                    review: userReview,
                    review_desc: desc
                })
            setRefresh(Math.random())

            if (error) {
                console.log("error upsurting:  " + JSON.stringify(error, null, 2))
            }
    }

    async function RemoveReview() {
        const { data, error } = await supabase.from(id + '-reviews').delete().eq('user_id', userId)

        setRefresh(Math.random())
    }

    useEffect(() => {
        ref.current.scrollTop = 0
        if (id != null) {
            fetchImg()
            fetchReviews()
        }
    }, [id])

    useEffect(() => {
        fetchReviews()
    }, [Refresh])

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session != null) {
                setIsSignedIn(true)
                getUser()
            } else {
                setIsSignedIn(false)
            }
        })
    }, [id, Refresh])

    return (
        <div className="w-screen bg-white pt-[50px] pb-[150px] lg:pt-0 lg:pb-0 h-[calc(100vh-var(--navbar-height))] lg:w-[calc(100vw-var(--side-panel-width))] fixed right-0 bottom-0 flex justify-center -z-10" style={{ "--side-panel-width": "500px", "--navbar-height": "110px" }}>
            <div ref={ref} className="h-full w-full z-0 overflow-y-auto overflow-x-hidden relative">
                <div className="w-full min-h-[300px] flex flex-col space-y-5 md:space-y-0 lg:flex-col lg:space-y-5 xl:flex-row xl:space-y-0 md:flex-row items-center shadow-lg bg-gray-100">
                    <h1 className="w-full mt-[55px] md:mt-0 md:w-[calc(100vw-450px)] lg:w-full xl:w-[calc(100vw-var(--img-width))] line-clamp-4 font-oswald truncate text-5xl font-bold text-left text-wrap overflow-hidden px-5" style={{ "--img-width": "950px" }}>{t(locationName)}</h1>
                    <img src={img} className="w-[450px] h-[300px] right-0 object-cover flex-shrink-0" />
                </div>
                <h1 className="p-10 text-xl text-pretty indent-7 font-robotoMono">{t(locationDesc)}</h1>
                <Suspense fallback={PanoramicSkeleton}>
                    <div className="m-5 h-[600px] bg-gray-400 relative rounded-md shadow-lg">

                        <div onClick={() => { setIsUserTried3D(true) }} className={`text-white rounded-md text-3xl bg-black opacity-75 pt-[40px] cursor-pointer absolute h-[600px] w-full ${isUserTried3D ? "-z-50" : "z-50"}`}>
                            <div className="flex flex-row space-x-3 justify-center">
                                <img src="/assets/misc/double-small-arrow.png" className="rotate-180 w-[35px] h-[35px]" />
                                <h1>3D</h1>
                                <img src="/assets/misc/double-small-arrow.png" className="w-[35px] h-[35px]" />
                            </div>
                            <div className="w-full mt-[25px] absolute text-center">
                                <h1 className="text-lg text-gray-400">{t('ui.pressMe')}</h1>
                            </div>

                        </div>

                        <Canvas className="rounded-md" camera={{ position: [0, 0, 0.1], fov: 45 }}>
                            <OrbitControls reverseHorizontalOrbit reverseVerticalOrbit rotateSpeed={0.25} minPolarAngle={Math.PI / 2.095} maxPolarAngle={Math.PI / 1.915} enableZoom={false} />
                            <PanoramicViewer texture={texturePath} />
                        </Canvas>

                    </div>
                </Suspense>
                <div className="h-fit flex items-center justify-center gap-5 p-10">
                    <div onClick={() => { navigate('/') }} className="transition-transform ease-out duration-150 hover:scale-105 w-[140px] h-[45px] cursor-pointer rounded-lg text-white text-center flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                        <img src="/assets/misc/home.png" className="w-[25px] h-[25px] mx-[8px]" />
                        {t('ui.homePg')}
                    </div>
                    <a href={locationLink} target="_blank" rel="noopener noreferrer">
                        <div className="transition-transform ease-out duration-150 hover:scale-105 min-w-[140px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center bg-slate-900 pr-5 hover:bg-slate-700">
                            <img src="/assets/misc/map-with-marker.png" className="w-[25px] h-[25px] mx-[8px]" />
                            {t('ui.takeMeThere')}
                        </div>
                    </a>
                </div>
                <div className="m-5 min-h-[300px] bg-gray-300 rounded-md shadow-lg flex relative">

                    <div className={`h-full w-full rounded-md p-5 absolute bg-black bg-opacity-75 flex flex-col justify-center items-center space-y-5 ${isSignedIn ? "-z-50" : "z-10"}`}>
                        <h1 className="text-white text-xl">{t('ui.notSignedIn')}</h1>
                        <div onClick={() => { navigate('/signin') }} className="w-[100px] h-[45px] bg-slate-900 hover:bg-slate-700 hover:bg-opacity-100 rounded-lg cursor-pointer flex justify-center items-center text-white text-lg opacity-100 z-20 transition-transform ease-out duration-150 hover:scale-105">{t('profile.vlezVprofil')}</div>
                    </div>

                    <div className="w-full min-h-[250px] h-fit p-5 rounded-md shadow-lg bg-white m-5">
                        <div className="flex flex-col sm:flex-row space-x-5 space-y-5 sm:space-y-0">
                            <img src={pfp} className="bg-gray-300 object-cover w-[100px] h-[100px] rounded-full" />
                            <div className="w-full pr-5">
                                <h1 className="font-bold font-robotoMono text-lg">{username}</h1>
                                <div className="flex flex-row ml-2 text-gray-500">
                                    <h1 className="text-md font-robotoMono">{t('ui.otseni')}
                                        <input
                                            className="w-[50px] h-[25px] border shadow-lg rounded-md border-black text-center"
                                            placeholder="1-10"
                                            type="number"
                                            min={1}
                                            max={10}
                                            onInput={e => { setUserReview(e.target.value) }}
                                            value={userReview}
                                            onBlur={() => {
                                                if (userReview <= 1) setUserReview(1)
                                                if (userReview >= 10) setUserReview(10)
                                            }}
                                        />
                                        /10
                                    </h1>
                                    <img className="w-[25px] h-[25px] brightness-90 ml-[3px]" src="/assets/misc/star.png" />
                                </div>
                                <textarea
                                    className="w-full min-h-[100px] border border-black rounded-md shadow-lg mt-3 overflow-hidden resize-none"
                                    ref={textareaRef}
                                    onInput={e => {
                                        setDesc(e.target.value)
                                        textareaRef.current.style.height = "auto"
                                        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
                                    }}
                                    value={desc}
                                    placeholder={t('ui.type')}
                                />
                                <div className="flex sm:flex-row sm:space-y-0  flex-col items-center justify-center sm:justify-start space-y-5 sm:space-x-5">
                                    <div onClick={PostOrEditReview} className="bg-slate-900 w-[130px] h-[40px] text-white text-xl rounded-md text-center flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">
                                        {isUserReviewed ? t('ui.edit') : t('ui.publish')}
                                    </div>
                                    <div onClick={RemoveReview} className="bg-red-900 w-[130px] h-[40px] text-white text-xl rounded-md text-center flex items-center justify-center hover:bg-red-700 cursor-pointer transition-transform ease-out duration-150 hover:scale-105">{t('ui.delete')}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="m-5 p-5 h-[1000px] bg-gray-300 rounded-md shadow-lg flex flex-col space-y-5 overflow-y-auto">
                    <div className="w-full min-h-[75px] bg-white rounded-md shadow-sm flex sm:flex-row flex-col items-center p-5 space-x-1">
                        <div className="text-3xl text-gray-600 font-robotoMono ">{reviewAvg}/10</div>
                        <img className="w-[35px] h-[35px]" src="/assets/misc/star.png" />
                        <h1 className="pl-[15px] text-lg font-robotoMono text-center sm:text-left">{t('ui.review')}</h1>
                    </div>
                    {reviews}
                </div>
                <div className="bg-slate-900 w-full h-[110px] bottom-0 flex items-center pl-7 text-gray-400 text-md">
                    <h1>
                        {t('ui.createdBy')}
                    </h1>
                    <a href="https://github.com/TheHat1?tab=overview&from=2025-02-01&to=2025-02-26" target="_blank" rel="noopener noreferrer">
                        <div className="transition-transform ease-out duration-150 hover:scale-105 w-[140px] h-[45px] cursor-pointer rounded-lg text-white flex items-center justify-center pr-5 brightness-75 hover:brightness-50">
                            <img src="/assets/misc/githubLogo.png" className="w-[25px] h-[25px] mx-[8px]" />
                            TheHat1
                        </div>
                    </a>
                    <a href={authLink} target="_blank" rel="noopener noreferrer">
                        Линк към автор на снимката
                    </a>
                </div>
            </div>
        </div>
    )
}