import React from 'react'
import Sidebar from '../../components/Sidebar'
import Greetings from './Greetings'
import QuickNav from './QuickNav'

const Home = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="h-screen py-2 pr-2 flex flex-col flex-1 bg-[#f9f9f9]">
        <main className="h-full w-full bg-white border-1 border-[#cecece] rounded-2xl">
            <Greetings />
            <QuickNav />
        </main>
      </div>
    </div>
  )
}

export default Home
