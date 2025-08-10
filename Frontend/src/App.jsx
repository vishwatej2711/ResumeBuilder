import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import UserProvider from './context/UserContext';
import Dashboard from './pages/Dashboard';
import EditResume from './components/EditResume';
import { Toaster } from 'react-hot-toast';


function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>
      <Routes>
      <Route path='/' element={<LandingPage></LandingPage>}></Route>
      <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
      <Route path='/resume/:resumeId' element={<EditResume></EditResume>}></Route>
    </Routes>
    <Toaster toastOptions={{
      className:"",
      style:{
        fontSize:"13px"
      }
    }}></Toaster>
    </UserProvider>
    
  )
}

export default App
