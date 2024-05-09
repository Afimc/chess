import "./NewGameGenerator.scss";
import { useState } from "react";
import { socket } from "../../../core/sockets";
import { gameStore } from "../../../core/PageStores";
import { EMIT } from "../../../core/Interfaces";

const NewGameGenerator = () => {
    const setOnNewGame = gameStore((state) => state.setOnNewGame);
    const [nickNameInput, setNickNameInput] = useState('');
    const [PasswordInput, setPasswordInput] = useState('');
    const [gameNameInput, setGameNameInput] = useState('');

    function requestNewGame() {
        socket.emit(EMIT.GAMEREQUEST, nickNameInput, PasswordInput, gameNameInput);
        setNickNameInput('');
        setPasswordInput('');
        setOnNewGame(false);
    }

    return (
        <div className="onNewGame">
            <div className="inputs">
                <input
                    id='NickNameInput'
                    type="text"
                    value={nickNameInput}
                    onChange={(event) => setNickNameInput(event.target.value)}
                    placeholder='Username'
                />
                <input
                    id='GameNameInput'
                    type="text"
                    value={gameNameInput}
                    onChange={(event) => setGameNameInput(event.target.value)}
                    placeholder='Game name'
                />
                <input
                    id='PasswordInput'
                    type="text"
                    value={PasswordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    placeholder='Password'
                />
            </div>
            <div className="buttons">
                <button onClick={() => requestNewGame()}>Create</button>
                <button onClick={() => setOnNewGame(false)}>Cancel</button>
            </div>
        </div>
    );
}

export default NewGameGenerator;
