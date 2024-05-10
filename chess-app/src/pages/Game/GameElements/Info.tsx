import './Info.scss';
import { gameStore } from "../../../core/PageStores";
import { socket } from "../../../core/sockets";
import { updatedDataStore } from "../../../core/InGameStore";
import { EMIT, IHistoryTurn } from "../../../core/Interfaces";
// test branch
const Info = () => {
    const startStopGame = gameStore((state) => state.startStopGame);
    const playerColor = updatedDataStore((state) => state.playerColor);
    const history = updatedDataStore((state) => state.history);
    const info = updatedDataStore((state) => state.info);
    const turns = updatedDataStore((state) => state.turns);

    function IsonTurn() {
        const isOnTurn = turns % 2 === 0 ? 1 : 0;
        return isOnTurn;
    }

    function exitGame() {
        socket.emit(EMIT.EXIT, info.gameID);
        startStopGame(false);
    }
    //-------------------------------------------------------------
    function getStringifyTurnHistory(turn: IHistoryTurn) {
        const stringifyTurnHistory = `!!! on turn ${turn._turn} ${turn._pieceToMove} been moved from ${turn._fromPosition} 
        to ${turn._toPosition} . ${turn._pieceToKill !== null ? `On this move ${turn._pieceToKill}been send to the graveyard .` : '.'}
        ${turn._pieceToResorect !== null ? `${turn._pieceToMove}been sacrificed to resurrect ${turn._pieceToResorect}` : ''}`;
        return stringifyTurnHistory;
    }
    //----------------------------------------------------------------- 
    return (
        <div className="gameInfo">
            <button onClick={() => exitGame()}>Exit</button>
            <div className={IsonTurn() === playerColor?'onTurn':'notOnTurn'}>
                <p>{IsonTurn() === playerColor ? `you are on turn with ${playerColor === 1 ? 'White' : 'Black'}` : 'wait'} </p>
            </div>
            <div className="history">
                {
                    history.map((turn: IHistoryTurn) => {
                        const stringifyedTurnHistory = getStringifyTurnHistory(turn);
                        return (
                            <div className="turn">{stringifyedTurnHistory} </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Info;
