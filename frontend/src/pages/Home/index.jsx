import React from 'react'
import Sidebar from '../../components/Sidebar'
import Greetings from './Greetings'
import QuickNav from './QuickNav'

const Home = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
   
        <main className="h-screen w-full bg-[#fafafa] flex flex-col">
            <Greetings />
            <QuickNav />
        </main>
    
    </div>
  )
}

export default Home
