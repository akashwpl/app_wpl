import { ArrowLeft, ArrowRight, CheckCheck, EyeIcon, EyeOffIcon, Info, MailWarningIcon, Menu, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { APPLY_AS_CHOICE, BASE_URL, email_regex, generateUsername, isValidStarkNetAddress, PROFILE_DETAILS_CHOICE, SIGNUP_CHOICE } from '../lib/constants'

import { useDispatch, useSelector } from 'react-redux'
import headerPng from '../assets/images/prdetails_header.png'
import loginBtnHoverImg from '../assets/svg/btn_hover_subtract.png'
import loginBtnImg from '../assets/svg/btn_subtract_semi.png'
import googleLogo from '../assets/svg/google_symbol.png'
import checkinboxPng from '../assets/svg/check-in-box.png'

import FancyButton from '../components/ui/FancyButton'
import { createUser, getUserDetails, loginWithFirebaseGoogle, singupWithFirebaseGoogle, updateUserProfile, verifyOtp } from '../service/api'
import { setUserDetails, setUserId, setUserRole } from '../store/slice/userSlice'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, provider, signInWithPopup, storage } from '../lib/firebase'

import axios from 'axios'
import videoMp4 from '../assets/dummy/wpl_spon.mp4'
import mailSVG from '../assets/icons/pixel-icons/mail.svg'
import DiscordSvg from '../assets/svg/discord.svg'
import GlyphEffect from '../components/ui/GlyphEffect'
import Spinner from '../components/ui/spinner'

import talent_signup_img from '../assets/images/talent_signup.png'
import contributor_signup_img from '../assets/images/contributor_signup.png'

import greenBtnHoverImg from '../assets/svg/green_btn_hover_subtract.png';
import greenBtnImg from '../assets/svg/green_btn_subtract.png';

const addressRegex = /^(0x)[0-9a-fA-F]{40}$/; 
const discordRegex = /^[a-zA-Z0-9_]{5,32}$/

const OnBoarding = ({setShowSignInModal, isModal = false}) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {pathname, state} = useLocation()

  const {isVerifyOrgBack} = useSelector((state) => state);
  const {user} = useSelector((state) => state);

  const [email, setEmail] = useState('') // Changed from firstName to email
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [displayName, setDisplayName] = useState('') // Changed from firstName to email
  const [experience, setExperience] = useState('')
  // const [walletAddress, setWalletAddress] = useState('')
  const [discord, setDiscord] = useState('')

  const [isSignin, setIsSignin] = useState(true)

  const [isSignComplete, setIsSignComplete] = useState(false)

  const [error, setError] = useState('')

  const [isPass, setIsPass ] = useState(true);
  const [isConfirmPass, setIsConfirmPass ] = useState(true);
  const [showForgetPassDialog, setShowForgetPassDialog] = useState(false);

  const [img, setImg] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [googleImg, setGoogleImg] = useState(null)

  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  console.log('gflow',isGoogleFlow);
  

  const [imgUploadHover, setImgUploadHover] = useState(false)

  const [isOrgSignUp, setIsOrgSignUp] = useState(false)

  const fileInputRef = useRef(null);

  const [isOTPRecieved, setIsOTPRecieved] = useState(false)
  const [gettingOTP, setGettingOTP] = useState(false)
  const [OTPdata, setOTPdata] = useState('')
  
  const [currentScreen, setCurrentScreen] = useState('')

  const [isOTPVerified, setIsOTPVerified] = useState(false)
  const [isuploadingProfile, setIsUploadingProfile] = useState(false)

  const [otpInput, setOtpInput] = useState('')
  const [otperror, setOtpError] = useState('')

  const [applyChoice, setApplyChoice] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    displayName: '',
    experience: '',
    discord: '',
    // walletAddress: '',
    img: ''
  });

  const signUp = async () => {
    if (!email) {
      setError('Please enter email')
      return
    }
    if (!password) {
      setError('Please enter password')
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

    const data = {
      email: email,
      otp: otpInput
    }
    const otpRes = await verifyOtp(data)

    if(!otpRes || otpRes?.err) {
      setError(otpRes?.err || 'Something went wrong..')
    }

    if(otpRes?.success) {
      setIsSignComplete(true)
      setError('')
    }

    // const response = fetch(`${BASE_URL}/users/signup`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password, otp: otpInput }),
    // }).then((res) => res.json())
    // .then((data) => {
    //   if(data?.data?.token) {
    //     localStorage.setItem('token_app_wpl', data?.data?.token)
    //     dispatch(setUserId(data?.data?.userId))
    //     setIsSignComplete(true)
    //     setError('')
    //     return
    //   } 
    //   if(data.message === `This email ${email} already exists`) {
    //     setError(data.message)
    //   }
    //   if(data.message === 'invalid otp') {
    //     setError('Invalid OTP')
    //     // setOtpError('Invalid OTP')
    //   }
    // })
  }

  const login = async () => {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    const validEmail = email_regex.test(email)
    if (!validEmail) {
      setError('Please enter a valid email')
      return
    }

    try {
      const res = await axios.post(`${BASE_URL}/account/login`,{email,password});
      localStorage.setItem('token_app_wpl', res?.data?.data?.token)
      dispatch(setUserId(res?.data?.data?.userId))
  
      getUserDetails(res?.data?.data?.userId).then((data) => {
        setError('')
        if(isModal) setShowSignInModal(false)
        data?.role == 'sponsor' ? navigate('/userprojects') : navigate('/')
      })
    } catch (error) {
      if(error.status == '409') {
        setError(error.response.data.message);
        return
      } else {
        setError('Something went wrong. Try again after sometime!')
        return
      }
    } finally {
      setEmail('')
      setPassword('')
    }
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
    setIsUploadingProfile(true)
    const newErrors = {
      // email: isOrgSignUp && !email ? 'Please fill the email field' : !email_regex.test(email) ? 'Please enter a valid email' : '',
      // password: isOrgSignUp && !password ? 'Please fill the password field' : password !== confirmPassword ? 'Password not matching' : '',
      displayName: !displayName ? 'Please fill the name field' : '',
      experience: !experience && applyChoice === 'user' ? 'Please fill the experience field' : '',
      discord: !discord ? 'Please fill the Discord ID field' : !discordRegex.test(discord) ? 'Discord ID can only contain letters, numbers, and underscores. Must be 5-32 characters.' : '',
      // walletAddress: !walletAddress ? 'Please fill the wallet address field' : !isValidStarkNetAddress(walletAddress) ? 'Invalid Starknet wallet address' : '',
      img: !img ? 'Please upload a profile image' : ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      setIsUploadingProfile(false)
      return;
    }

    const imageRef = ref(storage, `images/${img.name}`);
    await uploadBytes(imageRef, img);
    const imageUrl = await getDownloadURL(imageRef);

    if(applyChoice === 'sponsor') setExperience('Hey, I recently joined WPL as a Sponsor');

    const userBody = { 
      email: email,
      password: password,
      displayName: displayName,
      username: generateUsername(displayName),
      experienceDescription: experience,
      socials: {
        discord: discord.toLowerCase()
      },
      // walletAddress: walletAddress,
      pfp: googleImg || imageUrl,
      isKYCVerified: false,
      kycStatus: "idle"
    }

    if(applyChoice === 'sponsor') {
      setIsUploadingProfile(false)
      dispatch(setUserDetails(userBody))
      navigate('/verifyorg')
      setGettingOTP(false)
    } else {
      let data = null;
      if(isGoogleFlow) {
        const googleSignupBody = {
          email: email,
          displayName: displayName,
          username: generateUsername(displayName),
          experienceDescription: experience,
          socials: {
            discord: discord.toLowerCase()
          },
          pfp: googleImg || imageUrl,
          isKYCVerified: false,
          kycStatus: "idle"
        }
        console.log('g flow brotha');
        data = await singupWithFirebaseGoogle(googleAccessToken,googleSignupBody);
      } else {
        data = await createUser(userBody);
      }
      console.log(data);

      if(data?.token && data?.userId) {
        localStorage.setItem('token_app_wpl', data?.token)
        dispatch(setUserId(data?.userId))
        setIsUploadingProfile(false)
        navigate('/')
        setGettingOTP(false)
        setShowSignInModal(false);
        window.location.reload();
      } else {
        setGettingOTP(false)
        setIsUploadingProfile(false)
        setErrors('Something went wrong. Try again after sometime!')
      }
    }
  }

  const removeImgPrveiew = () => {
    setImg(null)
    setImgPreview(null)
  }

  const swtichOnboardingType = () => {
    setError("")
    setIsSignin(!isSignin)
    // setGettingOTP(false)
    setIsOTPRecieved(false)
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
      setIsGoogleFlow(true);
      setGoogleAccessToken(accessToken);
      const data = await loginWithFirebaseGoogle(accessToken,{email});
      console.log('login google',data);
      
      if(data?.token) {
        localStorage.setItem('token_app_wpl', data?.token)
        dispatch(setUserId(data?.userId))
        navigate('/')
        return
      } 
      else if(data?.err === 'user not found') {
        setError('')
        setEmail(email)
        setDisplayName(displayName)
        setGoogleImg(photoURL)
        setImgPreview(photoURL)
        setImg(photoURL)
        setIsSignComplete(true)
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      window.reload();
      setError(error)
    }
  };

  const [text, setText] = useState("Sign Up");  
  const [isHovering, setIsHovering] = useState(false);
  const [hovered, setHovered] = useState(false);
  const controlledVariants = ["NGIS PU", "GNIS PU", "NGIS PU", "$Sign Up",  "Sign Up"]; // Predefined variations

  const handleMouseEnter = () => {
    // if(isSignin) {
    //   setHovered(true);
    //   return
    // }
    setHovered(true);
  };

  const sendOTP = async () => {
    if(!email) return setError('Please enter email')
    setGettingOTP(true)
    const response = await fetch(`${BASE_URL}/account/getOtp`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email})
    }).then((res) => res.json())
    .then((data) => {
      if(data.data?.status === "success") {
        setIsOTPRecieved(true)
        setGettingOTP(false)
        setIsUploadingProfile(false)
        setError('')
      } else {
        setGettingOTP(false)
        setIsUploadingProfile(false)
        setError(data.message)
      }
    })
  }

  useEffect(() => {
    if(!isOrgSignUp) return
    const handler = setTimeout(() => {
      if(email) sendOTP()
    }, 4000);

    return () => {
      clearTimeout(handler); // Clear timeout if inputValue changes
    };
  }, [email]);


  const handleGetOTPAfterTypingEmail = (e) => {
    if(!isOrgSignUp) return
    setEmail(e.target.value)
  }

  const handleSwitchScreens = (screenName) => {
    switch (screenName) {
      case SIGNUP_CHOICE: {
        setCurrentScreen(SIGNUP_CHOICE)
        if(isGoogleFlow) {
          setIsSignComplete(false)
        } else {
          setIsSignComplete(false)
          sendOTP() 
        }
        break;
      }
      case APPLY_AS_CHOICE: {
        setCurrentScreen(APPLY_AS_CHOICE);
        setApplyChoice('')
        break;
      }
      case PROFILE_DETAILS_CHOICE: {
        setCurrentScreen(PROFILE_DETAILS_CHOICE)
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    localStorage.removeItem('token_app_wpl')
    dispatch(setUserId(''))
    dispatch(setUserRole(''))
    if(isVerifyOrgBack) {
      setIsSignComplete(true)
      setApplyChoice('sponsor')
      setEmail(user.email);
      setPassword(user.password);
      setDisplayName(user.displayName);
      setExperience(user.experience);
      // setWalletAddress(user.walletAddress);
      setImg(user.pfp);
      console.log('ran');
    }
    console.log('wwpp',isVerifyOrgBack);
    
  },[isVerifyOrgBack])

  return (
    <div className='flex justify-center items-center'>
      {!isSignComplete ?
        <div className='mt-32'>
          
          <div 
            // onClick={handleOrgSignUp} 
            className='w-[300px]'
          >
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

                {isOTPRecieved &&
                <>
                  <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                    <input type={isPass ? 'password' : 'text'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                    {isPass ? <EyeIcon className='cursor-pointer' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> }
                  </div>
                  {!isSignin &&
                  <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                    <input type={isConfirmPass ? 'password' : 'text'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                    {isConfirmPass ? <EyeIcon className='cursor-pointer' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> }
                  </div>
                  }
                  <div className='my-5 border border-dashed border-[#FFFFFF12]'/>
                  <div className='flex justify-between'>
                    <p className='text-white32 font-medium font-inter text-[13px] leading-[15.6px]'>Enter verification code!</p>
                    <p onClick={sendOTP} className='text-white48 font-medium font-inter text-[13px] leading-[15.6px] mr-3 underline cursor-pointer hover:text-white88'>Resend code</p>
                  </div>
                  <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                    <input type="text" placeholder="abc12" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                  </div>
                  </>
                }

                {isSignin &&
                 <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                  <input type={isPass ? 'password' : 'text'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                  {isPass ? <EyeIcon className='cursor-pointer' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> }
                </div>
                }
              
              
              {/* <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type={isPass ? 'password' : 'text'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                {isPass ? <EyeIcon className='cursor-pointer' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> }
              </div>
              {!isSignin &&
              <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                <input type={isConfirmPass ? 'password' : 'text'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                {isConfirmPass ? <EyeIcon className='cursor-pointer' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> }
              </div>
              } */}

              {error && <div className='bg-[#F03D3D1A] rounded-md px-2 py-2 mt-4 flex items-center gap-1'>
                <MailWarningIcon stroke='#F03D3D' size={14} className='mr-1'/>
                <p className='text-[#F03D3D] font-semibold text-[12px] font-inter leading-[14.4px] capitalize'>{error}</p>
              </div>}

              {isSignin && 
                <p className='mt-1 text-[12px] text-center text-white32 font-medium text-inter'>Forgot your Password?<span onClick={() => {console.log(setShowForgetPassDialog(true))}} className='text-primaryYellow cursor-pointer ml-[4px] hover:underline'>Reset it</span></p>
              }

            </div>
              {isSignin ?
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
                    transitionDuration={500}
                  />
                </div>
                :
                <div className='mt-4 overflow-hidden' onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
                  <FancyButton 
                    src_img={loginBtnImg} 
                    hover_src_img={loginBtnHoverImg} 
                    img_size_classes='w-[376px] h-[44px]' 
                    className='mt-2 font-gridular text-white64 text-[14px] leading-[8.82px]' 
                    btn_txt={
                      <>
                        <span
                          className={`absolute left-0 -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ${
                            hovered ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
                          }`}
                        >
                          {gettingOTP ? <Spinner /> : isOTPRecieved ? "Sign Up" : "Get code"}
                        </span>
          
                        <span
                          className={`absolute left-full -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ease-out ${
                            hovered
                              ? "-translate-x-full opacity-100 scale-110"
                              : "translate-x-0 opacity-0"
                          }`}
                        >
                          Verify
                        </span>
                        {/* <GlyphEffect text={''} isNav={false} /> */}
                      </>
                        
                    } 
                    onClick={isOTPRecieved ? signUp : sendOTP} 
                    transitionDuration={500}
                  />
                </div>
              }
              {gettingOTP && <div className='bg-[#0ED0651A] rounded-md px-2 mt-3 h-[42px] flex justify-start items-center gap-1'>
                  <img src={checkinboxPng} alt='check' className='size-[12px]'/>
                  <p className='text-primaryYellow text-[12px] font-inter font-semibold'>Check your email for OTP</p>
                </div>
              }
          </div>

          {/* {pathname?.includes("/onboarding") &&  */}
          <div className='flex justify-center items-center mt-2 gap-2'>
            <div onClick={swtichOnboardingType} className='text-[12px] text-white32 font-semibold text-inter mr-1'>
              {isSignin
                ? <p>Do not have an account?<span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] hover:underline'>Sign up now!</span></p>
                : <p>Already have an account? <span className='text-[12px] text-primaryYellow font-semibold font-inter cursor-pointer ml-[2px] hover:underline'>Login</span></p>
              }
            </div>
          </div>
          {/* } */}
        </div>
      :
      !applyChoice ?
      <>
        <div className='absolute top-10 left-20'>
            <div 
              onClick={() => handleSwitchScreens(SIGNUP_CHOICE)} 
              className='cursor-pointer text-white88 hover:text-white64 flex items-center gap-1 w-fit'
            >
                <ArrowLeft size={14} className=''/>
                <p className='font-inter text-[14px]'>Go back</p>
            </div>
        </div>
        <div className='flex justify-center items-center gap-14 h-[80vh] relative'>

          {/* Apply as Talent */}
          <div className='flex flex-col w-[320px]'>
            <p className='font-gridular text-[24px] text-primaryGreen'>Continue as Talent</p>
            <p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>Create a profile to start submitting, and get notified on new work opportunities</p>

            <div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
              <img className='w-[290px] h-[250px]' src={talent_signup_img} alt="talent_img" />
              <div>
                <p className='font-medium text-white32 font-inter text-xs'><CheckCheck size={18} className='inline-block mr-1'/> Contribute to top projects</p>
                <p className='font-medium text-white32 font-inter text-xs'><CheckCheck size={18} className='inline-block mr-1'/> Build your top resume</p>
                <p className='font-medium text-white32 font-inter text-xs'><CheckCheck size={18} className='inline-block mr-1'/> Get paid in crypto</p>
              </div>
              <FancyButton 
                src_img={greenBtnImg} 
                hover_src_img={greenBtnHoverImg} 
                img_size_classes='w-[500px] h-[44px]' 
                className='font-gridular text-[14px] leading-[8.82px] text-primaryGreen mt-1.5'
                btn_txt='Continue as a talent'  
                alt_txt='project apply btn' 
                onClick={() => {setApplyChoice('user')}}
                transitionDuration={500}
              />
            </div>
          </div>

          {/* Apply as a Contributor */}
          <div className='flex flex-col w-[320px]'>
            <p className='font-gridular text-[24px] text-primaryYellow'>Continue as Sponsor</p>
            <p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>List a bounty or a freelance gig for your project and find your next contributor.</p>

            <div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
              <img className='w-[290px] h-[250px]' src={contributor_signup_img} alt="talent_img" />
              <div>
                <p className='font-medium text-white32 font-inter text-xs'><CheckCheck size={18} className='inline-block mr-1'/> Get in front of 10,000 weekly visitors</p>
                <p className='font-medium text-white32 font-inter text-xs'><CheckCheck size={18} className='inline-block mr-1'/> 20+ templates to choose from</p>
                <p className='font-medium text-white32 font-inter text-xs'><CheckCheck size={18} className='inline-block mr-1'/> 100% free</p>
              </div>
              <FancyButton 
                src_img={loginBtnImg} 
                hover_src_img={loginBtnHoverImg} 
                img_size_classes='w-[500px] h-[44px]' 
                className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                btn_txt='Continue as a Sponsor'  
                alt_txt='project apply btn' 
                onClick={() => {setApplyChoice('sponsor')}}
                transitionDuration={500}
              />
            </div>
          </div>
        </div>
      </>
      :
        <div className='w-full'>
          <div className='w-full'>
            <img src={headerPng} alt='header' className='h-[200px] w-full'/>
          </div>

            <div className='flex items-center gap-1 pl-20 py-2'>
              <ArrowLeft size={14} stroke='#ffffff65'/>
              <p 
                className='text-white32 font-inter text-[14px] cursor-pointer' 
                onClick={() => {handleSwitchScreens(APPLY_AS_CHOICE)}}
              >Go back</p>
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
                        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} type='text' placeholder='John' className='w-full bg-transparent py-2 px-2 outline-none text-white88 placeholder:text-white32'/>
                      </div>
                      {errors.displayName && <span className='text-red-500 text-sm'>{errors.displayName}</span>}
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='text-white32 font-semibold font-inter text-[13px]'>Your Email <span className='text-[#F03D3D]'>*</span></div>
                    <div className={`bg-[#FFFFFF12] rounded-md ${errors.email ? 'border border-[#F03D3D]' : ""}`}>
                      <input 
                        value={email} 
                        onChange={(e) => handleGetOTPAfterTypingEmail(e)} 
                        type='email' 
                        readOnly={!isOrgSignUp} 
                        placeholder='John@wpl.com' 
                        className={`w-full bg-transparent py-2 px-2 outline-none text-white88 placeholder:text-white32 ${!isOrgSignUp && "cursor-default"}`} 
                      />
                    </div>
                    {errors.email && <span className='text-red-500 text-sm'>{errors.email}</span>}
                  </div>
                </div>

                {/* {
                  isOrgSignUp && 
                  <>
                    <div className='mt-4 flex items-start gap-4 w-full'>
                      <div>
                        <p className='text-white32 font-semibold font-inter text-[13px]'>Enter your password <span className='text-[#F03D3D]'>*</span></p>
                        <div className={`flex items-center justify-center bg-[#FFFFFF12] rounded-md ${errors.password ? 'border border-[#F03D3D]' : ""}`}>
                          <input value={password} onChange={(e) => setPassword(e.target.value)} type={isPass ? 'password' : 'text'} placeholder='Password' className='w-full bg-transparent py-2 px-2 outline-none text-white88 placeholder:text-white32'/>
                          {isPass ? <EyeIcon className='cursor-pointer mr-3' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer mr-3' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> }
                        </div>
                      </div>
                      <div>
                          <div className='text-white32 font-semibold font-inter text-[13px]'>Confirm your password <span className='text-[#F03D3D]'>*</span></div>
                          <div className={`flex items-center justify-center bg-[#FFFFFF12] rounded-md ${errors.password ? 'border border-[#F03D3D]' : ""}`}>
                            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={isConfirmPass ? 'password' : 'text'} placeholder='Confirm Password' className='w-full bg-transparent py-2 px-2 outline-none text-white88 placeholder:text-white32'/>
                            {isConfirmPass ? <EyeIcon className='cursor-pointer mr-3' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer mr-3' onClick={() => setIsConfirmPass(!isConfirmPass)} stroke='#FFFFFF52'/> }
                          </div>
                      </div>
                    </div>
                    {errors.password && <span className='text-red-500 text-sm'>{errors.password}</span>}
                  </>
                } */}

                {applyChoice === 'user' &&  
                <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Share your Proof of work? <span className='text-[#F03D3D]'>*</span></div>
                  <textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder='Yes, I have sufficient amount of experience' className={`w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] text-white88 placeholder:text-white32 outline-none ${errors.experience ? 'border border-[#F03D3D]' : ""}`} rows={4}/>
                  {errors.experience && <span className='text-red-500 text-sm'>{errors.experience}</span>}
                </div>
                }


                <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Discord ID <span className='text-[#F03D3D]'>*</span></div>
                  <div className={`bg-white7 rounded-md px-3 py-2 flex items-center gap-2 ${errors.discord ? 'border border-[#F03D3D]' : ""}`}>
                    <img src={DiscordSvg} alt='discord' className='size-[20px]'/>
                    <input 
                      type='text' 
                      placeholder='e.g., JohnDoe123, CodingCat' 
                      className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full' 
                      value={discord} 
                      onChange={(e) => setDiscord(e.target.value)} 
                    />
                  </div>
                  {errors.discord && <span className='text-red-500 text-sm'>{errors.discord}</span>}
                </div>

                {/* <div className='mt-4'>
                  <div className='text-white32 font-semibold font-inter text-[13px]'>Enter your Starknet wallet address <span className='text-[#F03D3D]'>*</span></div>
                  <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder='0x101..' className={`w-full bg-[#FFFFFF12] rounded-md py-2 px-2 text-[13px] ${errors.walletAddress ? 'border border-[#F03D3D]' : ""} outline-none text-white88 placeholder:text-white32`}/>
                  {errors.walletAddress && <span className='text-red-500 text-sm'>{errors.walletAddress}</span>}
                </div> */}

                {/* {isOrgSignUp &&
                <div>
                  <div className='my-5 border border-dashed border-[#FFFFFF12]'/>
                  <p className='text-[14px] font-gridular text-white64'>Enter verification code!</p>
                  <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                    <input type="text" placeholder="abc12" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white12'/>
                  </div>
                  {otperror && <div className='text-red-500 text-[12px]'>{otperror}</div>}
                  {isOTPRecieved &&  <div className='bg-[#0ED0651A] rounded-md px-2 mt-3 h-[42px] flex justify-start items-center gap-1'>
                    <img src={checkinboxPng} alt='check' className='size-[12px]'/>
                    <p className='text-primaryYellow text-[12px] font-inter font-semibold'>Check your email for code</p>
                  </div>
                  }
                 </div>
                } */}

                <div className='mt-8 py-1'>
                  <FancyButton 
                    src_img={loginBtnImg} 
                    hover_src_img={loginBtnHoverImg} 
                    img_size_classes='w-[350px] md:w-[480px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                    btn_txt={isuploadingProfile ? <span className='flex justify-center items-center w-full -translate-y-2'><Spinner /></span>  : applyChoice === 'sponsor' ? 'next steps' : 'submit'}
                    alt_txt='submit sign up btn' 
                    onClick={updateProfile}
                    transitionDuration={500}
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