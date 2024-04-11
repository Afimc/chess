import { useEffect, useState } from "react"
import gameStore from "../../../core/stores"
import { socket } from "../../../core/sockets"






const ChooseGame = () => {


    interface IGameInfo { 
        nickName: string; 
        isLocked: boolean; 
        id: string;
    }

    const startStopGame = gameStore((state) => state.startStopGame)
    const SetOnNewGame = gameStore((state) => state.SetOnNewGame)
    const [waitingList, setWaitingList] = useState([] as IGameInfo[])

    useEffect(() => {
     socket.emit('request-waitingList')
    }, [])

    useEffect(() => {
        socket.on('new-waitingList', (list:IGameInfo[]) => {
            setWaitingList(list)
        });
       
        return () => {
            socket.off('new-waitingList')
        }
    }, [waitingList])


    function gameRequest(gameName:string){
        socket.emit('game-enter', 'ArtificialPlayer',gameName)
        socket.on('game-mached',(isGamemached:boolean) => {
            startStopGame(isGamemached)
        })

        
    }



    return (

        <div className="Loby">

                        <div className="buttons">
                            <button onClick={() => SetOnNewGame(true)}>New Game</button>
                        </div>
                        <div className="waitingList">
                            <ol>
                                {
                                    waitingList.map((x, i) => {
                                        return <li key={i}>
                                            {x.nickName} {x.isLocked?'locked':'free'}
                                            <button id='EnterButton' onClick={() => gameRequest(x.nickName)}>Enter</button>
                                            </li>
                                    })
                                }

                            </ol>
                        </div>
                    </div>

    )
}


export default ChooseGame
