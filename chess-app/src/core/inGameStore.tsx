import { create } from "zustand"

export interface IRow{
    piece: IPiece,
    posiblePositions: Iposition[]
}

export interface IPiece{
    _color: number,
    _type: '',
}

export interface Iposition {
    x: number,
    y: number,
  }

export interface IGameInfo {
    nickName: string;
    isLocked: boolean;
    id: string;
}

export interface IInGameStore {
    board:any;
    playerColor:number;
    onTurn: any;
    waitingList: IGameInfo[];

    setBoard: (s:any) => void;
    setColor: (s:number) => void;
    setOnTurn: (s:any) => void;
    setWaitingList: (s: IGameInfo[]) => void;
   

}


export const inGameStore = create<IInGameStore>()((set) => ({
    board:[],
    playerColor:0,
    onTurn: false,
    waitingList:[],

    setBoard: (s) => set (()=>({board:s})),
    setColor: (s) => set (()=>({playerColor:s})),
    setOnTurn: (s) => set (()=>({onTurn:s})),
    setWaitingList : (s) => set(() =>({ waitingList: s })),

}))
