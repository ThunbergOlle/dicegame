import { Routes, Route } from "react-router-dom"
import Game from "./pages/game"
import Home from "./pages/home"

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>

  )
}
