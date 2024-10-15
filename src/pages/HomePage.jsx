import BugFixCard from '../components/home/BugFixCard'
import ExploreGigs from '../components/home/ExploreGigs'
import KYC_Card from '../components/home/KYC_Card'
import ProfileDetailsCard from '../components/home/ProfileDetailsCard'
import RecentActivityCard from '../components/home/RecentActivityCard'
import SearchRoles from '../components/home/SearchRoles'
import Statistics from '../components/home/Statistics'

const HomePage = () => {

  return (
    <div className='flex flex-row justify-between mt-4 mx-8'>
      {/* Left side */}
      <div className='flex flex-col px-[46px] mt-4 w-full '>
        <Statistics />
        <SearchRoles />
        <ExploreGigs />
      </div>

      {/* right side */}
      <div className='flex flex-col py-6 px-6 border border-y-0 border-r-0 border-l border-l-primaryYellow/20'>
        <KYC_Card />
        <ProfileDetailsCard />
        <BugFixCard />
        <RecentActivityCard />
      </div>
    </div>
  )
}

export default HomePage