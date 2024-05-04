import { useState } from "react"
import { updatedDataStore } from "../../../core/InGameStore";
import { EMIT, IPieceWithPositon, Iposition } from "../../../core/Interfaces";
import { socket } from "../../../core/sockets";
import Reborn from "./Reborn";


const InerBoard = () => {
  const currentBoard = updatedDataStore((state) => state.updatedBoard)
  const playerColor = updatedDataStore((state) => state.playerColor)
  const turns = updatedDataStore((state)=>state.turns)
  const graveyard = updatedDataStore((state)=>state.graveyard)
  
  const [posiblePositions, setPosiblePositions] = useState<Iposition[]>([])
  const [ableToTrack, setAbleToTrack] = useState(false)
  const [currentMovePosition, setCurrentMovePosition] = useState<Iposition | null>()
  const [movingImg, setMovingImg] = useState<string | null>()
  const [fromPosition, setFromPosition] = useState<Iposition>()
  const [toPosition, setToPosition] = useState<Iposition>()
  const [whitePiecesFromGraveyard,setWhitePiecesFromGraveyard] = useState<string[]>([])
  const [blackPiecesFromGraveyard,setBlackPiecesFromGraveyard] = useState<string[]>([])

  function IsonTurn(){
    const isOnTurn = turns % 2 === 0 ? 1 : 0
    return isOnTurn
  }

  function getPiece(y: number, x: number) {
    const pieceWithPosiblePositions = currentBoard[y][x]
    if (!pieceWithPosiblePositions) return null
    const color = pieceWithPosiblePositions?.piece._color === 1 ? 'W' : 'B'
    const type = pieceWithPosiblePositions?.piece._type
    return `${color}_${type}`
  }
  function getBlackGraveyard(){
    const blackPiecesFromGraveyard = graveyard.filter(piece=>piece._color===0).map((piece)=>{
      const color = piece?._color === 1 ? 'W' : 'B'
      const type = piece?._type
      return `${color}_${type}`
  })
  setBlackPiecesFromGraveyard(blackPiecesFromGraveyard)
  }

  function getWhiteGraveyard(){
    const whitePiecesFromGraveyard=graveyard.filter(piece=>piece._color===1).map((piece)=>{
        const color = piece?._color === 1 ? 'W' : 'B'
        const type = piece?._type
        return `${color}_${type}`
    })
    setWhitePiecesFromGraveyard(whitePiecesFromGraveyard)
  }

  function onMouseDown(y: number, x: number) {
    if (playerColor === currentBoard[y][x]?.piece._color && IsonTurn() === playerColor) {
      const posiblePosition: Iposition[] = currentBoard[y][x]?.posiblePositions || [];
      const _movingImg: string | null = getPiece(y, x)
      setPosiblePositions(posiblePosition)
      setMovingImg(_movingImg)
      setAbleToTrack(true)
      setFromPosition({ x, y })
    }
 }
  
 function onMouseUp() {
    if (ableToTrack) {
      setPosiblePositions([])
      setAbleToTrack(false)
      setCurrentMovePosition(null)
      setMovingImg(null)
      sendMoveRequest()
    }
  }


  function onCellMouseMove(y: number, x: number) {
    if (ableToTrack) {
      if (currentMovePosition?.x !== x || currentMovePosition?.y !== y) {
        setCurrentMovePosition({ x, y })
        setToPosition({ x, y })

      }
    }
  }
  
  function sendMoveRequest() {
    const dataMove = { fromPosition, toPosition }
    console.log({dataMove})
    socket.emit(EMIT.MOVE, dataMove)
  }


  return (
    

    <div className="iner-board" onMouseUp={() => onMouseUp()}>
    <Reborn  props = {toPosition}/>
    <div className="whiteGraveyard" onMouseLeave={()=>setWhitePiecesFromGraveyard([])} onMouseOver={()=>getWhiteGraveyard()}>
      { 
        whitePiecesFromGraveyard.map((piece)=>{
          return(
            <img id="whiteGraveyardImages" src={`piecesImages/${piece}.png` || ''} alt="" />
          )
        })
      }
      
    </div>
    {
      !currentBoard
        ? null
        : currentBoard.map((row: IPieceWithPositon[], y: number) => {
          return (
            <div className="row" >
              {
                row.map((_col: IPieceWithPositon, x: number) => {
                  return (
                    <>
                      <div 
                        className="cell"
                        style={{ cursor: getPiece(y, x) ? "move" : "unset" }}
                        onMouseDown={() => { onMouseDown(y, x) }}
                        onMouseMove={() => onCellMouseMove(y, x)}
                      >
                        <img src={`piecesImages/${getPiece(y, x)}.png` || ''} alt="" />
                        <div className="posiblePositions"
                          style={{ border: posiblePositions.find((pos) => pos.x === x && pos.y === y) ? "2px solid green" : "" }}>
                        </div>
                        {
                          currentMovePosition?.x === x && currentMovePosition?.y === y && posiblePositions.find((pos) => pos.x === x && pos.y == y) && movingImg
                            ? <div className="movingImgPositions">
                              <img src={`piecesImages/${movingImg}.png` || ''} alt="" />
                            </div>
                            : null
                        }
                      </div>
                    </>
                  )
                })
              }
            </div>
          )
        })
    }
    <div className="blackGraveyard" onMouseLeave={()=>setBlackPiecesFromGraveyard([])} onMouseOver={()=>getBlackGraveyard()} >
      {
        blackPiecesFromGraveyard.map((piece)=>{
          return(
            <img id="blackGraveyardImages" src={`piecesImages/${piece}.png` || ''} alt="" />
          )
        })
      }
    </div>  
  </div>
  )
}

export default InerBoard