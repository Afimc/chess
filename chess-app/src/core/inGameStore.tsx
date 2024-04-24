import { create } from "zustand"
import {IUpdatedDataStore} from './Interfaces'


export const updatedDataStore = create<IUpdatedDataStore>()((set)=>({
    waitingList:[],
    playerColor:null,
    info:{
       gameID:'', nickName:'', isLocked:false, id:'',
    },
    updatedBoard:[],
    turns:0,
    graveyard:[],
    whitePlayerId:'',
    history:[],
    
    setInfo: (s)=>set(()=>({ info: s })),
    setWaitingList: (s)=>set(()=>({ waitingList: s })),
    setPlayerColor: (s)=>set(()=>({ playerColor:s })),
    setTurns: (s)=>set(()=>({turns:s})),
    setUpdatedBoard: (s)=>set(()=>({ updatedBoard:s })),
    setHistory: (s)=>set(()=>({ history:s })),
        
}))