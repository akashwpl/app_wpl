import { useNavigate } from 'react-router-dom';
import USDCimg from '../../assets/images/usdc.png'
import STRKimg from '../../assets/images/strk.png'
import { Dot } from 'lucide-react';
import { useState } from 'react';

import clockSVG from '../../assets/icons/pixel-icons/watch.svg'
import profileSVG from '../../assets/icons/pixel-icons/profile.svg'
import zapSVG from '../../assets/icons/pixel-icons/zap-yellow.svg'
import { calculateRemainingDaysAndHours, convertTimestampToDate } from '../../../src/lib/constants';

const ExploreGigsListViewCard = ({data}) => {
    const navigate = useNavigate()

    const navigateToProjectDetails = () => {
      navigate(`/projectdetails/${data?._id}`)
    }
    
    const remain = calculateRemainingDaysAndHours(new Date(), convertTimestampToDate(data?.deadline))
    
    const [hovered, setHovered] = useState(false);

    const renderRoles = () => {
        const limit = 5;
        // const limit = projectsGridView ? data?.roles?.length : 4; 
        return data?.roles?.slice(0, limit)?.map((role, idx) => (
            <span 
                key={idx} 
                className="capitalize font-inter font-medium text-[12px] leading-[14.4px] text-white64 bg-[#091044] px-2 rounded-md"
            >
                {role}
            </span>
        )); 
    };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={navigateToProjectDetails} className={`cursor-pointer py-6 flex items-center w-full h-full border-b border-white4 rounded-sm relative`}>
        <div className={`flex flex-row justify-between transition-all duration-500 ${hovered ? "px-3" : "px-5"} "items-center" w-full`}>
            <div className="flex flex-col">
              <div className='flex flex-row items-center gap-3 w-full mb-4'>
                <img className='size-14 rounded-2xl' src={data?.image} alt="Gig Profile Picture"/>
                <div className='flex flex-col gap-0.5'>
                    <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48'>{data?.organisation?.organisationHandle || ""}</p>
                    <p className='font-gridular text-[16px] leading-[19.2px] text-white88'>{data?.title}</p>     
                </div>
              </div>
              <div className='flex flex-col'>
                <div className={`flex flex-row justify-center items-start text-white32 w-[900px]`}>
                  <div className={`flex items-center gap-1 w-full py-0.5`}>
                    <img src={clockSVG} alt='clock' className='size-[16px]'/>
                    <div className='font-inter font-medium text-[12px] leading-[14.4px]'>
                      {
                        remain.days > 0 ?
                        `Due: ${remain.days} D ${remain.hours} H`
                        :
                        <span>--</span>
                      }
                    </div>
                    <Dot size={16} className='mx-1' />
                    <img src={zapSVG} alt='zap' className='size-[16px]'/>
                    <p className='font-inter font-medium text-cardYellowText text-[12px] leading-[14.4px] capitalize'>{data?.isOpenBounty ? 'Bounty' : 'Project'}</p>
                    <Dot size={16} className='mx-1' />
                    <img src={profileSVG} alt='profile' className='size-[16px]'/>
                    <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Role: </p>
                    {renderRoles()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`absolute transition-all duration-500 ${hovered ? "right-3" : "right-5"} flex flex-row justify-evenly items-center font-gridular leading-[19.2px] bg-[#091044] p-2 gap-[6px] rounded-md`}>
                <img className='h-[15px]' src={data?.currency == 'STRK' ? STRKimg : USDCimg} alt="currency" />
                <p className='text-[14px] font-inter text-white88'>{data?.totalPrize}</p>
                <p className='text-[14px] font-semibold text-white48'>{data?.currency || 'USDC'}</p>
            </div>
        </div>
    </div>
  )
}

export default ExploreGigsListViewCard