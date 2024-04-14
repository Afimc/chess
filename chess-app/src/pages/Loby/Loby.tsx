import gameStore from "../../core/stores"
import './Loby.scss'
import NewGameGenerator from "./New-game-generator/NewGameGenerator"
import ChooseGame from "./Chooose-game/ChooseGame"


const Loby = () => {

    const onNewGame = gameStore((state) => state.onNewGame)
    
    return (
        <>
            {
                onNewGame
                    ? <NewGameGenerator />
                    : <ChooseGame />
            }
        </>
    )
}

export default Loby



