import { useEffect, useState } from "react"
import gameStore from "./stores"
import './Game.scss'
const stopGame = gameStore((state) => state.stopGame)



const Game = () => {



  return (

    <div className="game">

      <div className="gameInfo">
        <button onClick={()=>stopGame(false)}>Exit</button>  
      </div>
      
      <div className="bord">

      </div>
       
    </div>
  )
}


export default Game
