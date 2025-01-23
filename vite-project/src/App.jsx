import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthForm from '../Components/AuthForm.jsx'
import { EmpManage } from '../Components/EmpManage.jsx'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AuthForm/>
    {/* <EmpManage/> */}
      </>
       
  )
}

// export default App
