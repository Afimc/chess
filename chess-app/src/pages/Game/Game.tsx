
import './Game.scss'

import { updatedDataStore } from "../../core/InGameStore";


import Info from "./GameElements/info";
import InerBoard from "./GameElements/InerBoard";

const Game = () => {

  const turns = updatedDataStore((state)=>state.turns)

  function IsonTurn(){
    const isOnTurn = turns % 2 === 0 ? 1 : 0
    return isOnTurn
  }

  return (

    <div className="game" >
      <Info props = {IsonTurn()} />
      <div className="bord">
        <InerBoard />
      </div>
    </div>  
  )
}

export default Game
