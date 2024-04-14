import { create } from 'zustand'


export interface IGameInfo {
    nickName: string;
    isLocked: boolean;
    id: string;
}

interface IGameStore {
    inGame: boolean;
    onNewGame: boolean;
    waitingList: IGameInfo[];
    startStopGame: (s: boolean) => void;
    setOnNewGame: (s: boolean) => void;
    setWaitingList: (s: IGameInfo[]) => void;

}

const gameStore = create<IGameStore>()((set) => ({
    inGame: false,
    onNewGame: false,
    waitingList:[],

    startStopGame: (inGame) => set(() => ({ inGame })),

    setOnNewGame: (onNewGame) => set(() => ({ onNewGame })),

    setWaitingList : (s) =>set(() =>({ waitingList: s })),

}))


export default gameStore



