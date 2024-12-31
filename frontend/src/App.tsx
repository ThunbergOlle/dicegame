import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Lobby from "./pages/lobby"

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>

  )
}
