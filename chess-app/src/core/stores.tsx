import { create } from 'zustand'


interface IGameStore {
    inGame: boolean;
    OnNewGame:boolean;
    startStopGame: (S: boolean) =>void;
    SetOnNewGame:(S:boolean) =>void;
   
}

const gameStore = create<IGameStore>()((set) => ({
    inGame: false,
    OnNewGame:true,

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

}))




export default gameStore



