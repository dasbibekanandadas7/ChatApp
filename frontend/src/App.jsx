import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Routes, Route, Navigate } from "react-router-dom";
import usegetCurrentUser from './customHooks/GetCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import Home from './pages/Home'
import usegetOtherUser from './customHooks/GetOtherUsers'
// import './App.css'

function App() {
  usegetCurrentUser()
  usegetOtherUser()
  const{userData}=useSelector(state=>state.user)
  return (
    <Routes>
     <Route path="/login" element={!userData?<Login/>:<Navigate to="/"/>}/>
     <Route path="/signup" element={!userData?<Signup/>:<Navigate to="/profile"/>}/>
     <Route path="/" element={userData?<Home/>:<Navigate to="/login"/>}/>
     <Route path="/profile" element={userData?<Profile/>:<Navigate to="/signup"/>}/>
    </Routes>
  )
}

export default App
