import { create } from "zustand"
import {IUpdatedDataStore} from './Interfaces'


export const updatedDataStore = create<IUpdatedDataStore>()((set)=>({
    waitingList:[],
    playerColor:0,
    board:[],
    info:{
        nickName: '',isLocked: true,id: '',
    },
    updatedBoard:{
        piece:{
            _color: 0,
            _type: '',
        },
        posiblePositions:[],
    },
    turns:0,
    graveyard:[],
    white:'',
    history:[],
    
    setWaitingList : (s) => set(() =>({ waitingList: s })),
    setColor: (s) => set (()=>({playerColor:s})),
    setTurns: (s) => set (()=>({turns:s})),
    setBoard: (s) => set (()=>({board:s})),
    setHistory:(s) => set (()=>({history:s}))
        
    
    
}))