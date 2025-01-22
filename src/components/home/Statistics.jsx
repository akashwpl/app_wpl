import { getAllProjects } from "../../service/api"
import { useQuery } from "@tanstack/react-query"

const Statistics = ({ userDetails }) => {

  const token = localStorage.getItem('token_app_wpl')

  const { data: allProjects, isLoading: isLoadingAllProjects } = useQuery({
    queryKey: ["allProjects"],
    queryFn: getAllProjects
  })

  // console.log('allProjects statis', allProjects)
  

  return (
    <div className="mb-8">
        {token && <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey {userDetails ? userDetails?.displayName : "User"}, keep up the participation rate!</p>}
        <div className="flex flex-row text-primaryBlue">
            <div className={`mr-3 ${token ? "w-2/4" : "w-full"} h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md`}>
							{token ?
							<>
								<p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Gigs</p>
								<p className='font-gridular text-[42px] leading-[50.4px]'>{allProjects ? allProjects?.length : '0'}</p>
							</>	
							:
							<>
								<p className="font-gridular text-[23px] leading-[28px]">Start contributing Onchain</p>
								<p className="font-inter font-medium text-[13px] leading-[15.6px]">Earn in crypto by contributing to your fav projects</p>
							</>
						}
            </div>
            {/* <div className={`mr-3 ${token ? "w-2/4" : "w-full"} h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md`}>
							{token ?
							<>
								<p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Listings</p>
								<p className='font-gridular text-[42px] leading-[50.4px]'>$ {userDetails ? userDetails?.totalEarned : '0'}</p>
							</>	
							:
							<>
								<p className="font-gridular text-[23px] leading-[28px]">Start contributing Onchain</p>
								<p className="font-inter font-medium text-[13px] leading-[15.6px]">Earn in crypto by contributing to your fav projects</p>
							</>
						}
            </div> */}
						{token &&
						<>
            <div className='w-1/6 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg mr-3'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Participated</p>
                <p className='font-gridular text-[42px] leading-[42px]'>
                    {userDetails ? (userDetails?.projects?.taken.length == 0 || userDetails?.projects?.taken.length > 9 ? userDetails?.projects?.taken.length : '0' + userDetails?.projects?.taken.length) : '0'}
                </p>
            </div>
            <div className='w-1/6 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg mr-3'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Completed</p>
                <p className='font-gridular text-[42px] leading-[42px]'>
                    {userDetails ? (userDetails?.projectsCompleted == 0 || userDetails?.projectsCompleted > 9 ? userDetails?.projectsCompleted : '0' + userDetails?.projectsCompleted) : '0'}
                </p>
            </div>
            <div className='w-1/6 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Ongoing</p>
                <p className='font-gridular text-[42px] leading-[42px]'>
                    {userDetails ? (userDetails?.projectsOngoing == 0 || userDetails?.projectsOngoing > 9 ? userDetails?.projectsOngoing : '0' + userDetails?.projectsOngoing) : 0}
                </p>
            </div>
						</>
						}
        </div>
    </div>
  )
}

export default Statistics