import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthForm from '../Components/AuthForm.jsx'
import { EmpManage } from '../Components/EmpManage.jsx'
import { Router, Route, BrowserRouter, Routes} from 'react-router-dom'


export default function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    {/* <AuthForm/> */}
    {/* <EmpManage/> */}
    <Routes>
      <Route path='/register' element={<AuthForm/>}></Route>
      <Route path='/login' element={<AuthForm/>}></Route>
      <Route path='/add-details' element={<EmpManage/>}></Route>
    </Routes>
    </BrowserRouter>
       
  )
}

// export default App
