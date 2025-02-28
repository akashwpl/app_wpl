import { useQuery } from '@tanstack/react-query'
import { Bell, LogOutIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import arrow from '../assets/images/arrow.png'
import wpllogo from '../assets/svg/wolf_logo.svg'
import { getUserDetails } from '../service/api'
import GlyphEffect from './ui/GlyphEffect'

import menuBtnImgHover from '../assets/svg/menu_btn_hover_subtract.png'
import menuBtnImg from '../assets/svg/menu_btn_subtract.png'
import { setUserId, setUserRole } from '../store/slice/userSlice'

import docSVG from '../assets/icons/pixel-icons/document2-yellow.svg'
import hourglassSVG from '../assets/icons/pixel-icons/hourglass-yellow.svg'
import profileSVG from '../assets/icons/pixel-icons/profile-yellow.svg'
import listSVG from '../assets/icons/pixel-icons/search-list-yellow.svg'
import tickSVG from '../assets/icons/pixel-icons/tick-outline-yellow.svg'
import trophySVG from '../assets/icons/pixel-icons/trophy-yellow.svg'

import userMenuBorderSVG from '../assets/svg/Button2.svg'
import sponsorMenuBorderSVG from '../assets/svg/Button.svg'
import adminMenuBorderSVG from '../assets/svg/admin_menu_bg.svg'
import useNavBar from './useNavHook'
import { BASE_URL } from '../lib/constants'

const menuBorderImgType = {
  'user': {
    height: 'h-[141px]',
    img: userMenuBorderSVG,
  },
  'sponsor': {
    height: 'h-[141px]',
    img: userMenuBorderSVG,
    // height: 'h-[180px]',
    // img: sponsorMenuBorderSVG
  }, 
  'admin': {
    // height: 'h-[215px]',
    // img: adminMenuBorderSVG
    height: 'h-[180px]',
    img: sponsorMenuBorderSVG
  } 
}

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const { notificationCount } = useNavBar()

  const { user_id } = useSelector((state) => state)
  console.log('user_id', user_id)

  const { data: userDetail } = useQuery({
    queryKey: ['userDetails', user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id
  })

 
  const [showNavbar, setShowNavbar] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [slideUserMenu, setSlideUserMenu] = useState(false)

  const [menuHover, setMenuHover] = useState(false)

  const token = localStorage.getItem('token_app_wpl')

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target)
      ) {
        setSlideUserMenu(false);
        setTimeout(() => {
          setShowUserMenu(false);
        }, 300);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[menuRef])

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  useEffect(() => {
    if(!userDetail) return
    dispatch(setUserRole(userDetail?.role))
  }, [userDetail])

  const signout = () => {
    localStorage.removeItem('token_app_wpl')
    dispatch(setUserId(''))
    dispatch(setUserRole(''))
    navigate('/')
  }

  const rewardRef = useRef(null);

  const letters = document?.querySelectorAll('.letter');
  useEffect(() => {

    let currentIndex = 0;
    let timeout
    let isStopped = false;

    if (!letters || letters.length === 0) return;

    function animateLetter() {
      if (!letters[currentIndex]) return;

      const letter = letters[currentIndex];
      letter.style.transition = "transform 0.01s";
      letter.style.transform = "translateY(-7px)";

      timeout = setTimeout(() => {
        letter.style.transform = "translateY(0)";
        currentIndex = (currentIndex + 1) % letters.length;

        // If animation is stopped, only continue until the current cycle completes
        if (showUserMenu || (!showUserMenu && currentIndex !== 0)) {
          animateLetter();
        }
      }, 135);
    }
    
    animateLetter();

    return () => {
      isStopped = true; // Signal to stop the animation
      clearTimeout(animateLetter);
      clearTimeout(timeout);
    }
  }, [rewardRef, letters, showUserMenu])

  const handleMenuToggle = () => {
    setSlideUserMenu(!slideUserMenu);
    setTimeout(() => {
      setShowUserMenu(!showUserMenu);
    }, 300);
  }

  const checkIfUserVerfied = () => {
    const res = fetch(`https://income-api.copperx.io/api/kycs/status/${userDetail?.email}`)
    .then(res => res.json())
    .then(data => {
      console.log('data kyc', data)
      if(data?.statusCode == 404){
        updateUserDetails(false, 'Not Verified')
      } else {
        updateUserDetails(true, 'Verified')
      }
      return data
    })
  }

  const updateUserDetails = (isKYCVerified, kycStatus) => {
    const filteredUser = Object.keys(userDetail)
      .filter(key => !key.startsWith('_') && key !== 'projects' && key !== 'rewards' && key !== 'payments' && key !== 'notifications' && key !== 'projectsParticipated' && key !== 'projectsOngoing' && key !== 'projectsCompleted' && key !== 'projectsInProgress' && key !== 'totalProjectsInWPL' && key !== 'totalAmountSpent' && key !== 'projectsPending')
      .reduce((acc, key) => {
        acc[key] = userDetail[key];
        return acc;
      }, {});

    const body = {
      ...filteredUser,
      isKYCVerified: isKYCVerified,
      kycStatus: kycStatus
    }
    const response = fetch(`${BASE_URL}/users/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'authorization': 'Bearer ' + localStorage.getItem('token_app_wpl')
      },
      body: JSON.stringify({
        ...body
      })
    }).then(res => res.json())
    .then(data => {
      console.log('data updating user details', data)
      return data
    })
  }

  const {data} = useQuery({
    queryKey: ['userVerification', userDetail?.email],
    queryFn: checkIfUserVerfied,
    enabled: !!userDetail?.email
  })


  return (
    <div className='bg-[#091E67] w-full flex md:px-10 lg:px-20 h-[64px]'>
      {!pathname.includes('verifyorg') &&
      <div className='hidden md:flex justify-between items-center w-full relative'>
        {/* DESKTOP */}
        <div className='flex items-center gap-[24px] text-[12px] lg:text-[14px] font-gridular'>
          {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && <Link to={'/'}><GlyphEffect text={'BOUNTIES'}/></Link>}
          {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && <Link to={'/grants'}><GlyphEffect text={'GRANTS'}/></Link>}
          {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && <Link to={'/wplprogram'}>
            <div className='flex items-center gap-[6px] rounded-md bg-[#091044] px-2 py-1'>
              <img src={wpllogo} alt='wolf logo' className='w-[12px] h-[14px]' />
              <p className='text-white88'>WPL Program</p>
            </div>
          </Link>
          }
          {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && <Link to={'/leaderboard'}><GlyphEffect text={'LEADERBOARD'} /></Link>}
        </div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
          <div className='z-[100] translate-x-7'>
            <Link to={'/'}><img src={wpllogo} alt='wolf logo' className='w-[22px] h-[25px]' /></Link>
          </div>
        </div>

        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') &&
          <div className='flex items-center gap-4'>
            {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && token &&
            <div className='hidden md:block'>
              <Link className='relative' to='/notifications'>
                <Bell size={25} className='text-primaryYellow'/>
                {notificationCount > 0 && 
                  <p className='absolute left-3 bottom-4 text-white88 bg-cardRedText/90 rounded-full text-[10px] size-4 text-center'>{notificationCount}</p>
                }
              </Link>
            </div>}
            <div
              ref={menuRef}
              onClick={() => {token ? handleMenuToggle() : navigate('/onboarding')}}
              className="relative cursor-pointer flex flex-row items-center justify-center z-50"
            >
              {showUserMenu && token && (
                <>
                  <div

                    className={`${menuBorderImgType[userDetail?.role]?.height} z-50 rounded-lg backdrop-blur-2xl bg-black/20  bg-cover w-full absolute top-12 right-0 text-primaryYellow text-[14px] leading-[8.82px] font-gridular uppercase ${
                      slideUserMenu ? 'animate-menu-slide-in' : 'animate-menu-slide-out'
                    }`}
                    style={{backgroundImage: `url(${menuBorderImgType[userDetail?.role]?.img})`, zIndex: 100}}
                  >
                    <Link
                      to={`/profile/${userDetail?.socials?.discord}`}
                      className="hover:bg-white12 cursor-pointer h-8 flex justify-start items-center pl-5 rounded-sm gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <img src={profileSVG} alt="profile" className='size-[20px]' />
                        <p>My Profile</p>
                      </div>
                    </Link>
                    {/* {userDetail?.role !== 'user' && (
                      <>
                        <Link
                          to="/userprojects"
                          className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <img src={docSVG} alt="projects" className='size-[20px]' />
                            <p>My Listings</p>
                          </div>                          
                        </Link>
                      </>
                    )} */}
                    {userDetail?.role === 'admin' && (
                      <>
                        <Link
                          to="/requests"
                          className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <img src={hourglassSVG} alt="requests" className='size-[20px]' />
                            <p>Requests</p>
                          </div> 
                        </Link>
                      </>
                    )}
                    <Link
                      to="/userprojects"
                      className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <img src={listSVG} alt="dashboard" className='size-[20px]' />
                        <p>Dashboard</p>
                      </div> 
                    </Link>
                    <Link
                      to="/rewards"
                      className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <img src={trophySVG} alt="rewards" className='size-[20px]' />
                        <p>Rewards</p>
                      </div>
                    </Link>
                    {/* {userDetail?.role === 'user' && (
                      <>
                        <Link
                          to="/verifyorg"
                          className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <img src={tickSVG} alt="Join as org icon" className='size-[20px]' />
                            <p>Join as Org</p>
                          </div> 
                        </Link>
                        <div className="h-[1px] w-full bg-white7 rounded-sm" />
                      </>
                    )} */}
                    <div
                      onClick={signout}
                      className="text-[#E38070] hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 rounded-sm gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <LogOutIcon size={18} className='rotate-180'/>
                        <p>Sign out</p>
                      </div> 
                    </div>
                  </div>
                </>
              )}
              <button className="relative">
                <img
                  src={menuHover ? menuBtnImgHover : menuBtnImg}
                  alt="menu btn"
                  className="w-[200px] h-[44px]"
                  onMouseOver={() => setMenuHover(!menuHover)}
                />
                <div className="absolute inset-0 top-1/4 uppercase flex items-center justify-center gap-2 mb-2">
                  <img src={token ?userDetail?.pfp || wpllogo : wpllogo} width={18} alt="wolf" />
                  <p className="font-gridular text-primaryYellow truncate">
                    {token ? <span className="text-primaryYellow text-[14px] tracking-[0.12rem] flex">
                      {userDetail && userDetail.displayName &&
                        Array.from(userDetail?.displayName)?.slice(0, 8)?.map((letter, index) => (
                          <span key={index} className="letter">
                            {letter}
                          </span>
                        ))}
                        {userDetail?.displayName?.length > 8 && "..."}
                    </span> : "Login"}
                  </p>
                  <img
                    src={arrow}
                    width={18}
                    alt="down arrow"
                    className={`${showUserMenu ? "animate-step-rotate" : "animate-step-rotate-back"} transition-all`}
                  />
                </div>
              </button>
            </div>
          </div>
        }
      </div>
      }

      {/* MOBILE */}
      <div className='flex relative md:hidden justify-between items-center w-full'>
        <div className='z-[100]'>
          <Link to={'/'}><img src={wpllogo} alt='wolf logo' className='translate-x-14 w-6 h-7' /></Link>
        </div>
        
        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword')  && 
        <div className='flex items-center gap-4'>
          {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && token && 
            <div className='-translate-x-12'>
              <Link to='/notifications'>
                <Bell size={25} className='text-primaryYellow'/>
              </Link>
            </div>
          }
          <div onClick={handleShowNavbar} className='h-[28px] -translate-x-10 cursor-pointer z-[100]'>
            <div id="nav-icon3" className={showNavbar ? 'open' : ''}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          </div>
        }

        {showNavbar && <div onClick={handleShowNavbar} className='absolute -top-8 left-0 h-screen w-full bg-[#16237F]/30 backdrop-blur-sm z-[50]' />}

        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && 
        <div className={`absolute -top-8 left-0 ${showNavbar ? 'translate-y-0' : '-translate-y-[900px]'} transition-all duration-500 w-full bg-[#16237F] z-50`}>
          {
            token ?
            <div className='flex flex-col justify-center items-center text-center bg-[#16237F] font-bienvenue mt-20 text-[24px] text-primaryYellow'>
              <Link to={`/profile/${userDetail?.socials?.discord}`} onClick={() => setShowNavbar(false)}>
                <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                  <img src={profileSVG} alt="profile" className='size-[20px]' />
                  <p>Profile</p>
                </div>
              </Link>
              {userDetail?.role !== 'user' && (
                <Link to={'/'} onClick={() => setShowNavbar(false)}> 
                  <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                    <img src={docSVG} alt="projects" className='size-[20px]' />
                    <p>Explore</p>
                  </div>
                </Link>
              )}
              {userDetail?.role === 'admin' && (
                <Link to={'/requests'} onClick={() => setShowNavbar(false)}> 
                  <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                    <img src={hourglassSVG} alt="requests" className='size-[20px]' />
                    <p>Requests</p>
                  </div>
                </Link>
              )}
              <Link to={'/'} onClick={() => setShowNavbar(false)}> 
                <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                  <img src={listSVG} alt="dashboard" className='size-[20px]' />
                  <p>Dashboard</p>
                </div>
              </Link>
              <Link to={'/rewards'} onClick={() => setShowNavbar(false)}> 
                <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                  <img src={trophySVG} alt="rewards" className='size-[20px]' />
                  <p>Rewards</p>
                </div>
              </Link>
              {/* {userDetail?.role === 'user' && (
                  <Link
                    to="/verifyorg"
                    onClick={() => setShowNavbar(false)}
                  >
                    <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                      <img src={tickSVG} alt="Join as org icon" className='size-[20px]' />
                      <p>Join as Org</p>
                    </div> 
                  </Link>
              )} */}
              <div onClick={signout} className='text-[#E38070]'>
                <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2 cursor-pointer" onClick={() => setShowNavbar(false)}>
                  <LogOutIcon size={30} className='rotate-180'/>
                  <p>Logout</p>
                </div>
              </div>
            </div>
            :
            <div className='flex flex-col justify-center items-center text-center bg-[#16237F] font-bienvenue mt-20 text-[24px] text-primaryYellow'>
              <Link to={'/onboarding'} onClick={() => setShowNavbar(false)}>
                <div className="flex items-center gap-2  w-[90%] mb-6">
                  <img src={profileSVG} alt="login" className='size-[20px]' />
                  <p>Login</p>
                </div>
              </Link>
            </div>
          }
        </div>}
      </div>
    </div>
  )
}

export default Navbar