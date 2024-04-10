import { useEffect, useState } from "react"
import gameStore from "./stores"
import './App.scss'
import Game from "./Game"
import Loby from './Loby'



const App = () => {

  const inGame = gameStore((state: any) => state.inGame)



  

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
