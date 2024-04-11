import { useEffect, useState } from "react"
import gameStore from "../../core/stores"
import { socket } from "../../core/sockets"
import './Loby.scss'
import NewGameGenerator from "./New-game-generator/NewGameGenerator"
import ChooseGame from "./Chooose-game/ChooseGame"




const Loby = () => {


    interface IGameInfo { 
        nickName: string; 
        isLocked: boolean; 
        id: string;
    }

    const OnNewGame = gameStore((state) => state.OnNewGame)
    const [waitingList, setWaitingList] = useState([] as IGameInfo[])



    useEffect(() => {
     socket.emit('request-waitingList')
    }, [])

    useEffect(() => {
        socket.on('new-waitingList', (list:IGameInfo[]) => {
            setWaitingList(list)
            console.log(list)
        })

        return () => {
            socket.off('new-waitingList')
        }
    }, [waitingList])

    return (

        <>
            {
                OnNewGame
                    ? <ChooseGame />
                    : <NewGameGenerator />


            }


        </>






    )
}


export default Loby




// {/* <input id='NickNameInput' type="text" value={nickNameInput} onChange={(event) => setNickNameInput(event.target.value)} placeholder='Username'></input> */}
// {/* <button onClick={() => startGame()}>Random Game</button> */}