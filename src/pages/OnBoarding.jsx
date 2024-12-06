import { ArrowRight, EyeIcon, EyeOffIcon, Info, MailWarningIcon, Menu, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, email_regex } from '../lib/constants'

import { useDispatch } from 'react-redux'
import headerPng from '../assets/images/prdetails_header.png'
import loginBtnHoverImg from '../assets/svg/btn_hover_subtract.png'
import loginBtnImg from '../assets/svg/btn_subtract_semi.png'
import googleLogo from '../assets/svg/google_symbol.png'

import FancyButton from '../components/ui/FancyButton'
import { getUserDetails } from '../service/api'
import { setUserId } from '../store/slice/userSlice'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, provider, signInWithPopup, storage } from '../lib/firebase'

import videoMp4 from '../assets/dummy/v1.mp4'
import mailSVG from '../assets/icons/pixel-icons/mail.svg'
import GlyphEffect from '../components/ui/GlyphEffect'
import DiscordSvg from '../assets/svg/discord.svg'

const addressRegex = /^(0x)[0-9a-fA-F]{40}$/;
const discordRegex = /^[a-zA-Z0-9_]{2,32}#\d{4}$/

const OnBoarding = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('') // Changed from firstName to email
  const [password, setPassword] = useState('')

  const [displayName, setDisplayName] = useState('') // Changed from firstName to email
  const [experience, setExperience] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [discord, setDiscord] = useState('')

  const [isSignin, setIsSignin] = useState(true)

  const [isSignComplete, setIsSignComplete] = useState(false)

  const [error, setError] = useState('')

  const [isPass, setIsPass ] = useState(true);
  const [showForgetPassDialog, setShowForgetPassDialog] = useState(false);

  const [img, setImg] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [googleImg, setGoogleImg] = useState(null)

  const [imgUploadHover, setImgUploadHover] = useState(false)

  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({
    displayName: '',
    experience: '',
    discord: '',
    walletAddress: '',
    img: ''
  });

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
    const newErrors = {
      displayName: !displayName ? 'Please fill the name field' : '',
      experience: !experience ? 'Please fill the experience field' : '',
      discord: !discord ? 'Please fill the Discord ID field' : !discordRegex.test(discord) ? 'Invalid Discord ID. Please enter your Discord ID in the following format: Username#1234.' : '',
      walletAddress: !walletAddress ? 'Please fill the wallet address field' : !addressRegex.test(walletAddress) ? 'Invalid ERC-20 address' : '',
      img: !img ? 'Please upload a profile image' : ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
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
        displayName: displayName,
        experienceDescription: experience,
        socials: {
          discord: discord
        },
        walletAddress: walletAddress,
        pfp: googleImg || imageUrl
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
    setError("")
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

  const handleUploadClick = () => {
    fileInputRef.current.click();
  }

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { accessToken, displayName, email, photoURL } = result.user;
    
      const response = fetch(`${BASE_URL}/account/loginWithFirebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json())
      .then((data) => {

        console.log('signup', data)
        if(data?.data?.token) {
          localStorage.setItem('token_app_wpl', data?.data?.token)
          dispatch(setUserId(data?.data?.userId))

          getUserDetails(data?.data?.userId).then((data) => {
            if(
                data.displayName ||
                data.experienceDescription ||
                data.walletAddress
              ) {
              navigate('/allprojects')
              return              
            } else {
              setIsSignComplete(true)
              setError('')
              setEmail(email)
              setDisplayName(displayName)
              setGoogleImg(photoURL)
              setImgPreview(photoURL)
              setImg(photoURL)
              return
            }
          })
        } 
        if(data.message === `This email ${email} already exists`) {
          setError(data.message)
        }
        // Handle invalid bearer token scenario
        if(data.message === 'invalid google sign in creds') {
          setError("Invalid Google Sign in credentials. Please try again.")
        }
      })
      console.log("User signed in with Google:", result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const [text, setText] = useState("Sign Up");
  const [isHovering, setIsHovering] = useState(false);
  const [hovered, setHovered] = useState(false);
  const controlledVariants = ["NGIS PU", "GNIS PU", "NGIS PU", "$Sign Up",  "Sign Up"]; // Predefined variations

  const handleMouseEnter = () => {
    if(isSignin) {
      setHovered(true);
      return
    }
    // if (isHovering) return;
    // setIsHovering(true);

    // let step = 0;

    // const interval = setInterval(() => {
    //   if (step < controlledVariants.length) {
    //     setText(controlledVariants[step]);
    //     step++;
    //   } else {
    //     clearInterval(interval);
    //     setIsHovering(false);
    //   }
    // }, 600);
  };

  return (
    <div className='flex justify-center items-center'>
      {!isSignComplete ?
        <div className='mt-32'>
          {!isSignin &&
          <div onClick={navigateToOrgFormPage} className='w-[300px] cursor-pointer'>
            <video 
             autoPlay
             loop
             muted
             playsInline
             disablePictureInPicture
            >
              <source src={videoMp4} type="video/mp4"/>
            </video>
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
              <div onClick={handleGoogleSignUp} className='flex justify-between items-center group cursor-pointer'>
                <div className='flex items-center gap-1 text-white88 text-[14px] font-inter group-hover:underline'>{isSignin ? "Log in" : "Sign up with"} Google <img src={googleLogo} width={12} height={12} /></div>
                <div><ArrowRight size={18} stroke='#FFFFFF52'/></div>
              </div>
              <div className='my-4 border border-dashed border-[#FFFFFF12]'/>
              <div>
                <p className='text-white32 font-medium font-inter text-[13px] leading-[15.6px]'>{isSignin ? "Log in" : "Sign up"} with Email</p>
              </div>
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type="email" placeholder="User@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                <img src={mailSVG} alt='email' className='w-[22px] h-[22px]'/>
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
                <div className='mt-4 overflow-hidden' onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
                  <FancyButton 
                    src_img={loginBtnImg} 
                    hover_src_img={loginBtnHoverImg} 
                    img_size_classes='w-[376px] h-[44px]' 
                    className='mt-2 font-gridular text-white64 text-[14px] leading-[8.82px]' 
                    btn_txt={isSignin ? 
                      <>
                        <span
                          className={`absolute left-0 -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ${
                            hovered ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
                          }`}
                        >
                          Login
                        </span>
          
                        <span
                          className={`absolute left-full -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ease-out ${
                            hovered
                              ? "-translate-x-full opacity-100 scale-110"
                              : "translate-x-0 opacity-0"
                          }`}
                        >
                          We&apos;re so back!
                        </span>
                      </>
                      : <GlyphEffect text={'SIGN UP'} isNav={false} />
                    } 
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
                      <div 
                        onMouseEnter={() => setImgUploadHover(true)} 
                        onMouseLeave={() => setImgUploadHover(false)} 
                        onClick={handleUploadClick} 
                        className={`relative bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer ${errors.img ? 'border border-[#F03D3D]' : ""} `}
                      >
                        <Upload size={16} className={`text-white32 absolute ${imgUploadHover ? "animate-hovered" : ""}`}/>
                        <input
                          name='img'
                          type="file"
                          ref={fileInputRef}
                          onChange={handleUploadProfileimage}
                          style={{ display: 'none' }}
                        />                           
                      </div>
                      <div className='text-[14px] font-inter mt-1'>
                          <p className='text-white88'>Add a profile image <span className='text-[#F03D3D]'>*</span></p>
                          <p className='text-white32'>Recommended 1:1 aspect ratio</p>
                      </div>
                      {errors.img && <span className='text-red-500 text-sm'>{errors.img}</span>}
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
                <div className='flex items-start gap-4 w-full'>
                  <div className='w-full'>
                    <div>
                      <div className='text-white32 font-semibold font-inter text-[13px]'>Your Name <span className='text-[#F03D3D]'>*</span></div>
                      <div className={`bg-[#FFFFFF12] rounded-md ${errors.displayName ? 'border border-[#F03D3D]' : ""}`}>
                        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} type='text' placeholder='John' className='w-full bg-transparent py-2 px-2 outline-none text-white'/>
                      </div>
                      {errors.displayName && <span className='text-red-500 text-sm'>{errors.displayName}</span>}
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
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Do you have experience designing application? <span className='text-[#F03D3D]'>*</span></div>
                  <textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder='Yes, I have 5 years of experience in designing applications' className={`w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] text-white outline-none ${errors.experience ? 'border border-[#F03D3D]' : ""}`} rows={4}/>
                  {errors.experience && <span className='text-red-500 text-sm'>{errors.experience}</span>}
                </div>


                <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Discord ID <span className='text-[#F03D3D]'>*</span></div>
                  <div className='bg-white7 rounded-md px-3 py-2 flex items-center gap-2'>
                    <img src={DiscordSvg} alt='discord' className='size-[20px]'/>
                    <input 
                      type='text' 
                      placeholder='discord.gg' 
                      className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full' 
                      value={discord} 
                      onChange={(e) => setDiscord(e.target.value)} 
                    />
                  </div>
                  {/* <input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder='' className={`w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] ${errors.discord ? 'border border-[#F03D3D]' : ""} outline-none text-white`}/> */}
                  {errors.discord && <span className='text-red-500 text-sm'>{errors.discord}</span>}
                </div>

                <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Enter ypur ERC-20 Address <span className='text-[#F03D3D]'>*</span></div>
                  <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder='0x101..' className={`w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] ${errors.walletAddress ? 'border border-[#F03D3D]' : ""} outline-none text-white`}/>
                  {errors.walletAddress && <span className='text-red-500 text-sm'>{errors.walletAddress}</span>}
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