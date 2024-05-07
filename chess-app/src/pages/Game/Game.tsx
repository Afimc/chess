import './Game.scss'
import Info from "./GameElements/Info";
import InerBoard from "./GameElements/InerBoard";

const Game = () => {
  return (
    <div className="game" >
      <Info />
      <InerBoard />
    </div>  
  )
}

export default Game
