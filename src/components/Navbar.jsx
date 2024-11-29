import { useQuery } from '@tanstack/react-query'
import { Building2, LayoutDashboardIcon, LogOut, LucideInfo, SquareChartGantt, SquareDashedBottom, Trophy, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import wolfButton from '../assets/images/BW.png'
import arrow from '../assets/images/arrow.png'
import wpllogo from '../assets/svg/wolf_logo.svg'
import { getUserDetails } from '../service/api'
import GlyphEffect from './ui/GlyphEffect'

import menuBtnImgHover from '../assets/svg/menu_btn_hover_subtract.png'
import menuBtnImg from '../assets/svg/menu_btn_subtract.png'
import { setUserRole } from '../store/slice/userSlice'

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

  const [showNavbar, setShowNavbar] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [slideUserMenu, setSlideUserMenu] = useState(false)

  const [menuHover, setMenuHover] = useState(false)

  const handleMenuHover = () => setMenuHover(!menuHover);

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
    console.log('letters', letters)
    if(letters == undefined || letters == null || letters?.length == 0) return
    function animateLetter() {
      const letter = letters[currentIndex];
      letter.style.transition = 'transform 0.01s';
      letter.style.transform = 'translateY(-7px)';

      timeout = setTimeout(() => {
        letter.style.transform = 'translateY(0)';
        currentIndex = (currentIndex + 1) % letters.length;
        animateLetter();
      }, 135);
    }
    
    animateLetter();

    return () => {
      clearTimeout(animateLetter);
      clearTimeout(timeout);
    }
  }, [rewardRef, letters])

  const handleMenuToggle = () => {
    setSlideUserMenu((prev) => !prev);
    setTimeout(() => {
      setShowUserMenu((prev) => !prev);
    }, 300);
  }


  return (
    <div className='bg-[#091E67] w-full flex md:px-10 lg:px-20 h-[64px]'>
      <div className='hidden md:flex justify-between items-center w-full'>
        <div className='flex items-center gap-[24px] text-[12px] lg:text-[14px] text-primaryYellow font-bienvenue'>
          <Link to={'/allprojects'}><GlyphEffect text={'EXPLORE'} /></Link>
          <Link to={'/leaderboard'}><GlyphEffect text={'LEADERBOARD'} /></Link>
        </div>
        <div className='-translate-x-10'>
          <div className='z-[100]'>
            <Link to={'/allprojects'}><img src={wpllogo} alt='wolf logo' className='w-[22px] h-[25px]' /></Link>
          </div>
        </div>

        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') &&
          <div>
            <div
              onClick={handleMenuToggle}
              className="relative cursor-pointer flex flex-row items-center justify-center"
            >
              {showUserMenu && (
                <div
                  className={`absolute top-12 right-0 w-[196px] bg-[#101C7703] rounded-md transition pb-1 text-primaryYellow text-[14px] leading-[8.82px] font-gridular uppercase backdrop-blur-[60px] ${
                    slideUserMenu ? 'animate-menu-slide-in' : 'animate-menu-slide-out'
                  }`}
                >
                  <Link
                    to="/profile"
                    className="hover:bg-white12 cursor-pointer h-8 flex justify-start items-center pl-5 rounded-sm gap-2"
                  >
                    My Profile
                  </Link>
                  {userDetail?.role !== 'user' && (
                    <>
                      <Link
                        to="/userprojects"
                        className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                      >
                        List Projects
                      </Link>
                    </>
                  )}
                  {userDetail?.role === 'admin' && (
                    <>
                      <Link
                        to="/requests"
                        className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                      >
                        Requests
                      </Link>
                    </>
                  )}
                  <Link
                    to="/"
                    className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                  >
                    Dashboard
                  </Link>
                  {userDetail?.role === 'user' && (
                    <>
                      <Link
                        to="/verifyorg"
                        className="hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2"
                      >
                        Join as Org
                      </Link>
                      <div className="h-[1px] w-full bg-white7 rounded-sm" />
                    </>
                  )}
                  <div
                    onClick={signout}
                    className="text-[#E38070] hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 rounded-sm gap-2"
                  >
                    Sign out
                  </div>
                </div>
              )}
              <button
                className="relative"
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              >
                <img
                  src={menuHover ? menuBtnImgHover : menuBtnImg}
                  alt="menu btn"
                  className="w-[200px] h-[44px]"
                />
                <div className="absolute inset-0 top-1/4 uppercase flex items-center justify-center gap-2 mb-2">
                  <img src={userDetail?.pfp || wpllogo} width={18} alt="wolf" />
                  <p className="font-gridular text-primaryYellow truncate">
                    <span className="text-primaryYellow text-[14px] tracking-[0.12rem] flex">
                      {userDetail &&
                        Array.from(userDetail?.displayName)?.map((letter, index) => (
                          <span key={index} className="letter">
                            {letter}
                          </span>
                        ))}
                    </span>
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
          <div className='flex flex-col justify-center items-center text-center bg-[#16237F] text-white font-bienvenue mt-20'>
            <Link to={'/profile'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2 flex items-center gap-1'><User size={18} color='#FBF1B8' /> MY PROFILE</h2></Link>
            <Link to={'/allprojects'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2 flex items-center gap-1'><LayoutDashboardIcon size={18} color='#FBF1B8' /> EXPLORE</h2></Link>
            <Link to={'/leaderboard'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2 flex items-center gap-1'><Trophy size={18} color='#FBF1B8'/> LEADERBOARD</h2></Link>
            <Link to={'/'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2 flex items-center gap-1'><SquareDashedBottom size={18} color='#FBF1B8'/> DASHBOARD</h2></Link>
            <h2 className='text-[24px] text-primary w-[90%] mb-2'>FAQ</h2>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar