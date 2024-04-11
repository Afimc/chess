import { useEffect, useState } from "react"
import gameStore from "../../core/stores"
import './Game.scss'
import { socket } from "../../core/sockets"




const Game = () => {
const startStopGame = gameStore((state) => state.startStopGame)

function exitGame(){
  socket.emit('exit', socket.id)
  startStopGame(false)
}



  return (

    <div className="game">

      <div className="gameInfo">
        <button onClick={exitGame}>Exit</button>  
      </div>
      
      <div className="bord">

      </div>
       
    </div>
  )
}


export default Game
