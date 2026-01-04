import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import PlayOffline from './components/PlayOffline';
import PlayOnline from './components/PlayOnline';
import PlayRoom from './components/PlayRoom';

function App() {

  return (
    <div className='min-h-screen flex justify-center bg-[#1b2021] itmes-center' >
      <div className='mt-[5vh] w-max-[600px] flex flex-col items-center bg-[#304a91] p-6 rounded-lg'>
        <h1 className='text-2xl font-bold mb-4'>Online Tic-Tac-Toe</h1>
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
