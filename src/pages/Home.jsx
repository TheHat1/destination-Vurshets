import { useEffect, useState } from "react"
import Map from "src/Components/Map.jsx"
import cardsInfo from "src/assets/cards-info.json"
import nearLocations from "src/assets/locations-near.json"
import LocationCard from "../Components/LocationCard"
import LocationViewer from "../Components/LocationViewer"
import { useParams } from "react-router-dom"


export default function HomePage(){
  const locations = cardsInfo.locations
  const locationsNear = nearLocations.locations
  const [isDesktopFormat, setIsDesktopFormat] = useState(window.innerHeight >= 1024)
  const [inTownLocationCards, setInTownLocationCards] = useState([])
  const [outsideTownLocations, setOutsideTownLocations] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoadedLocation, setIsLoadedLocation] = useState(false)
  const {id} = useParams()

    //checks if the screen is below 1024px and updates the isDesktopFormat state
    useEffect(()=>{
      if(window.innerWidth >= 1024){
        setIsDesktopFormat(true)
      }else{
        setIsDesktopFormat(false)
      }
      function handleResize(){
        if(window.innerWidth >= 1024){
          setIsDesktopFormat(true)
        }else{
          setIsDesktopFormat(false)
        }
      }
      window.addEventListener("resize", handleResize)
      return()=> window.removeEventListener("resize", handleResize)
    })
    
    //triggered by the change of the isDesktopFormat state and rerenders the location cards
    useEffect(()=>{
      setInTownLocationCards([
        locations.map((locations)=>{
          return(
            <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
          )
        })
      ])
      setOutsideTownLocations([
        locationsNear.map((locations)=>{
          return(
            <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
          )
        })
      ])
    }, [isDesktopFormat])
    
    //when a card or pin adds a location id to the adress this is triggered and the locationViewer is loaded
    useEffect(()=>{
      if(id == null){
        setIsLoadedLocation(false)
      }
      else{
        setIsLoadedLocation(true)
      }
    },[id])

    //search logic and card update after the jsons are filtered
    useEffect(()=>{
      let searchInput = inputValue.toString().toLowerCase().replaceAll(' ','')
      let searchResultTown
      let serchResultOutsideTown
      if(inputValue != ""){
        searchResultTown = locations.filter((e)=>{return e.locationName.toString().toLowerCase().replaceAll(' ','').includes(searchInput)})
        serchResultOutsideTown = locationsNear.filter((e)=>{return e.locationName.toString().toLowerCase().replaceAll(' ','').includes(searchInput)})
        setInTownLocationCards(searchResultTown.map(
          (locations)=>{
            return(
              <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
            )
          })
        )
        setOutsideTownLocations(serchResultOutsideTown.map(
          (locations)=>{
            return(
              <LocationCard id={locations.id} imagePath={locations.imagePath} locationName={locations.locationName} locationDesc={locations.locationDesc}/>
            )
          })
        )
      }else{
        searchResultTown = locations
        serchResultOutsideTown = locationsNear
        setInputValue(" ")
      }

    }, [inputValue])

    return(
        <>
        <div className="mt-[110px] w-screen lg:w-[500px] h-[50px] border border-gray-900 fixed z-50 ">
           <input className="border-none w-full h-full" type="text"  onChange={value1=>{setInputValue(value1.target.value)}} placeholder="Търсене..."/>
        </div>
       {isDesktopFormat ? 
        <div className="bg-white z-10 w-[500px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0 shadow-[5px_0_10px_rgba(0,0,0,0.2)] overflow-y-auto overflow-x-hidden" style={{ "--navbar-height": "160px" }}>
            <div className="w-full h-[25px] bg-slate-900 text-white sticky top-0 z-40 pl-4 font-bold shadow-lg">Локации в града</div>
              {inTownLocationCards}
            <div className="w-full h-[25px] bg-slate-900 text-white sticky top-0 z-40 pl-4 font-bold shadow-lg">Локации извън града</div>
              {outsideTownLocations}
        </div>
       :
       <div className="bg-white w-screen h-[150px] bottom-0 fixed overflow-y-hidden overflow-x-auto flex shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
            {inTownLocationCards}
            {outsideTownLocations}
      </div>
      } 
        {isLoadedLocation ? <LocationViewer/> : <Map/>}
        </>
    )
}