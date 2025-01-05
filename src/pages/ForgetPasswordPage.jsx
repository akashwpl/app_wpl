import { ArrowRight, EyeIcon, EyeOffIcon, MailWarningIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loginBtnImg from '../assets/svg/btn_subtract_semi.png'
import loginBtnHoverImg from '../assets/svg/btn_hover_subtract.png'

import FancyButton from '../components/ui/FancyButton'

import mailSVG from '../assets/svg/mail.svg'
import { useDispatch } from 'react-redux'
import { displaySnackbar } from '../store/thunkMiddleware'
import { email_regex } from '../lib/constants'

const ForgetPasswordPage = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('') // Changed from firstName to email
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')

  const [isPass, setIsPass ] = useState(true);
  const [isConfirmPass, setIsConfirmPass ] = useState(true);
  const [hovered, setHovered] = useState(false);

  const handleHover = () => setHovered(!hovered)
  
  // TO-DO: Update password flow pending on email OTP verification
  const handleForgotPassSubmit = () => {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    const validEmail = email_regex.test(email)
    if (!validEmail) {
      setError('Please enter a valid email')
      return
    }

    if (password !== confirmPassword) {
      setError('Password not matching')
      return
    }
    
    dispatch(displaySnackbar('New password set successfully'))
    navigate('/onboarding');
  }

  return (
    <div className='flex justify-center items-center'>
        <div className='mt-32'>
          <div className='mt-4'>
            <div className='text-primaryYellow font-gridular text-[24px] leading-[28.8px]'>Start contributing Onchain</div>
            <p className='text-white48 font-semibold text-[12px] font-inter'>Earn in crypto by contributing to your fav projects</p>
          </div>

          <div className='bg-white4 rounded-lg p-3 mt-6 min-w-[400px]'>
            <div className='bg-[#091044] rounded-lg p-3'>
              <div className='flex justify-between items-center group cursor-pointer'>
                <div className='flex items-center gap-1 text-white88 text-[14px] font-inter'>Reset your password</div>
                <div><ArrowRight size={18} stroke='#FFFFFF52'/></div>
              </div>
              <div className='my-4 border border-dashed border-[#FFFFFF12]'/>

              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type="email" placeholder="User@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                <img src={mailSVG} alt='email' className='w-[22px] h-[22px] mr-3'/>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type={isPass ? 'password' : 'text'} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                {isPass ? <EyeIcon className='cursor-pointer mr-3' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer mr-3' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> }
              </div>

              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type={isConfirmPass ? 'password' : 'text'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                {isConfirmPass ? <EyeIcon className='cursor-pointer mr-3' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer mr-3' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> }
              </div>

              {error && <div className='bg-[#F03D3D1A] rounded-md px-2 py-2 mt-4 flex items-center gap-1'>
                <MailWarningIcon stroke='#F03D3D' size={14} className='mr-1'/>
                <p className='text-[#F03D3D] font-semibold text-[12px] font-inter leading-[14.4px]'>{error}</p>
              </div>}

            </div>
                <div className='mt-4 overflow-hidden' onMouseEnter={handleHover} onMouseLeave={handleHover}>
                  <FancyButton 
                    src_img={loginBtnImg} 
                    hover_src_img={loginBtnHoverImg} 
                    img_size_classes='w-[376px] h-[44px]' 
                    className='mt-1 font-gridular text-white64 text-[14px] leading-[8.82px]' 
                    btn_txt={
                      <>
                        <span
                        className={`absolute left-0 -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ${
                          hovered ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
                        }`}
                      >
                        reset password
                      </span>
          
                        <span
                          className={`absolute left-full -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ease-out ${
                            hovered
                              ? "-translate-x-full opacity-100 scale-110"
                              : "translate-x-0 opacity-0"
                          }`}
                        >
                          tsk tsk, ngmi
                        </span>
                      </>
                    }
                    onClick={handleForgotPassSubmit}
                  />
                </div>
          </div>

          <div className='flex justify-center items-center mt-2 gap-2'>
            <div onClick={() => {navigate('/onboarding')}} className='text-[12px] text-white32 font-semibold text-inter mr-1'>
              <p>Do not have an account?<span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] hover:underline'>Sign up now!</span></p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ForgetPasswordPage