import { useEffect, useState } from "react"
import gameStore from "../../core/stores"
import { socket } from "../../core/sockets"
import './Loby.scss'
import NewGameGenerator from "./New-game-generator/NewGameGenerator"
import ChooseGame from "./Chooose-game/ChooseGame"




const Loby = () => {



    const OnNewGame = gameStore((state) => state.OnNewGame)


    return (
        <>
            {
                OnNewGame
                    ? <ChooseGame />
                    : <NewGameGenerator />
            }
        </>
    )
}


export default Loby



