import React, { useState } from 'react'
import wpllogo from '../assets/svg/wolf_logo.svg'
import hourglass from '../assets/images/green_hourglass.png'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { getUserDetails } from '../service/api'
import { LayoutDashboardIcon, LucideInfo, SquareChartGantt, User } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { user_id } = useSelector((state) => state)

  const {data: userDetail} = useQuery({
    queryKey: ['userDetails', user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id
  })

  const [showNavbar, setShowNavbar] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }



  return (
    <div className='bg-[#091E67] w-full flex md:px-10 lg:px-20 h-[64px]'>
      <div className='hidden md:flex justify-between items-center w-full'>
        <div className='flex items-center gap-[24px] text-[12px] lg:text-[14px] text-primaryYellow font-bienvenue'>
          {/* <p>BOUNTIES</p> */}
          {/* <p>PROJECTS</p> */}
          <Link to={'/allprojects'}><p>EXPLORE</p></Link>

          {/* <p>GRANTS</p> */}
          <Link to={'/leaderboard'}><p>LEADERBOARD</p></Link>
        </div>
        <div className='-translate-x-10'>
          <div className='z-[100]'>
            <Link to={'/allprojects'}><img src={wpllogo} alt='wolf logo' className='w-[22px] h-[25px]'/></Link>
          </div>
        </div>

        {!pathname?.includes('onboarding') && <div onClick={() => setShowUserMenu((prev) => !prev)} className='relative cursor-pointer'>
          <div>
            <div className='flex items-center gap-2'>
              <img src={hourglass} alt='hourglass' className='w-[16px] h-[24px]'/>
              <p className='text-primaryYellow'>{userDetail?.displayName}</p>
            </div>
          </div>
          {showUserMenu &&
            <div className='absolute top-8 -left-2 w-[150px] bg-primaryBlue rounded-md transition duration-300 pb-1'>
              <Link to={'/profile'} className='text-white88 font-semibold hover:bg-white12 cursor-pointer h-8 flex justify-start items-center pl-4 rounded-sm'><User  size={20} color='#FFFFFFE0'/>My Profile</Link>
              <div className='h-[1px] w-full bg-white7 rounded-sm'/>
              <Link to={'/userprojects'} className='text-white88 font-semibold hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-4 gap-1 rounded-sm'><SquareChartGantt size={20} color='#FFFFFFE0'/>My Projects</Link>
              <div className='h-[1px] w-full bg-white7 rounded-sm'/>
              <Link to={'/requests'} className='text-white88 font-semibold hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-4 gap-1 rounded-sm'><LucideInfo size={20} color='#FFFFFFE0'/>Requests</Link>
              <div className='h-[1px] w-full bg-white7 rounded-sm'/>
              <Link to={'/'} className='text-white88 font-semibold hover:bg-white12 cursor-pointer h-9 flex justify-start items-center pl-4 gap-1 rounded-sm'><LayoutDashboardIcon size={20} color='#FFFFFFE0'/>Dashboard</Link>
            </div>
          }
        </div>
        }
    
      </div>

      <div className='flex relative md:hidden justify-between items-center w-full'>
        <div className='z-[100]'>
          <Link to={'/'}><img src={wpllogo} alt='wolf logo' className='translate-x-14 w-6 h-7'/></Link>
        </div>
        <div onClick={handleShowNavbar} className='h-[28px] -translate-x-10 cursor-pointer z-[100]'>
          <div id="nav-icon3" className={showNavbar ? 'open' : ''}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {showNavbar && <div onClick={handleShowNavbar} className='absolute -top-8 left-0 h-screen w-full bg-[#16237F]/30 backdrop-blur-sm z-[50]'/>}
        
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