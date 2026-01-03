import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import PlayOffline from './components/PlayOffline';
import PlayOnline from './components/PlayOnline';
import PlayRoom from './components/PlayRoom';

function App() {

  return (
    <div>
      <div>
        <h1>Online Tic-Tac-Toe</h1>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />}/>
          <Route path='/play-online' element={<PlayOnline />}/>
          <Route path='/play-offline' element={<PlayOffline />}/>
          <Route path='/play-room' element={<PlayRoom />}/>
        </Routes>
      </BrowserRouter>
      </div>
    </div>
  )
}

export default App
