import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import usegetMessage from '../customHooks/GetMessages'

function Home() {
  usegetMessage()
  return (
    <div className='w-screen h-[100vh] flex '>
    <Sidebar/>
    <MessageArea/>
    </div>
  )
}

export default Home