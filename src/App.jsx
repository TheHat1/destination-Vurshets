import { Route, Routes } from "react-router-dom"
import Logo from "./assets/destination-vurshets-logo.png"
import Home from "./pages/Home.jsx"
import Map from "./Components/Map.jsx"

function App() {

  return (
    <>
      <div className="bg-slate-900 z-50 w-screen h-[110px] flex items-center justify-between fixed top-0">
        <img className="pl-[10px]" src={Logo}/>
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/map" element={<Map/>}/>
      </Routes>
    </>
  )
}

export default App
