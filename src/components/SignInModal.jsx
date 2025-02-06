import React from 'react'
import OnBoarding from '../pages/OnBoarding'

const SignInModal = () => {

  return (
    <div onClick={(e) => {e.stopPropagation(); e.preventDefault()}} className='z-50'>
      <OnBoarding />
    </div>
  )
}

export default SignInModal