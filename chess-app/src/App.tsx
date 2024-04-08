
import './App.scss'



const App = ()=> {
  return(
    <div className="App">
      <input id='NickNameInput' type="text"  placeholder='Username'></input>
      <div className="buttons">
        <button>Random Game</button>
        <button>Game with friend</button>
      </div>
      <div className="waitingList">
        <ol>
          <li>Miro</li>
          <li>valio</li>
        </ol>
      </div>
    </div>
  )
}


export default App
