import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import fireWhitePng from '../assets/images/fire-white.png'
import SponsorTrendingBountyCard from '../components/cards/SponsorTrendingBountyCard'
import ExploreGigs from '../components/home/ExploreGigs'
import RecentActivityCard from '../components/home/RecentActivityCard'
import SponsorStatistics from '../components/home/SponsorStatistics'
import { getUserDetails } from '../service/api'

import sponsorCardPng from '../assets/images/loginSponsorCard.png'

const SponsorDashboard = () => {
    const { user_id } = useSelector((state) => state)
    const navigate = useNavigate();

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })
    
    return (
        <div className='flex flex-row justify-between mt-4 mx-8'>
            <div className='flex flex-col px-[46px] mt-4 w-full '>
                <SponsorStatistics userDetails={userDetails} />
                <ExploreGigs />
            </div>

            <div className='flex flex-col py-6 items-center border border-y-0 border-r-0 border-l border-l-primaryYellow/20 min-h-[140vh] min-w-[350px]'>
                <div className='w-[80%] flex flex-col gap-2 h-full'>
                    {/* <SponsorTrendingBountyCard /> */}
                    {/* <div 
                        onClick={() => navigate('/addproject')} 
                        className='min-w-[300px] max-w-[300px] cursor-pointer'
                    >
                        <img src={sponsorCardPng} alt='sponsor login'/>
                    </div> */}

                    <div className='bg-[#9CD4EC1A] rounded-md w-full px-4 py-2 flex items-center gap-3'>
                        <div className='w-[20px] h-[20px]'>
                            <img src={fireWhitePng} alt='fire-white' className='' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='font-gridular text-[14px] leading-4 text-white'>Hey {userDetails?.displayName}!</div>
                            <div className='font-inter text-[12px] leading-[14px] text-white48'>Devs are going crazy for you. Add more bounties <Link to={'/selectprojecttype'} className='underline'>here.</Link></div>
                        </div>
                    </div>

                    <div className='border border-white12 border-dashed w-full my-4'></div>

                    <RecentActivityCard />
                </div>
            </div>
        </div>

          
    )
}

export default SponsorDashboard