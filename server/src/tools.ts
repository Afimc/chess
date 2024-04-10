

import { games } from "./games"
const fs = require('fs');
const Gamesfile = './src/DB.csv';



function onDisconnect(){
    console.log('disconnect')
}

function onRequest(nickNameInput:string,PasswordInput:string,socket:any, ioEmit:any){
    let game ={
        nickName:nickNameInput,
        password:PasswordInput,
        isLoocked:false,
    }
    if (PasswordInput.length>0){
       game.isLoocked=true
        }
    // const readingFile = fs.readFileSync(Gamesfile)
  
   


        ioEmit("new-waitingList",games)
   
    

}

module.exports = {onDisconnect, onRequest}