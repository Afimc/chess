import { useEffect, useState } from "react"
import gameStore from "../../../core/stores"
import { socket } from "../../../core/sockets"


const ChooseGame = () => {


    interface IGameInfo {
        nickName: string;
        isLocked: boolean;
        id: string;
    }

    const [passwordInput, setPasswordInput] = useState('')
    const startStopGame = gameStore((state) => state.startStopGame)
    const SetOnNewGame = gameStore((state) => state.SetOnNewGame)
    const [waitingList, setWaitingList] = useState([] as IGameInfo[])
    const [isPassword, setIsPassword] = useState(false)
    const [gameId, setGameId] = useState('')

    useEffect(() => {
        socket.emit('request-waitingList')
    }, [])


    useEffect(() => {
        socket.on('new-waitingList', (list: IGameInfo[]) => {
            setWaitingList(list)
        });
        return () => {
            socket.off('new-waitingList')
        }
    }, [waitingList])

    
    function gameRequest(gameId: string, password:string) {
        socket.emit('game-enter', gameId,password)
        socket.on('game-mached', (isGamemached: boolean) => {
   
            startStopGame(isGamemached)
        })
    }


    return (
        <>
            {
                isPassword
                    ? <div className="inpas">
                        <input id='PasswordInput' type="text" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} placeholder='Password'></input>
                        <button onClick={()=>gameRequest(gameId, passwordInput)}>GO</button>
                    </div> 
                     
                    : <div className="Loby">
                        <div className="buttons">
                            <button onClick={() => SetOnNewGame(true)}>New Game</button>
                        </div>
                        <div className="waitingList">
                            <ol>
                                {
                                    waitingList.map((x, i) => {
                                        return <li key={i}>
                                            {x.nickName} {x.isLocked ? 'locked' : 'free'}
                                            <button id='EnterButton' onClick={() => {
                                                setGameId(x.id);
                                                !x.isLocked
                                                ? gameRequest(x.id, '')
                                                :setIsPassword(true) 
                                            }
                                            }>Enter</button>
                                        </li>
                                    })
                                }
                            </ol>
                        </div>
                    </div>
            }
        </>

    )
}


export default ChooseGame
