import { create } from 'zustand'


interface IGameStore {
    inGame: boolean;
    OnNewGame: boolean;
    gameID: string;
    startStopGame: (S: boolean) =>void;
    SetOnNewGame: (S: boolean) =>void;
    updateID : (S: string) =>void;
   
}

const gameStore = create<IGameStore>()((set) => ({
    inGame: false,
    OnNewGame: true,
    gameID: '',
    

    startStopGame: (S) => set(() => {
        return {
            inGame: S
        }
    }),
 
    SetOnNewGame: (S) =>set(()=>{
        return{
            OnNewGame: !S
        }
    }),

    updateID: (S) => set(()=>{
        return{
            gameID: S
        }
    }),

}))





export default gameStore



