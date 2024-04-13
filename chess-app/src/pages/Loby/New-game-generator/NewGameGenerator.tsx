import { useEffect, useState } from "react"
import gameStore from "../../../core/stores"
import { socket } from "../../../core/sockets"



const NewGameGenerator = () => {


    const gameID = gameStore((state)=> state.gameID)
    const updateID = gameStore((state) => state.updateID)
    const SetOnNewGame = gameStore((state) => state.SetOnNewGame)
    const startStopGame = gameStore((state) => state.startStopGame)
    const [nickNameInput, setNickNameInput] = useState('')
    const [PasswordInput, setPasswordInput] = useState('')
    



    function requestNewGame() {
        socket.emit('game-request', nickNameInput, PasswordInput);
        setNickNameInput('');
        setPasswordInput('');
        SetOnNewGame(false)
        socket.on('game-mached', (isGamemached: boolean) => {
   
            startStopGame(isGamemached)
        })
    }
   
   

    return (

        <div className="onNewGame">
            <div className="inputs">
                <input id='NickNameInput' type="text" value={nickNameInput} onChange={(event) => setNickNameInput(event.target.value)} placeholder='Username'></input>
                <input id='PasswordInput' type="text" value={PasswordInput} onChange={(event) => setPasswordInput(event.target.value)} placeholder='Password'></input>
            </div>
            <div className="buttons">
                <button onClick={() => {
                    requestNewGame()
                    }
                }>Create</button>
                <button onClick={() => SetOnNewGame(false)}>Cancel</button>
            </div>
        </div>



    )
}


export default NewGameGenerator
