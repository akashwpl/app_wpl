import React, { useState } from 'react'
import wpllogo from '../assets/svg/wolf_logo.svg'
import hourglass from '../assets/images/green_hourglass.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)
  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }


  return (
    <div className='bg-[#091E67] w-full flex md:px-10 lg:px-20 h-[64px]'>
      <div className='hidden md:flex justify-between items-center w-full'>
        <div className='flex items-center gap-[24px] text-[12px] lg:text-[14px] text-primaryYellow font-bienvenue'>
          <p>BOUNTIES</p>
          <p>PROJECTS</p>
          <p>GRANTS</p>
        </div>
        <div className='-translate-x-10'>
          <div className='z-[100]'>
            <Link to={'/'}><img src={wpllogo} alt='wolf logo' className='w-[22px] h-[25px]'/></Link>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <img src={hourglass} alt='hourglass' className='w-[16px] h-[24px]'/>
          <p className='text-primaryYellow'>DACOITETH</p>
        </div>
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
            <Link to={'/'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2'>BOUNTIES</h2></Link>
            <Link to={'/'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2'>PROJECTS</h2></Link>
            <h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2'>GRANTS</h2>
            <Link to={'/'}><h2 className='text-[24px] text-primary border-b border-white/5 w-[90%] mb-2'>LEADERBOARD</h2></Link>
            <h2 className='text-[24px] text-primary w-[90%] mb-2'>FAQ</h2>
          </div>
        </div>
          
      </div>
    </div>
  )
}

export default Navbar