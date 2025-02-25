import { Route, Routes, useNavigate } from "react-router-dom"
import Logo from "/assets/destination-vurshets-logo.png"
import Home from "./pages/Home.jsx"
import LocationCard from "./Components/LocationCard.jsx"
import locationsNear from "./assets/locations-near.json"
import { useState } from "react"

function App() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const locations = locationsNear.locations
  const [locationCards, setLocationCards] = useState([
    locations.map((locations)=>{
      return(
        <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
      )
    })
  ])

  return (
    <>
      <div className="bg-slate-900 z-50 w-screen h-[110px] flex items-center justify-between fixed top-0">
        <img onClick={()=>{navigate('/')}} className="pl-[10px] cursor-pointer" src={Logo}/>
        <div className="w-[110px] h-[25px] right-0 mr-14 cursor-pointer hover:brightness-50" onClick={()=>{setIsMenuOpen(!isMenuOpen)}}>
          <img src="/assets/down-arrow.png" className={`w-[25px] h-[25px] fixed transition-transform ease-out duration-200 ${isMenuOpen ? "rotate-180":"rotate-0"}`}/>
          <p className="text-white text-lg text-right">В близост</p>
        </div>
      </div>
      <div className={`absolute overflow-hidden overflow-y-scroll right-0 top-0 w-[500px] h-[600px] bg-white z-30 transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-y-[110px]" : "-translate-y-[600px] pointer-events-none"}`}
      >
        {locationCards}
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:id" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
