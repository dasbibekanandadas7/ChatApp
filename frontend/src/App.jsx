import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Routes, Route } from "react-router-dom";
// import './App.css'

function App() {
  return (
    <Routes>
     <Route path="/login" element={<Login/>}/>
     <Route path="/signup" element={<Signup/>}/>
    </Routes>
  )
}

export default App
