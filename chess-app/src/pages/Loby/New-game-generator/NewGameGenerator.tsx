import { useState } from "react";
import {gameStore} from "../../../core/PageStores";
import { socket } from "../../../core/sockets";

const NewGameGenerator = () => {

    const setOnNewGame = gameStore((state) => state.setOnNewGame);
    const [nickNameInput, setNickNameInput] = useState('');
    const [PasswordInput, setPasswordInput] = useState('');
    
    function requestNewGame() {
        socket.emit('game-request', nickNameInput, PasswordInput);
        setNickNameInput('');
        setPasswordInput('');
        setOnNewGame(false);
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
                <button onClick={() => setOnNewGame(false)}>Cancel</button>
            </div>
        </div>
    )
}

export default NewGameGenerator;
