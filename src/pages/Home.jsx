import { useEffect, useState } from "react"
import Map from "src/Components/Map.jsx"
import cardsInfo from "src/assets/cards-info.json"
import LocationCard from "../Components/LocationCard"
import LocationViewer from "../Components/LocationViewer"
import { useParams } from "react-router-dom"


export default function HomePage(){
  const locations = cardsInfo.locations
  const [locationCards, setLocationCards] = useState([
    locations.map((locations)=>{
      return(
        <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
      )
    })
  ])
  const [inputValue, setInputValue] = useState("")
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

    useEffect(()=>{
      let searchInput = inputValue.toString().toLowerCase().replaceAll(' ','')
      let searchResult
      if(inputValue != ""){
        searchResult = locations.filter((e)=>{return e.locationName.toString().toLowerCase().replaceAll(' ','').includes(searchInput)})
        setLocationCards(searchResult.map(
          (locations)=>{
            return(
              <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
            )
          })
        )
      }else{
        searchResult = locations
        setInputValue(" ")
      }

    }, [inputValue])

    return(
        <>
        <div className="mt-[110px] w-[500px] h-[50px] border border-gray-900 fixed z-50 ">
           <input className="border-none w-full h-full" type="text"  onChange={value1=>{setInputValue(value1.target.value)}} placeholder="Търсене..."/>
        </div>
        <div className="bg-white z-10 w-[500px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0 shadow-[5px_0_10px_rgba(0,0,0,0.2)] overflow-y-auto overflow-x-hidden" style={{ "--navbar-height": "160px" }}>

          {locationCards}
        </div>
        {isLoadedLocation ? <LocationViewer/> : <Map/>}
        </>
    )
}