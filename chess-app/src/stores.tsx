import { create } from 'zustand'


interface IGameStore {
    inGame: boolean,
    startGame: (S: boolean) =>void,
    stopGame: (S: boolean) =>void,
}

const gameStore = create<IGameStore>()((set) => ({
    inGame: false,

    startGame: () => set(() => {
        return {
            inGame: true
        }

    }),
    stopGame: () =>set(()=>{
        return{
            inGame: false
        }
    })

}))




export default gameStore



