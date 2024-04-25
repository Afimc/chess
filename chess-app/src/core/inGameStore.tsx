import { create } from "zustand"
import { IUpdatedDataStore } from './Interfaces'


export const updatedDataStore = create<IUpdatedDataStore>()((set)=>({
    waitingList:[],
    playerColor:null,
    info:{
       gameID:'', nickName:'', isLocked:false,
    },
    updatedBoard:[],
    turns:0,
    graveyard:[],
    whitePlayerId:'',
    history:[],
    
    setWaitingList: (s)=>set(()=>({ waitingList: s })),
    setPlayerColor: (s)=>set(()=>({ playerColor:s })),
    setInfo: (s)=>set(()=>({ info: s })),
    setTurns: (s)=>set(()=>({turns:s})),
    setUpdatedBoard: (s)=>set(()=>({ updatedBoard:s })),
    setHistory: (s)=>set(()=>({ history:s })),
        
}))
