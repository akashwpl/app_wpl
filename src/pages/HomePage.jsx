import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import BugFixCard from '../components/home/BugFixCard'
import ExploreGigs from '../components/home/ExploreGigs'
import KYC_Card from '../components/home/KYC_Card'
import ProfileDetailsCard from '../components/home/ProfileDetailsCard'
// import RecentActivityCard from '../components/home/RecentActivityCard'
import { Link, useNavigate } from 'react-router-dom'
import KeepMoneyCard from '../components/cards/KeepMoneyCard'
import WhyStarkNetCard from '../components/cards/WhyStarkNetCard'
import RecentActivityCard from '../components/home/RecentActivityCard'
import Statistics from '../components/home/Statistics'
import { getUserDetails } from '../service/api'
import AdminDashboard from './AdminDashboard'
import SponsorDashboard from './SponsorDashboard'

import fireWhitePng from '../assets/images/fire-white.png'
import bannerPng from '../assets/images/dashboard_banner.png' 
import FancyButton from '../components/ui/FancyButton'

import exploreBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png'
import exploreBtnImg from '../assets/svg/menu_btn_subtract.png'
import sponsorCardPng from '../assets/images/loginSponsorCard.png'
import HowItWorksCard from '../components/home/HowItWorksCard'
import QuestionSVG from '../assets/icons/question.svg'
import { useState } from 'react'
import SignInModal from '../components/SignInModal'
import CustomModal from '../components/ui/CustomModal'


const HomePage = () => {

  const { user_id, user_role } = useSelector((state) => state)
  const navigate = useNavigate();

  const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  }) 

  const token = localStorage.getItem('token_app_wpl')

  if(user_role == 'admin') {
    return <AdminDashboard />
  }

  if(user_role == 'sponsor') {
    return <SponsorDashboard />
  }

  const navigateToFAQs = () => {
    window.open('https://www.thewpl.xyz/learnmore', { target: '_blank' });
  }
  const handleNavigateToSponsorSignUp = () => {
    navigate('/onboarding', {state: {fromHome: true}})
  }

  return (
    <div className='flex flex-row justify-between mt-4'>
      {/* Left side */}
      <div className='flex flex-col px-[46px] mt-4 w-full '>

        <div className='flex justify-between items-center bg-primaryBlue rounded-md border-2 border-[#0000003D] mb-4'>
          <div className='p-6'>
            <div className='text-primaryYellow text-[20px] font-gridular leading-[24px] mb-4'>
              Contribute to your favourite projects <br /> and earn $$$ in rewards
            </div>
            <div>
              <FancyButton 
                src_img={exploreBtnImg}
                btn_txt={"JOIN 480+ FOLKS"}
                hover_src_img={exploreBtnHoverImg}
                img_size_classes='w-[175px] h-[44px]' 
                className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                alt_txt='save project btn'
                onClick={() => {}}
              />
            </div>
          </div>
          <div className='w-[318px] h-full'>
            <img src={bannerPng} alt='banner' className='h-full rounded-br-md'/>
          </div>
        </div>

        {/* <Statistics userDetails={userDetails}/> */}
        {/* <SearchRoles /> */}
        <ExploreGigs userId={user_id}/>
      </div>

      {/* right side */}
      <div className='flex flex-col gap-6 py-6 px-6 border border-y-0 border-r-0 border-l border-l-primaryYellow/20 min-h-[140vh] min-w-[350px] max-w-[350px]'>
        <div onClick={handleNavigateToSponsorSignUp} className='w-full cursor-pointer'>
          <img src={sponsorCardPng} alt='sponsor login'/>
        </div>
        {/* <WhyStarkNetCard />
        <KeepMoneyCard /> */}

        {/* <div className='border border-white12 border-dashed w-full my-4'></div> */}

        {/* <div onClick={navigateToFAQs} className='bg-[#9CD4EC1A] hover:bg-[#9cd4ec2c] rounded-md w-full px-4 py-2 flex items-center gap-3 cursor-pointer'>
          <div className='w-[20px] h-[20px]'>
              <img src={fireWhitePng} alt='fire-white' className='' />
          </div>
          <div className='flex flex-col gap-2'>
              <div className='font-gridular text-[14px] leading-4 text-white'>Hey {userDetails?.displayName}!</div>
              <div className='font-inter text-[12px] leading-[14px] text-white48'>Click here to view all FAQs</div>
          </div>
        </div> */}

        <div className='border border-white12 border-dashed w-full'></div>

        {/* <div className='border border-white12 border-dashed w-full my-4'></div> */}

        {token && !userDetails?.isKYCVerified ? <KYC_Card userDetails={userDetails}/> : null}
        {/* <ProfileDetailsCard userDetails={userDetails} /> */}
        {/* {!token || userDetails?.projectsOngoing == 0 ? null :
          <BugFixCard />
        } */}
        {token && <div className='border border-white12 border-dashed w-full'></div>}
        <RecentActivityCard />
        <div className='border border-white12 border-dashed w-full'></div>
        <HowItWorksCard />
        {/* <div className='border border-white12 border-dashed w-full'></div> */}
        <div onClick={navigateToFAQs} className='bg-[#9CD4EC1A] hover:bg-[#9cd4ec2c] rounded-md w-full px-4 py-2 flex justify-between items-center h-[44px] cursor-pointer'>
          <div className='font-gridular text-[14px] leading-[16px] text-white'>Read FAQs</div>
          <div className='font-gridular text-white text-[18px]'>?</div>
          {/* <img src={QuestionSVG} alt='question' className='w-[20px] h-[20px] fill-white text-white stroke-white' /> */}
        </div>
      </div>
     
    </div>
  )
}

export default HomePage