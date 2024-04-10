import { useEffect, useState } from "react"
import gameStore from "./stores"
import { socket } from "./sockets"
import './Loby.scss'




const Loby = () => {


    interface IGames {
        nickName: string,
        password: string,
        isLoocked: boolean,
    }


    const startGame = gameStore((state) => state.startGame)
    const [waitingList, setWaitingList] = useState([] as IGames[])
    const [nickNameInput, setNickNameInput] = useState('')
    const [PasswordInput, setPasswordInput] = useState('')
    const [OnNewGame, setOnNewGame] = useState(false)


    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.on('new-waitingList', (list) => {
            setWaitingList(list)
        })

        return () => {
            socket.off('new-waitingList')
        }
    }, [waitingList])

    function requestNewGame() {
        socket.emit('game-request', nickNameInput, PasswordInput);
        setNickNameInput('');
        setPasswordInput('');
        setOnNewGame(false)

    }


    return (

        <>
            {
                !OnNewGame
                    ? <div className="Loby">

                        <div className="buttons">
                            <button onClick={() => setOnNewGame(true)}>New Game</button>
                        </div>
                        <div className="waitingList">
                            <ol>
                                {
                                    waitingList.map((x: IGames, i: number) => {
                                        return <li key={i}>{x.nickName}</li>
                                    })
                                }

                            </ol>
                        </div>
                    </div>
                    : <div className="onNewGame">
                        <div className="inputs">
                            <input id='NickNameInput' type="text" value={nickNameInput} onChange={(event) => setNickNameInput(event.target.value)} placeholder='Username'></input>
                            <input id='PasswordInput' type="text" value={PasswordInput} onChange={(event) => setPasswordInput(event.target.value)} placeholder='Password'></input>

                        </div>
                        <div className="buttons">
                            <button onClick={() => {
                                requestNewGame()
                                startGame(true)
                            }
                            }>Create
                            </button>
                            <button onClick={() => setOnNewGame(false)}>Cancel</button>
                        </div>



                    </div>


            }


        </>






    )
}


export default Loby




// {/* <input id='NickNameInput' type="text" value={nickNameInput} onChange={(event) => setNickNameInput(event.target.value)} placeholder='Username'></input> */}
// {/* <button onClick={() => startGame()}>Random Game</button> */}