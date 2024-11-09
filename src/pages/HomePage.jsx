import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import BugFixCard from '../components/home/BugFixCard'
import ExploreGigs from '../components/home/ExploreGigs'
import KYC_Card from '../components/home/KYC_Card'
import ProfileDetailsCard from '../components/home/ProfileDetailsCard'
import RecentActivityCard from '../components/home/RecentActivityCard'
import Statistics from '../components/home/Statistics'
import { getUserDetails } from '../service/api'

const HomePage = () => {

  const { user_id, user_role } = useSelector((state) => state)

  const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  }) 

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
        <div className='flex flex-col py-6 px-6 border border-y-0 border-r-0 border-l border-l-primaryYellow/20 min-h-[140vh]'>
          <KYC_Card />
          <ProfileDetailsCard />
          {userDetails?.projectsInProgress == 0 && userDetails?.projectsOngoing == 0 && userDetails?.projectsParticipated == 0 ? null :     
            <BugFixCard />
          }
          <RecentActivityCard />
        </div>
      }
    </div>
  )
}

export default HomePage