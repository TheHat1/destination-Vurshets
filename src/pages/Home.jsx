import { useEffect, useState } from "react"
import Map from "src/Components/Map.jsx"
import cardsInfo from "src/assets/cards-info.json"
import LocationCard from "../Components/LocationCard"


export default function HomePage(){
  const [locationCards, setLocationCards] = useState([
    cardsInfo.locations.map((locations)=>{
      return(
        <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
      )
    })
  ])

    return(
        <>
        <div className="bg-white z-10 w-[500px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0" style={{ "--navbar-height": "110px" }}>
          {locationCards}
        </div>
        <Map/>
        </>
    )
}