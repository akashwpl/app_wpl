import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsSignInModalOpen } from '../../store/slice/userSlice'
import SignInModal from '../SignInModal'
import CustomModal from '../ui/CustomModal'

const HowItWorksCard = () => {
  const token = localStorage.getItem('token_app_wpl')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showsignInModal, setShowSignInModal] = useState(false)

  const handleNavigateToProfile = () => {
    if(!token){
      handleOpenSignInModal()
    } else {
      navigate('/profile')
    }
  }

  const handleParticipateInBounties = () => {
    if(!token){
      handleOpenSignInModal()
    } else {
      navigate('/bounties')
    }
  }

  const handleOpenSignInModal = () => {
    dispatch(setIsSignInModalOpen(true))
    setShowSignInModal(true)
  }
  const handleCloseSignInModal = () => {
    dispatch(setIsSignInModalOpen(false))
    setShowSignInModal(false)
  }


  return (
    <div className='bg-white7 rounded-md p-4'>
      <div className='text-white88 font-gridular'>How it works?</div>
      <div className='rounded-sm mt-4'>
        <div onClick={handleNavigateToProfile} className='flex justify-between items-center bg-white4 p-3 rounded-t-md hover:bg-white7 cursor-pointer'>
          <div className='text-white64 text-[13px] font-medium font-inter flex items-center gap-1'>
            <div className='bg-white4 rounded-[4px] size-5 text-center'>1</div> 
            Create basic profile
          </div>
          <div><ArrowRight className='text-white48'/></div>
        </div>
        <div onClick={handleParticipateInBounties} className='flex justify-between items-center bg-white/10 hover:bg-white12 cursor-pointer p-3 border-t border-b border-dashed border-white12 '>
          <div className='text-white64 text-[13px] font-medium font-inter flex items-center gap-1'>
            <div className='bg-white4 rounded-[4px] size-5 text-center'>2</div> 
            Participate in bounties
          </div>
          <div><ArrowRight className='text-white48'/></div>
        </div>
        <div className='flex justify-between items-center bg-white/10 hover:bg-white12 cursor-pointer p-3 rounded-b-md'>
          <div className='text-white64 text-[13px] font-medium font-inter flex items-center gap-1'>
            <div className='bg-white4 rounded-[4px] size-5 text-center'>3</div> 
            Get paid 100% for your work
          </div>
          <div><ArrowRight className='text-white48'/></div>
        </div>
      </div>


      <CustomModal isOpen={showsignInModal} closeModal={() => handleCloseSignInModal()}>
        <div onClick={() => handleCloseSignInModal()} className='bg-primaryDarkUI/90 h-screen w-screen overflow-hidden flex justify-center items-center z-50'>
          <SignInModal />
        </div>
      </CustomModal>
    </div>
  )
}

export default HowItWorksCard