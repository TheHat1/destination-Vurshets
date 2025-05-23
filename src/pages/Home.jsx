import { useEffect, useState } from "react"
import Map from "src/Components/Map.jsx"
import cardsInfo from "src/assets/cards-info.json"
import nearLocations from "src/assets/locations-near.json"
import LocationCard from "../Components/LocationCard"
import LocationViewer from "../Components/LocationViewer"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"

export default function HomePage() {
  const locations = cardsInfo.locations
  const locationsNear = nearLocations.locations
  const [isDesktopFormat, setIsDesktopFormat] = useState(window.innerHeight >= 1024)
  const [inTownLocationCards, setInTownLocationCards] = useState([])
  const [outsideTownLocations, setOutsideTownLocations] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [debouncedInputValue, setDebouncedInputValue] = useState("")
  const [isLoadedLocation, setIsLoadedLocation] = useState(false)
  const { id } = useParams()
  const { t, i18n } = useTranslation()

  //checks if the screen is below 1024px and updates the isDesktopFormat state
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsDesktopFormat(true)
    } else {
      setIsDesktopFormat(false)
    }
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsDesktopFormat(true)
      } else {
        setIsDesktopFormat(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  })

  //triggered by the change of the isDesktopFormat state and rerenders the location cards
  useEffect(() => {
    setInTownLocationCards([
      locations.map((locations) => {
        return (
          <LocationCard id={locations.id} imagePath={locations.imagePath} locationNameAndDesc={locations.locationNameAndDesc} />
        )
      })
    ])
    setOutsideTownLocations([
      locationsNear.map((locations) => {
        return (
          <LocationCard id={locations.id} imagePath={locations.imagePath} locationNameAndDesc={locations.locationNameAndDesc} />
        )
      })
    ])
  }, [isDesktopFormat])

  //when a card or pin adds a location id to the adress this is triggered and the locationViewer is loaded
  useEffect(() => {
    if (id == null) {
      setIsLoadedLocation(false)
    }
    else {
      setIsLoadedLocation(true)
    }
  }, [id])

  //search logic and card update after the jsons are filtered
  //debouncing the input value to lower api calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue)
    }, 300)
  }, [inputValue])

  useEffect(() => {
    let searchInput = inputValue.toString().toLowerCase().replaceAll(' ', '')
    let searchResultTown
    let serchResultOutsideTown
    if (inputValue != "") {
      searchResultTown = locations.filter((e) => { return t('locationNames.' + e.locationNameAndDesc).toString().toLowerCase().replaceAll(' ', '').includes(searchInput) })
      serchResultOutsideTown = locationsNear.filter((e) => { return t('locationNames.' + e.locationNameAndDesc).toString().toLowerCase().replaceAll(' ', '').includes(searchInput) })
      setInTownLocationCards(searchResultTown.map(
        (locations) => {
          return (
            <LocationCard key={locations.id} id={locations.id} imagePath={locations.imagePath} locationNameAndDesc={locations.locationNameAndDesc} />
          )
        })
      )
      setOutsideTownLocations(serchResultOutsideTown.map(
        (locations) => {
          return (
            <LocationCard key={locations.id} id={locations.id} imagePath={locations.imagePath} locationNameAndDesc={locations.locationNameAndDesc} />
          )
        })
      )
    } else {
      searchResultTown = locations
      serchResultOutsideTown = locationsNear
      setInputValue(" ")
    }

  }, [debouncedInputValue])

  return (
    <>
    <Helmet>
      <title>Destination Vurshets | Дестинация Вършец</title>
      <meta property="og:title" content="Home page | Начална страница"/>
      <meta property="og:description" content="Home page of Destination vurshets, a turist site focused to give the tourist of Vurshets an easy way to tour the town."/>
      <meta property="og:Description" content="Началната страница на Дестинация Вършец, туристически сайт, който има за цел да улесни туристите на града с техните обиколки."/>
    </Helmet>
      <div className="mt-[110px] w-screen lg:w-[500px] h-[50px] border border-gray-900 fixed z-50">
        <input className="border-none w-full h-full pl-5" type="text" onChange={value1 => { setInputValue(value1.target.value) }} placeholder={t('ui.search')} />
      </div>
      {isDesktopFormat ?
        <div className="bg-white z-10 w-[500px] h-[calc(100vh-var(--navbar-height))] fixed bottom-0 shadow-[5px_0_10px_rgba(0,0,0,0.2)] overflow-y-auto overflow-x-hidden" style={{ "--navbar-height": "160px" }}>
          <div className="w-full h-[25px] bg-slate-900 text-white sticky top-0 z-40 pl-4 font-bold shadow-lg">{t('ui.list')}</div>
          {inTownLocationCards}
          <div className="w-full h-[25px] bg-slate-900 text-white sticky top-0 z-40 pl-4 font-bold shadow-lg">{t('ui.listNear')}</div>
          {outsideTownLocations}
        </div>
        :
        <div className="bg-white w-screen h-[150px] bottom-0 fixed overflow-y-hidden overflow-x-auto flex shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
          {inTownLocationCards}
          {outsideTownLocations}
        </div>
      }
      {isLoadedLocation ? <LocationViewer /> : <Map />}
    </>
  )
}