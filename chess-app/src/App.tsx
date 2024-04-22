import { useEffect} from "react"
import {gameStore} from "./core/PageStores"
import './App.scss'
import Game from "./pages/Game/Game"
import Loby from './pages/Loby/Loby'
import { socket } from "./core/sockets"
import { IGameInfo, inGameStore } from "./core/inGameStore"



const App = () => {

  const inGame = gameStore((state: any) => state.inGame)
  const startStopGame = gameStore((state) => state.startStopGame)
  const setWaitingList = inGameStore((state) => state.setWaitingList)
  const setBoard = inGameStore((state) => state.setBoard)
  const setColor = inGameStore((state)=> state.setColor)
  const setOnTurn = inGameStore((state)=> state.setOnTurn)

  useEffect(() => {
    socket.on('new-waitingList', (list: IGameInfo[]) => {
      setWaitingList(list)
    });

    socket.on('game-mached', (isGamemached: boolean) => {
      startStopGame(isGamemached)
    });

    socket.on ('data-game',(data:any)=>{
      console.log(data)
      const color = socket.id===data.black ? 0 : 1
      const onTurn = socket.id===data.first?socket.id :null
      setOnTurn(onTurn)
      setColor(color)
      setBoard(data.inittialBord)
    })

    socket.on ('updated-grid',(data:any)=>{
      console.log(data.turns)
      const onTurn = data.turns%2 === 0 ? data.playerOne:data.playerTwo
      setOnTurn(onTurn)
      setBoard(data.updatedBoard)
      
    })



    socket.connect();
    socket.emit('request-waitingList');

    return () => {
      socket.disconnect()
      socket.off('updated-grid')
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
