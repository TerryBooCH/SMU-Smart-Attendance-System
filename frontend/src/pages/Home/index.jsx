import React from 'react'
import Sidebar from '../../components/Sidebar'
import Greetings from './Greetings'
import QuickNav from './QuickNav'
import Header from './Header'

const Home = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
   
        <main className="h-screen w-full bg-white flex flex-col">
            <Header />
            <Greetings />
            <QuickNav />
        </main>
    
    </div>
  )
}

export default Home
