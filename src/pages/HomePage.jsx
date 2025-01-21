import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import BugFixCard from '../components/home/BugFixCard'
import ExploreGigs from '../components/home/ExploreGigs'
import KYC_Card from '../components/home/KYC_Card'
import ProfileDetailsCard from '../components/home/ProfileDetailsCard'
// import RecentActivityCard from '../components/home/RecentActivityCard'
import Statistics from '../components/home/Statistics'
import { getUserDetails } from '../service/api'
import AdminDashboard from './AdminDashboard'
import SponsorDashboard from './SponsorDashboard'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WhyStarkNetCard from '../components/cards/WhyStarkNetCard'
import fireWhitePng from '../assets/images/fire-white.png'
import KeepMoneyCard from '../components/cards/KeepMoneyCard'
import RecentActivityCard from '../components/home/RecentActivityCard'


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

  useEffect(() => {
    if(!token) navigate('/allprojects')
  },[])

  return (
    <div className='flex flex-row justify-between mt-4 mx-8'>
      {/* Left side */}
      <div className='flex flex-col px-[46px] mt-4 w-full '>
        <Statistics userDetails={userDetails}/>
        {/* <SearchRoles /> */}
        <ExploreGigs userId={user_id}/>
      </div>

      {/* right side */}
      {user_role == 'user' && 
        <div className='flex flex-col py-6 px-6 border border-y-0 border-r-0 border-l border-l-primaryYellow/20 min-h-[140vh] min-w-[350px]'>
          <WhyStarkNetCard />
          <KeepMoneyCard />

          <div className='border border-white12 border-dashed w-full my-4'></div>

          {/* <div className='bg-[#9CD4EC1A] rounded-md w-full px-4 py-2 flex items-center gap-3'>
            <div className='w-[20px] h-[20px]'>
                <img src={fireWhitePng} alt='fire-white' className='' />
            </div>
            <div className='flex flex-col gap-2'>
                <div className='font-gridular text-[14px] leading-4 text-white'>Hey {userDetails?.displayName}!</div>
                <div className='font-inter text-[12px] leading-[14px] text-white48'>Your skills match listings live right now! <Link to={'/allprojects'} className='underline'>Apply now!</Link></div>
            </div>
          </div> */}

          {/* <div className='border border-white12 border-dashed w-full my-4'></div> */}

          {!token ? null : !userDetails?.isKYCVerified ? <KYC_Card userDetails={userDetails}/> : null}
          {!token ? null : <ProfileDetailsCard userDetails={userDetails} />}
          {!token || userDetails?.projectsOngoing == 0 ? null :
            <BugFixCard />
          }
          <RecentActivityCard />
        </div>
      }
    </div>
  )
}

export default HomePage