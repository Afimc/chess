import { useEffect, useState } from "react"
import { gameStore } from "../../core/PageStores"
import './Game.scss'
import { socket } from "../../core/sockets"
import { updatedDataStore } from "../../core/InGameStore";
import { IHistoryTurn, IPiece, IPieceWithPositon, Iposition } from "../../core/Interfaces";

const Game = () => {
  const startStopGame = gameStore((state) => state.startStopGame)
  const onRebornRequest = gameStore((state)=>state.onRebornRequest)
  const currentBoard = updatedDataStore((state) => state.updatedBoard)
  const playerColor = updatedDataStore((state) => state.playerColor)
  const turns = updatedDataStore((state)=>state.turns)
  const history = updatedDataStore((state)=>state.history)
  const info = updatedDataStore((state)=>state.info)
  const graveyard = updatedDataStore((state)=>state.graveyard)
  const setOnRebornRequest = gameStore((state)=>state.setOnRebornRequest)


  const [posiblePositions, setPosiblePositions] = useState<Iposition[]>([])
  const [ableToTrack, setAbleToTrack] = useState(false)
  const [currentMovePosition, setCurrentMovePosition] = useState<Iposition | null>()
  const [movingImg, setMovingImg] = useState<string | null>()
  const [fromPosition, setFromPosition] = useState<Iposition>()
  const [toPosition, setToPosition] = useState<Iposition>()
  const [whitePiecesFromGraveyard,setWhitePiecesFromGraveyard] = useState<string[]>([])
  const [blackPiecesFromGraveyard,setBlackPiecesFromGraveyard] = useState<string[]>([])

  useEffect(() => {
  }, [])

  function exitGame() {
    socket.emit('exit', info.gameID)
    startStopGame(false)
  }

  function IsonTurn(){
    const isOnTurn = turns % 2 === 0 ? 1 : 0
    return isOnTurn
  }

  function getStringifyTurnHistory(turn:IHistoryTurn){
    const stringifyTurnHistory= `!!! on turn ${turn._turn} ${turn._pieceToMove} been moved from ${turn._fromPosition} 
    to ${turn._toPosition} . ${turn._pieceToKill !==null? `On this move ${turn._pieceToKill}been send to the graveyard .`:'.'}
    ${turn._pieceToResorect !==null? `${turn._pieceToMove}been sacrificed to resurrect ${turn._pieceToResorect}`:''}`
    return stringifyTurnHistory
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
    socket.emit('move', dataMove)
  }

  function sendPieceForReborn(color:number, type:string){
    socket.emit('piece-to-reborn',color, type)
    setOnRebornRequest(false)
  }


  return (

    <div className="game" onMouseUp={() => onMouseUp()}>
      <div className="gameInfo">
        <button onClick={()=>exitGame()}>Exit</button>
        <div className="onTurn">
          <p>{IsonTurn() === playerColor ? `you are on turn with ${playerColor === 1 ? 'White' : 'Black'}` : 'wait'}</p>
        </div>
        <div className="history">
          {
            history.map((turn:IHistoryTurn)=>{
              const stringifyTurnHistory = getStringifyTurnHistory(turn)
              return (
                <div className="turn">{stringifyTurnHistory}</div>
              )
            })
          } 
        </div>
      </div>
      <div className="bord">
        {
          onRebornRequest===false
          ?null
          :<div className="reborn">
            {
              graveyard.filter(piece=>piece._color===playerColor).map((piece:IPiece)=>{
                return (
                  <div className="pieceToReborn">
                    <img onMouseDown={()=>sendPieceForReborn(piece._color, piece._type)} 
                    src={`${piece?._color === 1 ? 'W' : 'B'}_${piece?._type}.png` || ''} alt="" >
                    </img>
                  </div>
                )
              })
            }
          </div>
        }
        <div className="iner-board">
          <div className="whiteGraveyard" onMouseLeave={()=>setWhitePiecesFromGraveyard([])} onMouseOver={()=>getWhiteGraveyard()}>
            { 
              whitePiecesFromGraveyard.map((piece)=>{
                return(
                  <img id="whiteGraveyardImages" src={`${piece}.png` || ''} alt="" />
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
                              <img src={`${getPiece(y, x)}.png` || ''} alt="" />
                              <div className="posiblePositions"
                                style={{ border: posiblePositions.find((pos) => pos.x === x && pos.y === y) ? "2px solid green" : "" }}>
                              </div>
                              {
                                currentMovePosition?.x === x && currentMovePosition?.y === y && posiblePositions.find((pos) => pos.x === x && pos.y == y) && movingImg
                                  ? <div className="movingImgPositions">
                                    <img src={`${movingImg}.png` || ''} alt="" />
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
                  <img id="blackGraveyardImages" src={`${piece}.png` || ''} alt="" />
                )
              })
            }
          </div>  
        </div>
      </div>
    </div>  
  )
}

export default Game
