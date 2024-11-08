import { ArrowRight, EyeIcon, Info, MailWarningIcon, Menu, MessageSquareMoreIcon, Zap } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loginBtnSubtract from '../assets/svg/btn_subtract2.png'
import loginBtnHoverSubtract from '../assets/svg/btn_hover_subtract2.png'

import FancyButton from '../components/ui/FancyButton'


const ForgetPasswordPage = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('') // Changed from firstName to email
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const [isPass, setIsPass ] = useState(true);

  const togglePasswordField = () => {
    setIsPass(!isPass)
  }

  return (
    <div className='flex justify-center items-center'>
        <div className='mt-32'>
            <div className="flex items-center bg-[#091044] w-fit p-2 gap-1 font-inter font-medium text-[12px] leading-[14.4px]  rounded-md">
              <Zap className='text-[#97A0F1]' size={12}></Zap>
              <p className='text-white88'>New to WPL?</p>
              <p className='text-white48'>Apply to be a part!</p>
            </div>
          
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
                <MessageSquareMoreIcon stroke='#FFFFFF52'/>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type={isPass ? 'password' : 'text'} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                <EyeIcon className='cursor-pointer' onClick={togglePasswordField} stroke='#FFFFFF52'/>
              </div>

              {error && <div className='bg-[#F03D3D1A] rounded-md px-2 py-2 mt-4 flex items-center gap-1'>
                <MailWarningIcon stroke='#F03D3D' size={14} className='mr-1'/>
                <p className='text-[#F03D3D] font-semibold text-[12px] font-inter leading-[14.4px]'>{error}</p>
              </div>}

            </div>
                <div className='mt-4'>
                  <FancyButton src_img={loginBtnSubtract} hover_src_img={loginBtnHoverSubtract} img_size_classes='w-[398px]' className='mt-1 font-gridular text-white64 text-[14px] leading-[8.82px]' btn_txt='reset password' onClick={() => {alert('New password set successfully');navigate('/onboarding');}} />
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