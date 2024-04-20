import { useEffect, useState } from "react"
import {gameStore,Iposition} from "../../core/stores"
import './Game.scss'
import { socket } from "../../core/sockets"
import { mockedData } from "./mockedData";

const row =[0,1,2,3,4,5,6,7];
const cols =[0,1,2,3,4,5,6,7];



const Game = () => {
const startStopGame = gameStore((state) => state.startStopGame)
const [posiblePositions, setPosiblePositions] = useState<{x:number,y:number}[]>([])
const [ableToTrack, setAbleToTrack] = useState(false)
const [fromPosition, setFromPosition] = useState<Iposition>()
const [toPosition, setToPosition] = useState<Iposition>()

useEffect(()=>{
},[])

function exitGame(){
  socket.emit('exit', socket.id)
  startStopGame(false) 
}

function getPosiblePositions(y:number,x:number){
  const posiblePosition = mockedData[y][x]?.posiblePositions || [] ;
  setPosiblePositions(posiblePosition)
}

function getPiece(y:number, x:number){
  const piece = mockedData[y][x]
  if(!piece) return null
  const color = piece?.piece._color === 0 ? 'W':'B'
  const type = piece?.piece._type

  return `${color}_${type}`
}

function trackMouse(event:any){
  if(ableToTrack){
    const positions= []
    const position={
      x:0,
      y:0
    }
    const initialX = 372
    const initialY =98
    const cellSize =74
    const x = Math.floor((event.clientX -initialX) / cellSize)
    const y = Math.floor((event.clientY - initialY) / cellSize)
    position.x=x 
    position.y=y
    positions.push(position)
   
      
    


  }

  function sendMoveData(){
    const moveData ={
      fromPosition:{x:0,y:0},
      toPosition: {x:0,y:0}
    }
    socket.emit('move',moveData)
  }
     
}

  return (
    <div className="game">

      <div className="gameInfo">
        <button onClick={exitGame}>Exit</button>  
      </div>
      <div className="bord">
        <div className="iner-board" 
        onMouseDown={()=>{setAbleToTrack(true) }}
        onMouseUp={()=>{setAbleToTrack(false)}}
        onMouseMove={(event)=>trackMouse(event)}
        >
          {
            row.map((row,y)=>{
              return(
                <div className="row">
                  {
                    cols.map((col,x)=>{
                      return(
                        <>
                        <div 
                        className="cell" 
                        style={{cursor:getPiece(y,x)?"move":"unset"}}
                        onMouseDown={()=>{getPosiblePositions(row,col) }}
                        onMouseUp={()=>{setPosiblePositions([])}}
                        > 
                          <img src={`${getPiece(y,x)}.png` || ''} alt="" />
                      
                        <div className="posiblePositions" 
                        style={{border:posiblePositions.find((pos)=>pos.x === col && pos.y === row) ? "2px solid green" : ""}}>
                        
                        </div>
                        </div>
                     
                        </>
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
