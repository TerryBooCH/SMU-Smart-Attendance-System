import React from 'react'
import PreAuthNavbar from '../../components/PreAuthNavbar'
import SignInForm from './SignInForm'

const SignIn = () => {
  return (
    <>
     <div className="overflow-hidden min-h-screen bg-blue-mesh ">
        <PreAuthNavbar />
        <SignInForm />
     </div>
      
    </>
  )
}

export default SignIn
