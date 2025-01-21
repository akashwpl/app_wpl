import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import hourglassSVG from '../../assets/icons/pixel-icons/hourglass.svg'
import zapBlueSVG from '../../assets/icons/pixel-icons/zap-blue.svg'
import wpl_pr_details from '../../assets/images/wpl_prdetails.png'
import { calculateRemainingDaysAndHours } from '../../lib/constants'
import { getProjectDetails, getUserProjects } from '../../service/api'



const SponsorTrendingBountyCard = () => {

  const { user_id, user_role } = useSelector((state) => state)


  const [projectData, setProjectData] = useState(null)
  const [milestoneName, setMilestoneName] = useState('')
  const [remainingDays, setRemainingDays] = useState({days: '0', hours: '0'})

  const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
    queryKey: ["userProjects", user_id],
    queryFn: () => getUserProjects(),
    enabled: !!user_id,
  })

  useEffect(() => {
    if(!isLoadingUserProjects) {
      if(!userProjects) return
      const milestoneToShow = async () => {
        const project = userProjects?.filter(project => project?.status === 'idle')
        setProjectData(project[0])
        const response = await getProjectDetails(project[0]?._id)
        const lastMilestone = response?.milestones[response?.milestones?.length - 1]
        const milestone = response?.milestones?.filter((milestone, index) => {
          if (milestone.status === 'ongoing' || milestone.status === 'idle') {
            setMilestoneName(milestone?.title)
            return milestone
          }
        })
  
        const remain = calculateRemainingDaysAndHours(new Date(), lastMilestone?.deadline)
        setRemainingDays(remain)
      }
      milestoneToShow()
    }
  }, [isLoadingUserProjects, userProjects])

  if(userProjects?.filter(project => project?.status === 'idle')?.length === 0) return null

  return (
    <>
      <Link to={`projectdetails/${projectData?._id}`} className='flex flex-col justify-between w-full h-[220px] bg-cardBlueBg hover:bg-cardBlueBg/15 rounded-md cursor-pointer'>
        <div className='flex flex-row justify-between px-4 mt-3'>
            <img width={40} src={wpl_pr_details} alt="WPL PR details" />
            <div className='flex flex-row py-1 gap-1 text-cardBlueText bg-[#233579] w-32 h-[25px] items-center rounded-md'>
                <img src={zapBlueSVG} alt='zap-blue' className='size-[14px] ml-2'/>
                <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Trending Bounty</p>
            </div>
        </div>
        <p className='text-[16px] text-cardBlueText font-gridular leading-[19.2px] px-4'>{projectData?.title}</p>
        <p className='text-[13px] text-white48 font-inter leading-[15.6px] font-medium px-4 truncate text-ellipsis'>{projectData?.description}</p>
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
          <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>{remainingDays?.days}d {remainingDays?.hours?.toString()?.replace('-', '')}h</p>
        </div>
      </Link>

      <div className='border border-white12 border-dashed w-full my-4'></div>

    </>
  )
}

export default SponsorTrendingBountyCard