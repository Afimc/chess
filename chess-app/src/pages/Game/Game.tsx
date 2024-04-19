import { useEffect, useState } from "react"
import gameStore from "../../core/stores"
import './Game.scss'
import { socket } from "../../core/sockets"
import { mockedData } from "./mockedData";

const row =[0,1,2,3,4,5,6,7];
const cols =[0,1,2,3,4,5,6,7];



const Game = () => {
const startStopGame = gameStore((state) => state.startStopGame)

useEffect(()=>{
},[])

function exitGame(){
  socket.emit('exit', socket.id)
  startStopGame(false) 
}

function getPiece(y:number, x:number){
  const piece = mockedData[y][x]
  if(!piece) return null
  const color = piece?.piece._color === 0 ? 'W':'B'
  const type = piece?.piece._type

  return `${color}_${type}`
}

  return (

    <div className="game">

      <div className="gameInfo">
        <button onClick={exitGame}>Exit</button>  
      </div>
      <div className="bord">
        <div className="iner-board">
          {
            row.map((row,y)=>{
              return(
                <div className="row">
                  {
                    cols.map((col,x)=>{
                      return(
                        <div className="cell">{getPiece(y,x) || ''}</div>
                      )
                    })
                  }
                </div>
              )
            })
          }

        </div>
      </div>
       
    </div>
  )
}


export default Game
