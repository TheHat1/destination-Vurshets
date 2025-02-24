import { Route, Routes, useNavigate } from "react-router-dom"
import Logo from "/assets/destination-vurshets-logo.png"
import Home from "./pages/Home.jsx"

function App() {
  const navigate = useNavigate()

  return (
    <>
      <div className="bg-slate-900 z-50 w-screen h-[110px] flex items-center justify-between fixed top-0">
        <img onClick={()=>{navigate('/')}} className="pl-[10px] cursor-pointer" src={Logo}/>
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:id" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
