import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { EmpManage } from '../Components/EmpManage.jsx'
import { Router, Route, BrowserRouter, Routes} from 'react-router-dom'
import Signup from '../Components/Signup.jsx'
import Login from '../Components/Login.jsx'
import { AddBtn } from '../Components/AddBtn.jsx'
import { AuditForm } from '../Components/AuditForm.jsx'


export default function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    {/* <AuthForm/> */}
    {/* <EmpManage/> */}
    <Routes>
      <Route path='/register' element={<Signup/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/add-details' element={<EmpManage/>}></Route>
      <Route path='/add-form' element={<AddBtn/>}></Route>
      <Route path='/audit-logs' element={<AuditForm/>}></Route>
    </Routes>
    </BrowserRouter>
       
  )
}

// export default App
