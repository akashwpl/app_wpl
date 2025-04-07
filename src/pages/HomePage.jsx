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
import { getAllProjects, getUserDetails } from '../service/api'
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
import { useEffect, useState } from 'react'
import SignInModal from '../components/SignInModal'
import CustomModal from '../components/ui/CustomModal'

import zapBlueSVG from '../assets/icons/pixel-icons/zap-blue.svg'
import hourglassSVG from '../assets/icons/pixel-icons/hourglass.svg'
import { calculateRemainingDaysAndHours } from '../lib/constants'

import trendingBountyVideo from '../assets/dummy/trending_bounty.mp4'
import sponsorCardVideo from '../assets/dummy/sponsor_wolf_card.mp4'

const HomePage = () => {

  const { user_id, user_role } = useSelector((state) => state)
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [trendingBounty, setTrendingBounty] = useState({})
  const token = localStorage.getItem('token_app_wpl')

  const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  }) 

  const { data: allProjects, isLoading: isLoadingAllProjects} = useQuery({
    queryKey: ["allProjects"],
    queryFn: getAllProjects,
    enabled: !!user_id
  })

  useEffect(() => {
    if(!allProjects?.length) return
    if(!isLoadingAllProjects && token && user_role == 'user') {
      const filterProjects = allProjects?.filter((proj) => {
        return proj?.isOpenBounty && proj?.approvalStatus == 'approved'
      })

      const topProject = filterProjects?.length && filterProjects?.reduce((high, curr) => {
        return curr?.totalPrize > high?.totalPrize ? curr : high
      })

      if(topProject) {
        topProject.remain = calculateRemainingDaysAndHours(new Date(), topProject?.deadline);
      }
      setTrendingBounty(topProject || allProjects[0])
    }
  },[isLoadingAllProjects, allProjects])
  
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
            {!token &&            
              <div>
                <FancyButton 
                  src_img={exploreBtnImg}
                  btn_txt={"JOIN 480+ FOLKS"}
                  hover_src_img={exploreBtnHoverImg}
                  img_size_classes='w-[175px] h-[44px]' 
                  className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                  alt_txt='save project btn'
                  onClick={() => {setShowSignInModal(true)}}
                />
              </div>
            }
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
      <div className='flex flex-col gap-6 py-6 px-6 border border-y-0 border-r-0 border-l border-l-primaryYellow/20 min-h-[140vh] min-w-[350px] max-w-[350px] relative'>

        {!token ?
        <>
          {/* <div onClick={handleNavigateToSponsorSignUp} className='w-full cursor-pointer'>
            <img src={sponsorCardPng} alt='sponsor login'/>
          </div> */}
          <div 
            className='w-[350px] absolute -top-3 left-0 cursor-pointer'
            onClick={() => {setShowSignInModal(true)}}
          >
            <video 
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              className="object-cover [clip-path:inset(33px_23px_round_0px)]"
            >
              <source src={sponsorCardVideo} type="video/mp4"/>
            </video>
          </div>
          <div className='border border-white12 border-dashed w-full my-2 mt-40'></div>
        </>
        :
        trendingBounty?._id &&
          <Link to={`projectdetails/${trendingBounty?._id}`} className='flex flex-col justify-between w-full h-[220px] bg-cardBlueBg hover:bg-cardBlueBg/15 rounded-md cursor-pointer'>
            <div className='flex flex-row justify-between px-4 mt-3 relative'>
                <img width={40} src={trendingBounty?.image} alt="WPL PR details" />
                <div 
                  className='w-[250px] absolute -top-14 left-24'
                >
                  <video 
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    className="object-cover [clip-path:inset(56px_56px_round_6px)]"
                  >
                    <source src={trendingBountyVideo} type="video/mp4"/>
                  </video>
                </div>
                {/* <div className='flex flex-row py-1 gap-1 text-cardBlueText bg-[#233579] w-32 h-[25px] items-center rounded-md'> */}
                    {/* <img src={zapBlueSVG} alt='zap-blue' className='size-[14px] ml-2'/> */}
                    {/* <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Trending Bounty</p> */}
                {/* </div> */}
            </div>
            <p className='text-[16px] text-cardBlueText font-gridular leading-[19.2px] px-4'>{trendingBounty?.title}</p>
            <p className='text-[13px] text-white48 font-inter leading-[15.6px] font-medium px-4 truncate text-ellipsis'>{trendingBounty?.description}</p>
            {/* <div className='border border-white12 border-dashed w-full'></div> */}
            {/* <div className='flex flex-row justify-between text-white32 px-4'>
              <div className='flex flex-row items-center'>
                <img src={clockSVG} alt='clock' className='size-[16px]'/>
                <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Progress</p>
              </div>
              <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>Milestone {milestoneName}</p>
            </div> */}
            <div className=' w-full'></div>
            <div className='flex flex-row justify-between items-center px-4  text-white32 bg-white4 w-full h-[42px] border-t border-white12 border-dashed rounded-b-md'>
              <div className='flex flex-row items-center'>
                <img src={hourglassSVG} alt='hourglass' className='size-[16px]'/>
                <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Deadline</p>
              </div>
              <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>
                {trendingBounty?.remain?.days}D {trendingBounty?.remain?.hours}H
              </p>
            </div>
          </Link>
        }

        {/* <WhyStarkNetCard /> */}
        {/* <KeepMoneyCard /> */}        

        {/* <div onClick={navigateToFAQs} className='bg-[#9CD4EC1A] hover:bg-[#9cd4ec2c] rounded-md w-full px-4 py-2 flex items-center gap-3 cursor-pointer'>
          <div className='w-[20px] h-[20px]'>
              <img src={fireWhitePng} alt='fire-white' className='' />
          </div>
          <div className='flex flex-col gap-2'>
              <div className='font-gridular text-[14px] leading-4 text-white'>Hey {userDetails?.displayName}!</div>
              <div className='font-inter text-[12px] leading-[14px] text-white48'>Click here to view all FAQs</div>
          </div>
        </div> */}

        {/* <div className='border border-white12 border-dashed w-full'></div> */}

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

      <CustomModal isOpen={showSignInModal} closeModal={() => setShowSignInModal(false)}>
        <div onClick={() => setShowSignInModal(false)} className='bg-primaryDarkUI/90 h-screen w-screen overflow-hidden flex justify-center items-center z-50'>
          <SignInModal setShowSignInModal={setShowSignInModal} />
        </div>
      </CustomModal>

    </div>
  )
}

export default HomePage