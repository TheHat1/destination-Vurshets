import { useEffect, useState } from "react"
import Map from "src/Components/Map.jsx"
import cardsInfo from "src/assets/cards-info.json"
import LocationCard from "../Components/LocationCard"
import LocationViewer from "../Components/LocationViewer"
import { useParams } from "react-router-dom"


export default function HomePage(){
  const [locationCards, setLocationCards] = useState([
    cardsInfo.locations.map((locations)=>{
      return(
        <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
      )
    })
  ])
  const [inputValue, setInputValue] = useState()
  const [isLoadedLocation, setIsLoadedLocation] = useState(false)
  const {id} = useParams()

    useEffect(()=>{
      if(id == null){
        setIsLoadedLocation(false)
      }
      else{
        setIsLoadedLocation(true)
      }
    },[id])

    return(
        <>
        <div className="bg-white z-10 w-[500px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0 shadow-[5px_0_10px_rgba(0,0,0,0.2)]" style={{ "--navbar-height": "110px" }}>
          <div className=" w-full h-[50px] border border-gray-900">
            <input className="border-none w-full h-full" type="text" value={inputValue} onChange={(value1)=>{setInputValue(value1.target.value)}} placeholder="Търсене..."/>
          </div>
          {locationCards}
        </div>
        {isLoadedLocation ? <LocationViewer/> : <Map/>}
        </>
    )
}