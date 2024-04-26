import { useEffect} from "react"
import { socket } from "./core/sockets"
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import './App.scss'
import { gameStore } from "./core/PageStores"
import { updatedDataStore } from "./core/InGameStore"
import { IGameInfo, IUpdatedData } from "./core/Interfaces"

const App = () => {
  const inGame = gameStore((state) => state.inGame)
  const playerColor = updatedDataStore((state)=>state.playerColor)
  const info = updatedDataStore((state)=>state.info)
  const startStopGame = gameStore((state) => state.startStopGame)
  const setWaitingList = updatedDataStore((state) => state.setWaitingList)
  const setUpdatedBoard = updatedDataStore((state) => state.setUpdatedBoard)
  const setPlayerColor = updatedDataStore((state)=> state.setPlayerColor)
  const setTurns = updatedDataStore((state)=>state.setTurns)
  const setHistory = updatedDataStore((state)=>state.setHistory)
  const setInfo = updatedDataStore((state)=>state.setInfo)
  const setGraveyard = updatedDataStore((state)=>state.setGraveyard)
  

  useEffect(() => {
    socket.on('new-waitingList', (list: IGameInfo[]) => {
      setWaitingList(list)
    });

    socket.on('game-mached', (isGamemached: boolean) => {
      startStopGame(isGamemached)
    });

    socket.on('player-leave',(didPlayerLeave: Boolean)=>{
      startStopGame(!didPlayerLeave)
    })

    socket.on ('updated-data',(data:IUpdatedData)=>{
      const color = socket.id===data.whitePlayerId ? 1 : 0
      info.gameID ==='' ? setInfo(data.info) : null
      playerColor===null? setPlayerColor(color) : null
      setGraveyard(data.graveyard)
      setTurns(data.turns)
      setHistory(data.history)
      setUpdatedBoard(data.updatedBoard)
    })

    socket.connect();
    socket.emit('request-waitingList');

    return () => {
      socket.disconnect()
      socket.off('player-leave')
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
