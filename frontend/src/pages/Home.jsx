import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'

function Home() {
  return (
    <div className='w-screen h-[100vh] flex '>
    <Sidebar/>
    <MessageArea/>
    </div>
  )
}

export default Home