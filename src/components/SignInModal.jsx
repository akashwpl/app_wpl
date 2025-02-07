import React from 'react'
import OnBoarding from '../pages/OnBoarding'

const SignInModal = ({setShowSignInModal}) => {

  return (
    <div onClick={(e) => {e.stopPropagation(); e.preventDefault()}} className='z-50'>
      <OnBoarding setShowSignInModal={setShowSignInModal}  isModal={true} />
    </div>
  )
}

export default SignInModal