import { useEffect} from "react"
import {gameStore} from "./core/PageStores"
import './App.scss'
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import { socket } from "./core/sockets"
import { updatedDataStore } from "./core/InGameStore"
import { IGameInfo, IUpdatedData } from "./core/Interfaces"

const App = () => {
  const inGame = gameStore((state) => state.inGame)
  const startStopGame = gameStore((state) => state.startStopGame)
  const setWaitingList = updatedDataStore((state) => state.setWaitingList)
  const setBoard = updatedDataStore((state) => state.setBoard)
  const setColor = updatedDataStore((state)=> state.setColor)
  const setTurns = updatedDataStore((state)=>state.setTurns)
  const setHistory = updatedDataStore((state)=>state.setHistory)

  useEffect(() => {
    socket.on('new-waitingList', (list: IGameInfo[]) => {
      setWaitingList(list)
    });

    socket.on('game-mached', (isGamemached: boolean) => {
      startStopGame(isGamemached)
    });

    // socket.on ('data-game',(data:any)=>{
    //   const color = socket.id===data.white ? 1 : 0
    //   setColor(color)
    //   setBoard(data.inittialBord)
    // })

    socket.on ('updated-data',(data:IUpdatedData)=>{
      // const _onTurn = data.turns % 2 === 0 ? 1 : 0
      // setOnTurn(_onTurn)
      const color = socket.id===data.white ? 1 : 0
      setTurns(data.turns)
      setColor(color)
      setHistory(data.history)
      setBoard(data.updatedBoard)
    })
    socket.connect();
    socket.emit('request-waitingList');

    return () => {
      socket.disconnect()
      socket.off('updated-data')
      // socket.off('data-game')
      socket.off('game-mached')
      socket.off('new-waitingList')
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
