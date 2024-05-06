import { useState } from "react"
import { updatedDataStore } from "../../../core/InGameStore";

const Graveyard = ({props}:any) => {
  const graveyard = updatedDataStore((state)=>state.graveyard)
  const [whitePiecesFromGraveyard,setWhitePiecesFromGraveyard] = useState<string[]>([])
  const [blackPiecesFromGraveyard,setBlackPiecesFromGraveyard] = useState<string[]>([])

function getGraveyard(color:number){
    const piecesFromGraveyard = graveyard.filter(piece=>piece._color===color).map((piece)=>{
      const color = piece?._color === 1 ? 'W' : 'B'
      const type = piece?._type
      return `${color}_${type}`
    })
    color === 1 ? setWhitePiecesFromGraveyard(piecesFromGraveyard) : setBlackPiecesFromGraveyard(piecesFromGraveyard)
}

  return (
    <>
        {
        props === 1 
        ? <div className="whiteGraveyard" onMouseLeave={()=>setWhitePiecesFromGraveyard([])} onMouseOver={()=>getGraveyard(props)}>
            { 
            whitePiecesFromGraveyard.map((piece)=>{
                return(
                <img id="whiteGraveyardImages" src={`piecesImages/${piece}.png` || ''} alt="" />
                )
            })
            }
        </div>
        :<div className="blackGraveyard" onMouseLeave={()=>setBlackPiecesFromGraveyard([])} onMouseOver={()=>getGraveyard(props)} >
            {
            blackPiecesFromGraveyard.map((piece)=>{
                return(
                <img id="blackGraveyardImages" src={`piecesImages/${piece}.png` || ''} alt="" />
                )
            })
            }
        </div>  
    }
    </>
  )
}

export default Graveyard
