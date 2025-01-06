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
import { useNavigate } from 'react-router-dom'

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
        <div className='flex flex-col py-6 px-6 border border-y-0 border-r-0 border-l border-l-primaryYellow/20 min-h-[140vh] min-w-[280px]'>
          {!token ? null :  <KYC_Card userDetails={userDetails}/> }
          {!token ? null : <ProfileDetailsCard userDetails={userDetails} />}
          {!token || userDetails?.projectsOngoing == 0 ? null :
            <BugFixCard />
          }
          {/* <RecentActivityCard /> */}
        </div>
      }
    </div>
  )
}

export default HomePage