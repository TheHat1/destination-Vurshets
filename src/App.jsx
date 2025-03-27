import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Error from "./pages/Error.jsx"
import Signup from "./pages/Signup.jsx"
import Signin from "./pages/Signin.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import ResetPasswordStep2 from "./pages/ResetPasswordStep2.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import LocationCard from "./Components/LocationCard.jsx"
import locationsNear from "./assets/locations-near.json"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import supabase from "./backend/supabase.js"

function App() {
  const navigate = useNavigate()
  const divRef = useRef()
  const buttonRef = useRef()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logo, setLogo] = useState("/assets/misc/destination-vurshets-logo.png")
  const locations = locationsNear.locations
  const {t, i18n} = useTranslation()
  const [isLangBG, setIsLangBG] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState('/signin')
  const [locationCards, setLocationCards] = useState([
    locations.map((locations)=>{
      return(
        <LocationCard id={locations.id} imagePath={locations.imagePath} locationNameAndDesc={locations.locationNameAndDesc}/>
      )
    })
  ])

  useEffect(()=>{
    if(window.innerWidth <= 540){
      setIsMobile(true)
    }else{
      setIsMobile(false)
    }
    function handleResize(){
      if(window.innerWidth <= 540){
        setIsMobile(true)
      }else{
        setIsMobile(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return()=> window.removeEventListener("resize", handleResize)
  })

  function handleChangeLang(){
    if(i18n.language == "bg"){
      i18n.changeLanguage("en")
      setIsLangBG(false)
      setLogo("/assets/misc/destination-vurshets-en.png")
    }else{
      i18n.changeLanguage("bg")
      setIsLangBG(true)
      setLogo("/assets/misc/destination-vurshets-logo.png")
    }
  }

  function handleClickOutsideList(e){
    if(divRef.current && !divRef.current.contains(e.target) && !buttonRef.current.contains(e.target)){
      setIsMenuOpen(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutsideList)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            setIsSignedIn('/profile')
        } else if (event === 'SIGNED_OUT') {
          setIsSignedIn('/signin')  
        }
    })
  }, [])

  return (
    <>
    {isMobile ? 
      <div className="bg-slate-900 z-50 w-screen h-[110px] flex space-x-5  items-center justify-end fixed top-0">
        <img onClick={()=>{navigate('/')}} className="-left-5 cursor-pointer absolute scale-75" src={logo}/>
        <div onClick={handleChangeLang} className="text-white text-xl cursor-pointer absolute right-28">
        {isLangBG ? <img className="w-[30px] h-[30px] hover:brightness-75" src="/assets/misc/united-kingdom.png"/> : <img className="w-[34px] h-[34px] hover:brightness-75" src="/assets/misc/bulgaria.png"/>}
        </div>
        <div ref={buttonRef} className="w-[50px] h-[25px] right-10 cursor-pointer hover:brightness-50 relative scale-150" onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
          <img src="/assets/misc/down-arrow.png" className={`absolute w-[25px] h-[25px] scale-100 left-0 transition-transform ease-out duration-200 ${isMenuOpen ? "rotate-180":"rotate-0"}`}/>
        </div>
        <div className="w-[35px] h-[35px] hover:brightness-75 cursor-pointer right-5 absolute" onClick={()=>{navigate(isSignedIn)}}>
          <img className="w-full h-full" src="/assets/misc/profile-icon.png"/>
        </div>
      </div>
      :
      <div className="bg-slate-900 z-50 w-screen h-[110px] flex space-x-3 items-center justify-end fixed top-0 pr-5">
        <img onClick={()=>{navigate('/')}} className="pl-[10px] cursor-pointer absolute left-0 transition-transform ease-out duration-150 hover:scale-105" src={logo}/>
        <div onClick={handleChangeLang} className="text-white text-xl cursor-pointer">
          {isLangBG ? <img className="w-[30px] h-[30px] hover:brightness-50  transition-transform ease-out duration-150 hover:scale-125" src="/assets/misc/united-kingdom.png"/> : <img className="w-[34px] h-[34px] hover:brightness-50  transition-transform ease-out duration-150 hover:scale-125" src="/assets/misc/bulgaria.png"/>}
        </div>
        <div ref={buttonRef} className="w-[130px] h-[25px] right-0 cursor-pointer hover:brightness-50 relative transition-transform ease-out duration-150 hover:scale-110" onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
          <img src="/assets/misc/down-arrow.png" className={`absolute w-[25px] h-[25px] scale-100 left-0 transition-transform ease-out duration-200 ${isMenuOpen ? "rotate-180":"rotate-0"}`}/>
          <p className="text-white text-lg indent-[30px] absolute">{t('ui.near')}</p>
        </div>
        <div className=" w-[35px] h-[35px] mr-[14px] hover:brightness-75 cursor-pointer transition-transform ease-out duration-150 hover:scale-125" onClick={()=>{navigate(isSignedIn)}}>
          <img className="w-full h-full" src="/assets/misc/profile-icon.png"/>
        </div>
      </div>
    }

      <div ref={divRef} onClick={()=>{setIsMenuOpen(false)}} className={`absolute overflow-hidden overflow-y-scroll right-0 top-0 w-[500px] h-[600px] bg-white z-30 transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-y-[160px] lg:translate-y-[110px]" : "-translate-y-[600px] pointer-events-none"}`}
      >
        {locationCards}
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:id" element={<Home/>}/>
        <Route path="*" element={<Error/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/resetpassword" element={<ResetPassword/>}/>
        <Route path="/resetpasswordstep2" element={<ResetPasswordStep2/>}/>
      </Routes>
    </>
  )
}

export default App
