import { create } from 'zustand'



export interface IGameStore {
    inGame: boolean;
    onNewGame: boolean;
  
    startStopGame: (s: boolean) => void;
    setOnNewGame: (s: boolean) => void;


}

export const gameStore = create<IGameStore>()((set) => ({
    inGame: false,
    onNewGame: false,
  

    startStopGame: (inGame) => set(() => ({ inGame })),

    setOnNewGame: (onNewGame) => set(() => ({ onNewGame })),

 

}))






