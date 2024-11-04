import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <main className='auth-page'><SignIn
    signUpFallbackRedirectUrl={'/dashboard'}
    /></main>
  )
}

export default SignInPage