import React, { useEffect, useState } from 'react'
import wpllogo from '../assets/svg/wolf_logo.svg'
import hourglass from '../assets/images/green_hourglass.png'
import wolfButton from '../assets/images/BW.png'
import arrow from '../assets/images/arrow.png'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from '../service/api'
import { LayoutDashboardIcon, LogOut, LucideInfo, SquareChartGantt, User } from 'lucide-react'
import GlyphEffect from './ui/GlyphEffect'

import menuBtnImg from '../assets/svg/menu_btn_subtract.png'
import menuBtnImgHover from '../assets/svg/menu_btn_hover_subtract.png'
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

  return (
    <div className='bg-[#091E67] w-full flex md:px-10 lg:px-20 h-[64px]'>
      <div className='hidden md:flex justify-between items-center w-full'>
        <div className='flex items-center gap-[24px] text-[12px] lg:text-[14px] text-primaryYellow font-bienvenue'>
          {/* <p>BOUNTIES</p> */}
          {/* <p>PROJECTS</p> */}

          <Link to={'/allprojects'}><GlyphEffect text={'EXPLORE'} /></Link>

          {/* <p>GRANTS</p> */}
          <Link to={'/leaderboard'}><GlyphEffect text={'LEADERBOARD'} /></Link>
        </div>
        <div className='-translate-x-10'>
          <div className='z-[100]'>
            <Link to={'/allprojects'}><img src={wpllogo} alt='wolf logo' className='w-[22px] h-[25px]' /></Link>
          </div>
        </div>

        {!pathname?.includes('onboarding') && !pathname?.includes('forgetpassword') &&
          <div>
            <div onClick={() => setShowUserMenu((prev) => !prev)} className='relative cursor-pointer flex flex-row items-center justify-center'>
              {showUserMenu &&
                <div className='absolute top-12 w-[196px] bg-[#101C7703] rounded-md transition duration-300 pb-1 text-primaryYellow text-[14px] leading-[8.82px] font-gridular uppercase backdrop-blur-[52px]'>
                  <Link to={'/profile'} className='hover:bg-white12 cursor-pointer h-8 flex justify-start items-center pl-5 rounded-sm gap-2'><User size={18} color='#FBF1B8' />My Profile</Link>
                  
                  <Link to={'/userprojects'} className='hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2'><SquareChartGantt size={18} color='#FBF1B8' />List Projects</Link>
                  
                  {
                    userDetail?.role === 'admin' && 
                    <>
                      <Link to={'/requests'} className='hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2'><LucideInfo size={18} color='#FBF1B8' />Requests</Link>
                      
                    </>
                  }
                  <Link to={'/'} className='hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 gap-2'><LayoutDashboardIcon size={18} color='#FBF1B8' />Dashboard</Link>
                  
                  <div onClick={signout} className='text-[#E38070] hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-5 rounded-sm gap-2'><LogOut size={18} color='#E38070' />Sign out</div>
                </div>
              }
              <button 
                className='relative' 
                onMouseEnter={handleMenuHover}
                onMouseLeave={handleMenuHover}
              >
                  <img 
                    src={menuHover ? menuBtnImgHover : menuBtnImg } 
                    alt='menu btn'
                    className='w-[196px] h-[44px]'
                  />
                  <div className="absolute inset-0 top-1/4 uppercase flex items-center justify-center gap-2 mb-2">
                    <img src={wolfButton} width={18} alt='wolf' /> 
                    <p className='font-gridular text-primaryYellow text-[14px] leading-[8.82px]'>{userDetail?.displayName}</p>
                    <img src={arrow} width={14} alt='down arraow' />
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
            <Link to={'/allprojects'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2'>EXPLORE</h2></Link>
            <Link to={'/leaderboard'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2'>LEADERBOARD</h2></Link>
            <h2 className='text-[24px] text-primary w-[90%] mb-2'>FAQ</h2>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar