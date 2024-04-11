import { useEffect, useState } from "react"
import gameStore from "./core/stores"
import './App.scss'
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import { socket } from "./core/sockets"



const App = () => {

  const inGame = gameStore((state: any) => state.inGame)



  
  useEffect(() => {
    socket.connect()
    return () => {
        socket.disconnect()
    }
}, [])



  

  return (

    <>
      {
        !inGame
          ? <Loby />
          : <Game />
      }

    </>

  )
}


export default App
