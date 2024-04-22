import { useEffect, useState } from "react"
import { gameStore } from "../../core/PageStores"
import './Game.scss'
import { socket } from "../../core/sockets"
import { IRow, Iposition, inGameStore } from "../../core/inGameStore";


const Game = () => {
  const startStopGame = gameStore((state) => state.startStopGame)
  const [posiblePositions, setPosiblePositions] = useState<Iposition[]>([])
  const [ableToTrack, setAbleToTrack] = useState(false)
  const [currentMovePosition, setCurrentMovePosition] = useState<Iposition | null>()
  const [movingImg, setMovingImg] = useState<string | null>()
  const [fromPosition, setFromPosition] = useState<Iposition>()
  const [toPosition, setToPosition] = useState<Iposition>()
  const currentBoard = inGameStore((state)=>state.board)
  const playerColor = inGameStore((state) => state.playerColor)
  const onTurn = inGameStore((state) => state.onTurn)
  const setOnTurn = inGameStore((state) => state.setOnTurn)


  useEffect(() => {
  
  }, [])

  function exitGame() {
    socket.emit('exit', socket.id)
    startStopGame(false)
  }

  function getPiece(y: number, x: number) {
    const piece = currentBoard[y][x]
    if (!piece) return null
    const color = piece?.piece._color === 0 ? 'W' : 'B'
    const type = piece?.piece._type
    return `${color}_${type}`
  }

  function onMouseDown(y: number, x: number) {
    const posiblePosition:Iposition[] = currentBoard[y][x]?.posiblePositions || [];
    const _movingImg:string|null = getPiece(y, x)

    setPosiblePositions(posiblePosition)
    setMovingImg(_movingImg)
    setAbleToTrack(true)
    setFromPosition({ x, y })
  }
console.log(onTurn)
  function onMouseUp() {
    if(ableToTrack){
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

  function sendMoveRequest(){
    const DataMove={fromPosition,toPosition}
    socket.emit('move',DataMove)
  }

  return (
    <div className="game" onMouseUp={() =>onMouseUp() }>
      <div className="gameInfo">
        <button onClick={exitGame}>Exit</button>
      </div>
      <div className="bord">
        <div className="iner-board"
        >
          {
            !currentBoard ? null :
            currentBoard.map((row:IRow[], y:number) => {
              return (
                <div className="row" >
                  {
                    row.map((_col:IRow, x:number) => {
                      return (
                        <>
                          <div
                            className="cell"
                            style={{ cursor: getPiece(y, x) ? "move" : "unset" }}
                            onMouseDown={() => {playerColor===currentBoard[y][x]?.piece._color && onTurn===socket.id? onMouseDown(y, x) : null}}
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
                              :null
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
        </div>
      </div>
    </div>
  )
}


export default Game
