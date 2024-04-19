import { useEffect} from "react"
import gameStore, { IGameInfo } from "./core/stores"
import './App.scss'
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import { socket } from "./core/sockets"



const App = () => {

  const inGame = gameStore((state: any) => state.inGame)
  const startStopGame = gameStore((state) => state.startStopGame)
  const setWaitingList = gameStore((state) => state.setWaitingList)

  useEffect(() => {
    socket.on('new-waitingList', (list: IGameInfo[]) => {
      setWaitingList(list)
    });

    socket.on('game-mached', (isGamemached: boolean) => {
      startStopGame(isGamemached)
    });

    socket.on ('data-game',(data:any)=>{
      
    })



    socket.connect();
    socket.emit('request-waitingList');

    return () => {
      socket.disconnect()
      socket.off('data-game')
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
