import logo from './logo.svg';
import './App.css';
import Chat from './Chat';

function App() {
  return (
    <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <Chat></Chat>
        </div>

    </div>
  );
}

export default App;
