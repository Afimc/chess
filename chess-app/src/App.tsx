import { useEffect, useState } from "react"
import gameStore from "./core/stores"
import './App.scss'
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import { socket } from "./core/sockets"



const App = () => {

  const inGame = gameStore((state: any) => state.inGame)
  const gameID = gameStore((state)=> state.gameID)
  const updateID = gameStore((state) => state.updateID)
  const startStopGame = gameStore((state) => state.startStopGame)


  
  useEffect(() => {
    socket.connect()
    socket.on('game-info',(newGameID:string)=>{
      console.log({a:newGameID})
      updateID(newGameID)
  })

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
