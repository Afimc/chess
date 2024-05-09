import { useEffect} from "react";
import { socket } from "./core/sockets";
import { gameStore } from "./core/PageStores";
import { updatedDataStore } from "./core/InGameStore";
import { EMIT, IGameInfo, IUpdatedData, ON } from "./core/Interfaces";
import Game from "./pages/Game/Game";
import Loby from "./pages/Loby/Loby";

const App = () => {
  const inGame = gameStore((state) => state.inGame);
  const playerColor = updatedDataStore((state) => state.playerColor);
  const info = updatedDataStore((state) => state.info);
  const startStopGame = gameStore((state) => state.startStopGame);
  const setOnRebornRequest = gameStore((state) => state.setOnRebornRequest);
  const setWaitingList = updatedDataStore((state) => state.setWaitingList);
  const setUpdatedBoard = updatedDataStore((state) => state.setUpdatedBoard);
  const setPlayerColor = updatedDataStore((state) => state.setPlayerColor);
  const setTurns = updatedDataStore((state) => state.setTurns);
  const setHistory = updatedDataStore((state) => state.setHistory);
  const setInfo = updatedDataStore((state) => state.setInfo);
  const setGraveyard = updatedDataStore((state) => state.setGraveyard);
  const setNumberOfGames = updatedDataStore((state) => state.setNumberOfGames);
  
  
  useEffect(() => {
    socket.on(ON.NEWWAITINGLIST, (list: IGameInfo[], numberOfGames: number) => {
      setNumberOfGames(numberOfGames);
      setWaitingList(list);
    });

    socket.on(ON.GAMEMACHED, (isGamemached: boolean) => {
      startStopGame(isGamemached);
    });

    socket.on(ON.PLAYERLEAVE, (didPlayerLeave: Boolean) => {
      startStopGame(!didPlayerLeave);
    });

    socket.on(ON.UPDATEDDATA, (data: IUpdatedData) => {
      const color = socket.id === data.whitePlayerId ? 1 : 0;
      info.gameID === '' ? setInfo(data.info) : null;
      playerColor === null ? setPlayerColor(color) : null;
      setGraveyard(data.graveyard);
      setTurns(data.turns);
      setHistory(data.history);
      setUpdatedBoard(data.updatedBoard);
    });

    socket.on(ON.PIECEREQUEST, () => {
      setOnRebornRequest(true);
    });


    socket.connect();
    socket.emit(EMIT.REQUESTWAITINGLIST);

    return () => {
      socket.disconnect();
      socket.off(ON.PLAYERLEAVE);
      socket.off(ON.UPDATEDDATA);
      socket.off(ON.GAMEMACHED);
      socket.off(ON.NEWWAITINGLIST);
      socket.off(ON.PIECEREQUEST);
    }
  }, []);

  return (
    <>
    <h1>ChessIRO</h1>
      {
        !inGame
          ? <Loby />
          : <Game />
      }
    </>
  )
}

export default App;
