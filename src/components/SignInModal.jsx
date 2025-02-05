import React from 'react'
import OnBoarding from '../pages/OnBoarding'

const SignInModal = () => {

  return (
    <div onClick={(e) => {e.stopPropagation(); e.preventDefault()}}>
      <OnBoarding />
    </div>
  )
}

export default SignInModal