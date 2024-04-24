import { useEffect} from "react"
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import './App.scss'
import {gameStore} from "./core/PageStores"
import { socket } from "./core/sockets"
import { updatedDataStore } from "./core/InGameStore"
import { IGameInfo, IUpdatedData } from "./core/Interfaces"

const App = () => {
  const inGame = gameStore((state) => state.inGame)
  const info = updatedDataStore((state)=>state.info)
  const playerColor = updatedDataStore((state)=>state.playerColor)
  const startStopGame = gameStore((state) => state.startStopGame)
  const setWaitingList = updatedDataStore((state) => state.setWaitingList)
  const setUpdatedBoard = updatedDataStore((state) => state.setUpdatedBoard)
  const setPlayerColor = updatedDataStore((state)=> state.setPlayerColor)
  const setTurns = updatedDataStore((state)=>state.setTurns)
  const setHistory = updatedDataStore((state)=>state.setHistory)
  const setInfo = updatedDataStore((state)=>state.setInfo)
  

  useEffect(() => {
    socket.on('new-waitingList', (list: IGameInfo[]) => {
      setWaitingList(list)
    });

    socket.on('game-mached', (isGamemached: boolean) => {
      startStopGame(isGamemached)
    });

    socket.on('player-leave',(didPlayerLeave:Boolean)=>{
      startStopGame(!didPlayerLeave)
    })

    socket.on ('updated-data',(data:IUpdatedData)=>{
      const color = socket.id===data.whitePlayerId ? 1 : 0
      setInfo(data.info)
      setTurns(data.turns)
      console.log(info)
      playerColor===null? setPlayerColor(color):null
      setHistory(data.history)
      setUpdatedBoard(data.updatedBoard)
    })

    socket.connect();
    socket.emit('request-waitingList');

    return () => {
      socket.disconnect()
      socket.off('updated-data')
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
