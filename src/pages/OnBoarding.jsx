import React, { useState } from 'react'
import { BASE_URL, email_regex } from '../lib/constants'
import { ArrowRight, EyeIcon, MailWarningIcon, Menu, MessageSquareMoreIcon, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import headerPng from '../assets/images/prdetails_header.png'
import wpllogo from '../assets/images/wpl_prdetails.png'

const OnBoarding = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('') // Changed from firstName to email
  const [password, setPassword] = useState('')

  // const []


  const [displayName, setDisplayName] = useState('') // Changed from firstName to email
  const [experience, setExperience] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const [isSignin, setIsSignin] = useState(false)

  const [isSignComplete, setIsSignComplete] = useState(false)

  const [error, setError] = useState('')


  const signUp = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }
    const validEmail = email_regex.test(email)
    if (!validEmail) {
      setError('Please enter a valid email')
      return
    }
    const response = fetch(`${BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json())
    .then((data) => {

      if(data.status === 201) {
        setIsSignComplete(true)
        setError('')
        return
      } 
      if(data.message === `This email ${email} already exists`) {
        setError(data.message)
      }
    })
    
  }

  const login = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }
    const validEmail = email_regex.test(email)
    if (!validEmail) {
      setError('Please enter a valid email')
      return
    }
    const response = fetch(`${BASE_URL}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json()).then((data) => {
      console.log('login', data)
      if(data.message === 'Password is not matching') {
        setError(data.message)
        return
      } else {
        localStorage.setItem('token_app_wpl', data?.data?.token)
        navigate('/')
        setError('')
      }
    }).finally(() => {
      setEmail('')
      setPassword('')
    })
  }

  const updateProfile = async () => {
    if(!displayName || !experience || !walletAddress) {
      alert('Please fill all the fields')
      return
    }

    const response = fetch(`http://139.59.58.53:3000/users/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': 'Bearer ' + localStorage.getItem('token_app_wpl')
      },
      body: JSON.stringify({ 
        "displayName": displayName,
        "experienceDescription": experience,
        "walletAddress": walletAddress
       }),
    })
    const data = await response;
    if(data.status === 200){
      navigate('/')
    } else {
      alert('Something went wrong')
    }

    console.log('update profile', data)
  }

  const swtichOnboardingType = () => {
    setIsSignin(!isSignin)
  }
  
  return (
    <div className='flex justify-center items-center'>
      {!isSignComplete ?
        <div className='mt-32'>
          <div className='bg-[#091044] text-white88 flex items-center gap-1 py-2 px-4 rounded-md w-fit'><Zap stroke='#97A0F1' size={14}/>New to WPL? <span className='text-white48 ml-1'>Apply to be a part!</span></div>
          <div className='mt-4'>
            <div className='text-primaryYellow font-gridular text-[24px] leading-[28.8px]'>Start contributing Onchain</div>
            <p className='text-white48 font-semibold text-[12px] font-inter'>Earn in crypto by contributing to your fav projects</p>
          </div>

          <div className='bg-white4 rounded-lg p-3 mt-6 min-w-[400px]'>
            <div className='bg-[#091044] rounded-lg p-3'>
              <div className='flex justify-between items-center'>
                <div className='text-white88 text-[14px] font-inter'>{isSignin ? "Login" : "Sign up"} with Google</div>
                <div><ArrowRight stroke='#FFFFFF52'/></div>
              </div>
              <div className='my-4 border border-dashed border-[#FFFFFF12]'/>
              <div>
                <p className='text-white32 font-semibold font-inter text-[13px]'>Or, {isSignin ? "Login" : "Sign up"} with Email</p>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type="email" placeholder="user@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className='bg-transparent w-full outline-none border-none text-white placeholder:text-white32'/>
                <MessageSquareMoreIcon stroke='#FFFFFF52'/>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent w-full outline-none border-none text-white placeholder:text-white32'/>
                <EyeIcon stroke='#FFFFFF52'/>
              </div>

              {error && <div className='bg-[#F03D3D1A] rounded-md px-2 py-2 mt-4 flex items-center gap-1'>
                <MailWarningIcon stroke='#F03D3D' size={14} className='mr-1'/>
                <p className='text-[#F03D3D] font-semibold text-[12px] font-inter leading-[14.4px]'>{error}</p>
              </div>}

              
              <div className='mt-4 border border-primaryYellow py-1'>
                <button onClick={isSignin ? login : signUp} className='w-full flex justify-center items-center text-primaryYellow'>{isSignin ? "Log In" : "Sign Up"}</button>
              </div>
            </div>
          </div>

          <div className='flex justify-center items-center mt-2 gap-2'>
            <div onClick={swtichOnboardingType} className='text-[12px] text-white32 font-semibold text-inter mr-1'>
              {isSignin
                ? <p>Create an account? <span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] underline'>Sign Up</span></p>
                : <p>Already have an account? <span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] underline'>Login</span></p>
              }
            </div>
            <p className='text-[12px] text-white32 font-semibold text-inter'>Still loking for help? <span className='text-[12px] text-primaryYellow font-semibold font-inter underline cursor-pointer'>Join discord</span></p>
          </div>
        </div>
      :
        <div className='w-full'>
          <div className='w-full'>
            <img src={headerPng} alt='header' className='h-[200px] w-full'/>
          </div>

          <div className='flex flex-col justify-center items-center'>
            <div className='w-[350px] md:w-[480px]'>
              <div className='-translate-y-8'>
                <img src={wpllogo} alt="WPL Logo" className='size-[72px]'/>
              </div>

              <div>
                <div className='flex'>
                  <div>
                    <p className='text-[24px] leading-[28px] text-primaryYellow font-gridular'>Start Contributing Onchain!</p>
                    <p className='text-[14px] text-white32 font-inter'>$100k+ worth of bounties up for you to enjoy!</p>
                  </div>
                </div>

                <div className='text-[14px] text-white88 font-inter flex items-center gap-2 mt-3'>
                  <p>100 <span className='text-white32'>Active Bounties</span></p>
                  <p>$100k <span className='text-white32'>Distributed</span></p>
                </div>
              </div>

              <div className='mt-4'>
                <div className='flex items-center gap-1'><Menu size={16} stroke='#FAF1B1'/> <p className='text-primaryYellow text-[14px] font-inter leading-[20px]'>Fill the Information</p></div>
              </div>

              <div className='h-[1px] w-full bg-primaryYellow my-4'/>

              <div>
                <div className='flex items-center gap-4 w-full'>
                  <div className='w-full'>
                    <div className='text-white32 font-semibold font-inter text-[13px]'>Your Name</div>
                    <div className='bg-[#FFFFFF12] rounded-md'>
                      <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} type='text' placeholder='John' className='w-full bg-transparent py-2 px-2 outline-none text-white'/>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='text-white32 font-semibold font-inter text-[13px]'>Your Email</div>
                    <div className='bg-[#FFFFFF12] rounded-md'>
                      <input value={email} type='email' readOnly placeholder='John@gmai.com' className='w-full bg-transparent py-2 px-2 outline-none text-white cursor-default' />
                    </div>
                  </div>
                </div>

                <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Do you have experience designing application?</div>
                  <textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder='Yes, I have 5 years of experience in designing applications' className='w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] text-white' rows={4}/>
                </div>


                <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Enter ypur ERC-20 Address</div>
                  <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder='0x101..' className='w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] outline-none text-white'/>
                </div>

                <div className='mt-8 border border-primaryYellow py-1'>
                  <button onClick={updateProfile} className='w-full flex justify-center items-center text-primaryYellow'>Submit</button>
                </div>

              </div>

            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default OnBoarding