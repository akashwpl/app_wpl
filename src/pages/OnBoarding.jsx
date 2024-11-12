import { ArrowRight, EyeIcon, EyeOffIcon, Info, MailWarningIcon, Menu, MessageSquareMoreIcon, Upload, X, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, email_regex } from '../lib/constants'

import { useDispatch } from 'react-redux'
import headerPng from '../assets/images/prdetails_header.png'
import wpllogo from '../assets/images/wpl_prdetails.png'
import googleLogo from '../assets/svg/google_symbol.png'
import loginBtnImg from '../assets/svg/btn_subtract_semi.png'
import loginBtnHoverImg from '../assets/svg/btn_hover_subtract.png'

import userSlice, { setUserId } from '../store/slice/userSlice'
import { getUserDetails } from '../service/api'
import FancyButton from '../components/ui/FancyButton'

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase'
import { displaySnackbar } from '../store/thunkMiddleware'

const OnBoarding = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('') // Changed from firstName to email
  const [password, setPassword] = useState('')

  // const []

  const [displayName, setDisplayName] = useState('') // Changed from firstName to email
  const [experience, setExperience] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const [isSignin, setIsSignin] = useState(true)

  const [isSignComplete, setIsSignComplete] = useState(false)

  const [error, setError] = useState('')

  const [isPass, setIsPass ] = useState(true);
  const [showForgetPassDialog, setShowForgetPassDialog] = useState(false);

  const [img, setImg] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)

  const fileInputRef = useRef(null);


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
      console.log('signup', data)
      if(data?.data?.token) {
        localStorage.setItem('token_app_wpl', data?.data?.token)
        dispatch(setUserId(data?.data?.userId))
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
    }).then((res) => {
      if(res.status === 401) {
        setError('Password is not matching')
        return
      }
      if(res.status === 404) {
        setError('Email not found')
        return
      }
      if(res.status === 409) {
        setError('Email not found')
        return
      }
      if(res.status === 500) {
        setError('Something went wrong')
        return
      }
      return res.json()
    }).then((data) => {
      console.log('login', data)
      if(data.message === 'Password is not matching') {
        setError(data.message)
        return
      } else {
        localStorage.setItem('token_app_wpl', data?.data?.token)
        dispatch(setUserId(data?.data?.userId))

        getUserDetails(data?.data?.userId).then((data) => {
          setError('')
          console.log('data', data)
          data?.role == 'sponsor' ? navigate('/sponsordashboard') : navigate('/allprojects')
        })        
      }
    }).finally(() => {
      setEmail('')
      setPassword('')
    })
  }

  const handleUploadProfileimage = async (e) => {
    const file = e.target.files[0];
    setImg(file);
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
  }

  const updateProfile = async () => {
    if(!displayName || !experience || !walletAddress) {
      alert('Please fill all the fields')
      return
    }

    const imageRef = ref(storage, `images/${img.name}`);
    await uploadBytes(imageRef, img);
    const imageUrl = await getDownloadURL(imageRef);

    const response = fetch(`${BASE_URL}/users/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': 'Bearer ' + localStorage.getItem('token_app_wpl')
      },
      body: JSON.stringify({ 
        "displayName": displayName,
        "experienceDescription": experience,
        "walletAddress": walletAddress,
        "pfp": imageUrl
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
  const removeImgPrveiew = () => {
    setImg(null)
    setImgPreview(null)
  }

  const swtichOnboardingType = () => {
    setIsSignin(!isSignin)
  }

  const navigateToOrgFormPage = () => {
    navigate('/verifyorg')
  }

  const togglePasswordField = () => {
    setIsPass(!isPass)
  }

  useEffect(() => {
    setTimeout(() => {
      setShowForgetPassDialog(false)
    },10000)
  },[showForgetPassDialog])

  // TODO :: FORGOT PASSWORD
  // TODO :: role UI in project details to update
  // TODO :: project github teammates
  // TODO :: animation same as landing
  // TODO :: add reward to leaderboard based on user total rewards earned

  // CLIENT_SECRET = "b643efa0e033531ef1d41d987190fe250483793d"
  // PRIVATE_KEY = "kbDC8BeZIGG1bTKJpvPdj+Rqw9Zf18IFAd21Jw/JBRI="


  const handleUploadClick = () => {
    fileInputRef.current.click();
  }

  const handleGoogleLogin = () => {
    dispatch(displaySnackbar('Feature coming soon!'))
  }

  return (
    <div className='flex justify-center items-center'>
      {!isSignComplete ?
        <div className='mt-32'>
          {!isSignin ? 
            <div onClick={navigateToOrgFormPage} className='flex items-center bg-[#091044] w-fit p-2 gap-1 font-inter font-medium text-[12px] leading-[14.4px] rounded-md hover:bg-[#121534] group  cursor-pointer'>
              <Zap stroke='#97A0F1' size={12}/>
              <p className='text-white88 group-hover:underline'>Want to sponsor a Project? </p>
              <p className='text-white48 group-hover:underline'>Apply to be a part!</p>
            </div>
          : 
            <div onClick={navigateToOrgFormPage} className="flex items-center bg-[#091044] w-fit p-2 gap-1 font-inter font-medium text-[12px] leading-[14.4px] rounded-md group cursor-pointer">
              <Zap stroke='#97A0F1' size={12} />
              <p className='text-white88 group-hover:underline'>New to WPL?</p>
              <p className='text-white48 group-hover:underline'>Apply to be a part!</p>
            </div>
          }
          
          <div className='mt-4'>
            <div className='text-primaryYellow font-gridular text-[24px] leading-[28.8px]'>Start contributing Onchain</div>
            <p className='text-white48 font-semibold text-[12px] font-inter'>Earn in crypto by contributing to your fav projects</p>
          </div>

          {showForgetPassDialog &&
            <div onClick={() => navigate('/forgetpassword')} className="flex items-center justify-center mt-3 -mb-1 text-[#FBF1B8] bg-white7 p-2 gap-1 font-inter font-medium text-[12px] leading-[14.4px] rounded-md">
              <Info size={12}  />
              <p className=''>We've sent a link to your registered mail to reset your password.</p>
            </div>
          }

          <div className='bg-white4 rounded-lg p-3 mt-6 min-w-[400px]'>
            <div className='bg-[#091044] rounded-lg p-3'>
              <div onClick={handleGoogleLogin} className='flex justify-between items-center group cursor-pointer'>
                <div className='flex items-center gap-1 text-white88 text-[14px] font-inter group-hover:underline'>{isSignin ? "Log in" : "Sign up with"} Google <img src={googleLogo} width={12} height={12} /></div>
                <div><ArrowRight size={18} stroke='#FFFFFF52'/></div>
              </div>
              <div className='my-4 border border-dashed border-[#FFFFFF12]'/>
              <div>
                <p className='text-white32 font-medium font-inter text-[13px] leading-[15.6px]'>{isSignin ? "Log in" : "Sign up"} with Email</p>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type="email" placeholder="User@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                <MessageSquareMoreIcon stroke='#FFFFFF52'/>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type={isPass ? 'password' : 'text'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                {isPass ? <EyeIcon className='cursor-pointer' onClick={togglePasswordField} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer' onClick={togglePasswordField} stroke='#FFFFFF52'/> }
              </div>

              {error && <div className='bg-[#F03D3D1A] rounded-md px-2 py-2 mt-4 flex items-center gap-1'>
                <MailWarningIcon stroke='#F03D3D' size={14} className='mr-1'/>
                <p className='text-[#F03D3D] font-semibold text-[12px] font-inter leading-[14.4px]'>{error}</p>
              </div>}

              {isSignin && 
                <p className='mt-1 text-[12px] text-center text-white32 font-medium text-inter'>Forgot your Password?<span onClick={() => {console.log(setShowForgetPassDialog(true))}} className='text-primaryYellow cursor-pointer ml-[4px] hover:underline'>Reset it</span></p>
              }

            </div>
                <div className='mt-4'>
                  <FancyButton 
                    src_img={loginBtnImg} 
                    hover_src_img={loginBtnHoverImg} 
                    img_size_classes='w-[376px] h-[44px]' 
                    className='mt-1 font-gridular text-white64 text-[14px] leading-[8.82px]' 
                    btn_txt={isSignin ? 'login' : 'signup'} 
                    onClick={isSignin ? login : signUp} 
                  />
                </div>
          </div>

          <div className='flex justify-center items-center mt-2 gap-2'>
            <div onClick={swtichOnboardingType} className='text-[12px] text-white32 font-semibold text-inter mr-1'>
              {isSignin
                ? <p>Do not have an account?<span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] hover:underline'>Sign up now!</span></p>
                : <p>Already have an account? <span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] hover:underline'>Login</span></p>
              }
            </div>
          </div>
        </div>
      :
        <div className='w-full'>
          <div className='w-full'>
            <img src={headerPng} alt='header' className='h-[200px] w-full'/>
          </div>

          <div className='flex flex-col justify-center items-center'>
            <div className='w-[350px] md:w-[480px] mb-10'>
              <div className='-translate-y-8'>
                {imgPreview ? 
                    <div className='relative size-fit'>
                        <img src={imgPreview} alt='dummy' className='size-[72px] aspect-square rounded-md'/>
                        <div onClick={() => {removeImgPrveiew()}} className='absolute -top-1 -right-1 bg-white64 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                    </div>
                :   <>
                      <div onClick={handleUploadClick} className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
                        <Upload size={16} className='text-white32'/>
                        <input
                          name='img'
                          type="file"
                          ref={fileInputRef}
                          onChange={handleUploadProfileimage}
                          style={{ display: 'none' }}
                        />                           
                      </div>
                      <div className='text-[14px] font-inter'>
                          <p className='text-white88'>Add a profile image</p>
                          <p className='text-white32'>Recommended 1:1 aspect ratio</p>
                      </div>
                    </>
                }
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

                <div className='mt-8 py-1'>
                  <FancyButton 
                    src_img={loginBtnImg} 
                    hover_src_img={loginBtnHoverImg} 
                    img_size_classes='w-[350px] md:w-[480px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                    btn_txt='submit'  
                    alt_txt='submit sign up btn' 
                    onClick={updateProfile}
                  />
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

// TODO :: tabs refactor in home page
// live first for user
// all first for sponsor

// TODO :: add banner on explore page


