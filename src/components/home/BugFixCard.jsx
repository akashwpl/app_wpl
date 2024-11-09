import { useQuery } from '@tanstack/react-query'
import { Clock, Hourglass, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { calculateRemainingDaysAndHours, convertTimestampToDate } from '../../../src/lib/constants'
import { getProjectDetails, getUserDetails } from '../../../src/service/api'
import wpl_pr_details from '../../assets/images/wpl_prdetails.png'

const BugFixCard = () => {

  const navigate = useNavigate()

  const { user_id } = useSelector((state) => state)
  const [projectData, setProjectData] = useState(null)
  const [milestoneindex, setMilestoneIndex] = useState(0)
  const [remainingDays, setRemainingDays] = useState(0)

  const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })

  useEffect(() => {
    if(!userProjects) return
    const milestoneToShow = async () => {
      const project = userProjects?.projects?.taken?.filter(project => project?.status === 'ongoing')
      setProjectData(project[0])
      const response = await getProjectDetails(project[0]?._id)
      const lastMilestone = response?.milestones[response?.milestones?.length - 1]
      const milestone = response?.milestones?.filter((milestone, index) => {
        if (milestone.status === 'ongoing') {
          setMilestoneIndex(index + 1)
          return milestone
        }
      })

      const remain = calculateRemainingDaysAndHours(new Date(), convertTimestampToDate(lastMilestone?.deadline))
      setRemainingDays(remain)

    }
    milestoneToShow()
  }, [userProjects])


  const navigateToProjectDetails = () => {
    navigate(`/projectdetails/${projectData?._id}`)
  }

  return (
    <div onClick={navigateToProjectDetails} className='flex flex-col justify-between w-full h-[226px] bg-cardBlueBg hover:bg-cardBlueBg/15 rounded-md mb-6 cursor-pointer'>
      <div className='flex flex-row justify-between px-4 mt-3'>
            <img width={40} src={wpl_pr_details} alt="WPL PR details" />
            <div className='flex flex-row justify-evenly text-cardBlueText bg-[#233579] w-32 h-[20px] items-center rounded-md'>
                <Zap size={12} />
                <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Currently doing</p>
            </div>
        </div>
        <p className='text-[16px] text-cardBlueText font-gridular leading-[19.2px] px-4'>{projectData?.title}</p>
        <p className='text-[13px] text-white48 font-inter leading-[15.6px] font-medium px-4 truncate text-ellipsis'>{projectData?.description}</p>
        <div className='border border-white12 border-dashed w-full'></div>
        <div className='flex flex-row justify-between text-white32 px-4'>
          <div className='flex flex-row'>
            <Clock size={14}/>
            <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Progress</p>
          </div>
          <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>Milestone {milestoneindex} in progress</p>
        </div>
        <div className=' w-full'></div>
        <div className='flex flex-row justify-between items-center px-4  text-white32 bg-white4 w-full h-[42px] border-t border-white12 border-dashed rounded-b-md'>
          <div className='flex flex-row'>
            <Hourglass size={14}/>
            <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Deadline</p>
          </div>
          <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>{remainingDays?.days}d {remainingDays?.hours?.toString()?.replace('-', '')}h</p>
        </div>
    </div>
  )
}

export default BugFixCard