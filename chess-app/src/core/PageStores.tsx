import { create } from 'zustand'
import { IGameStore } from './Interfaces'


export const gameStore = create<IGameStore>()((set) => ({
    inGame: false,
    onNewGame: false,
  
    startStopGame: (s) => set(() => ({ inGame :s})),
    setOnNewGame: (onNewGame) => set(() => ({ onNewGame })),

 

}))






