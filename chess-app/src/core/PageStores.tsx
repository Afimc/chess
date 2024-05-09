import { create } from 'zustand';
import { IGameStore } from './Interfaces';

export const gameStore = create<IGameStore>()((set) => ({
    inGame: false,
    onNewGame: false,
    onRebornRequest: false,

    startStopGame: (s) => set(() => ({ inGame: s })),
    setOnNewGame: (s) => set(() => ({ onNewGame: s })),
    setOnRebornRequest: (s) => set(() => ({ onRebornRequest: s })),
}));
