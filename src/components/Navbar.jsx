import { useQuery } from '@tanstack/react-query'
import { Bell, LogOutIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import arrow from '../assets/images/arrow.png'
import wpllogo from '../assets/svg/wolf_logo.svg'
import { getNotifications, getUserDetails } from '../service/api'
import GlyphEffect from './ui/GlyphEffect'

import menuBtnImgHover from '../assets/svg/menu_btn_hover_subtract.png'
import menuBtnImg from '../assets/svg/menu_btn_subtract.png'
import { setUserRole } from '../store/slice/userSlice'

import profileSVG from '../assets/icons/pixel-icons/profile-yellow.svg'
import docSVG from '../assets/icons/pixel-icons/document2-yellow.svg'
import hourglassSVG from '../assets/icons/pixel-icons/hourglass-yellow.svg'
import listSVG from '../assets/icons/pixel-icons/search-list-yellow.svg'
import tickSVG from '../assets/icons/pixel-icons/tick-outline-yellow.svg'
import trophySVG from '../assets/icons/pixel-icons/trophy-yellow.svg'

import menuBorderSVG from '../assets/svg/Button.svg'
import adminMenuBorderSVG from '../assets/svg/admin_menu_bg.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const { user_id } = useSelector((state) => state)

  const { data: userDetail } = useQuery({
    queryKey: ['userDetails', user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id
  })

  // const {data: notificationsDetails, isLoading: isLoadingNotificationsDetails, refetch} = useQuery({
  //   queryKey: ['notificationsDetails'],
  //   queryFn: () => getNotifications()
  // })

  const [showNavbar, setShowNavbar] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [slideUserMenu, setSlideUserMenu] = useState(false)

  const [menuHover, setMenuHover] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0);

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
    navigate('/onboarding')
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

  const handleGetNotifications = async () => {
    const resp = await getNotifications();
    const notis = resp.data
      .filter((notification) => !notification.isRead && !notification.isHidden ) // Filter out hidden and red notifications
    setNotificationCount(notis.length);
  }

  useEffect(() => {
    if(!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && token) {
      const fetchData = async () => {
        await handleGetNotifications();
      }
      fetchData();
    }
  },[])

  return (
    <div className='bg-[#091E67] w-full flex md:px-10 lg:px-20 h-[64px]'>
      <div className='hidden md:flex justify-between items-center w-full'>
        <div className='flex items-center gap-[24px] text-[12px] lg:text-[14px] text-primaryYellow font-bienvenue'>
          <Link to={'/allprojects'}><GlyphEffect text={'EXPLORE'} /></Link>
          <Link to={'/leaderboard'}><GlyphEffect text={'LEADERBOARD'} /></Link>
        </div>
        <div className={`${(!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword')) ? token && "translate-x-48" : "-translate-x-10"}`}>
          <div className='z-[100]'>
            <Link to={'/allprojects'}><img src={wpllogo} alt='wolf logo' className='w-[22px] h-[25px]' /></Link>
          </div>
        </div>
        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && token && 
          <div className='translate-x-28 xl:translate-x-72'>
            <Link className='relative' to='/notifications'>
              <Bell size={25} className='text-primaryYellow'/>
              {notificationCount > 0 && 
                <p className='absolute left-3 bottom-4 text-white88 bg-cardRedText/90 rounded-full text-[10px] size-4 text-center'>{notificationCount}</p>
              }
            </Link>
          </div>
        }

        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') &&
          <div>
            <div
              ref={menuRef}
              onClick={() => {token ? handleMenuToggle() : navigate('/onboarding')}}
              className="relative cursor-pointer flex flex-row items-center justify-center z-50"
            >
              {showUserMenu && token && (
                <>
                  <div

                    className={`${userDetail?.role === 'admin' ? 'h-[215px]' : 'h-[180px]'} z-50 rounded-lg backdrop-blur-2xl bg-black/20  bg-cover w-full absolute top-12 right-0 text-primaryYellow text-[14px] leading-[8.82px] font-gridular uppercase ${
                      slideUserMenu ? 'animate-menu-slide-in' : 'animate-menu-slide-out'
                    }`}
                    style={{backgroundImage: `url(${userDetail?.role !== 'admin' ? menuBorderSVG : adminMenuBorderSVG})`, zIndex: 100}}
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
                    {userDetail?.role !== 'user' && (
                      <>
                        <Link
                          to="/userprojects"
                          className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <img src={docSVG} alt="projects" className='size-[20px]' />
                            <p>List Projects</p>
                          </div>                          
                        </Link>
                      </>
                    )}
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
                      to="/"
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
                    {userDetail?.role === 'user' && (
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
                    )}
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
                        Array.from(userDetail?.displayName)?.map((letter, index) => (
                          <span key={index} className="letter">
                            {letter}
                          </span>
                        ))}
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

      <div className='flex relative md:hidden justify-between items-center w-full'>
        <div className='z-[100]'>
          <Link to={'/'}><img src={wpllogo} alt='wolf logo' className='translate-x-14 w-6 h-7' /></Link>
        </div>
        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') && token && 
            <div className='translate-x-60'>
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

        {showNavbar && <div onClick={handleShowNavbar} className='absolute -top-8 left-0 h-screen w-full bg-[#16237F]/30 backdrop-blur-sm z-[50]' />}

        <div className={`absolute -top-8 left-0 ${showNavbar ? 'translate-y-0' : '-translate-y-[900px]'} transition-all duration-500 w-full bg-[#16237F] z-50`}>
          <div className='flex flex-col justify-center items-center text-center bg-[#16237F] font-bienvenue mt-20 text-[24px] text-primaryYellow'>
            <Link to={'/profile'}>
              <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                <img src={profileSVG} alt="profile" className='size-[20px]' />
                <p>Profile</p>
              </div>
            </Link>
            {userDetail?.role !== 'user' && (
              <Link to={'/allprojects'}>
                <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                  <img src={docSVG} alt="projects" className='size-[20px]' />
                  <p>Explore</p>
                </div>
              </Link>
            )}
            {userDetail?.role === 'admin' && (
              <Link to={'/requests'}>
                <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                  <img src={hourglassSVG} alt="requests" className='size-[20px]' />
                  <p>Requests</p>
                </div>
              </Link>
            )}
            <Link to={'/'}>
              <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                <img src={listSVG} alt="dashboard" className='size-[20px]' />
                <p>Dashboard</p>
              </div>
            </Link>
            <Link to={'/rewards'}>
              <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                <img src={trophySVG} alt="rewards" className='size-[20px]' />
                <p>Rewards</p>
              </div>
            </Link>
            {userDetail?.role === 'user' && (
                <Link
                  to="/verifyorg"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                    <img src={tickSVG} alt="Join as org icon" className='size-[20px]' />
                    <p>Join as Org</p>
                  </div> 
                </Link>
            )}
            <div onClick={signout} className='text-[#E38070]'>
              <div className="flex items-center gap-2 border-b border-white/5 w-[90%] mb-2">
                <LogOutIcon size={30} className='rotate-180'/>
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar