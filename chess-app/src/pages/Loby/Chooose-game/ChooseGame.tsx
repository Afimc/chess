import { useState } from "react";
import { socket } from "../../../core/sockets";
import  { gameStore } from "../../../core/PageStores";
import { updatedDataStore } from "../../../core/InGameStore";
import { EMIT, IGameInfo } from "../../../core/Interfaces";

const ChooseGame = () => {
    const [game, setGame] = useState<IGameInfo | null>(null);
    const [openedJoin, setOpenedJoin] = useState(false)
    const [nickNameInput, setNiknameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const waitingList = updatedDataStore((state) => state.waitingList);
    const setOnNewGame = gameStore((state) => state.setOnNewGame);

    function gameRequest() {
        if (!game || !nickNameInput)return;
        socket.emit(EMIT.GAMEENTER, game.gameID, passwordInput,nickNameInput);
    }

    return (
        <>
            {
                openedJoin
                    ? <div className="inpas">
                        <input 
                            id='PasswordInput' 
                            type="text" 
                            value={nickNameInput} 
                            onChange={(event) => setNiknameInput(event.target.value)} 
                            placeholder='NickNmae'
                        />
                        {
                            game?.isLocked
                                ?   <input 
                                        id='PasswordInput' 
                                        type="text" 
                                        value={passwordInput} 
                                        onChange={(event) => setPasswordInput(event.target.value)} 
                                        placeholder='Game Password'
                                    />
                                : null
                        }
                        <button onClick={() => gameRequest()}>GO</button>
                        <button onClick={() => setOpenedJoin(false)}>cancel</button>
                    </div>
                    : <div className="Loby">
                        <div className="buttons">
                            <button onClick={() => setOnNewGame(true)}>New Game</button>
                        </div>
                        <div className="waitingList">
                            <ol>
                                {
                                    waitingList.map((x, i) => {
                                        return <li key={i}>
                                            {x.gameName} {x.isLocked ? 'locked' : 'free'}
                                            <button id='EnterButton' onClick={() => {
                                                setOpenedJoin(true)
                                                setGame(x)
                                            }}>Enter</button>
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

export default ChooseGame;
