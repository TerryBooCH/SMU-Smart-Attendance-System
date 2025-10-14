import React from 'react'
import PreAuthNavbar from '../../components/PreAuthNavbar'
import Hero from './Hero'

const Landing = () => {
  return (
    <>
    <div className="overflow-hidden min-h-screen bg-blue-mesh">
       <PreAuthNavbar />
       <Hero />
    </div>
    </>
  )
}

export default Landing
