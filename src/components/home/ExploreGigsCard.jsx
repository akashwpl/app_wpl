import { useNavigate } from 'react-router-dom';
import usdc from '../../assets/images/usdc.png'
import { Dot } from 'lucide-react';
import { useState } from 'react';

import clockSVG from '../../assets/icons/pixel-icons/watch.svg'
import calenderSVG from '../../assets/icons/pixel-icons/calender.svg'
import profileSVG from '../../assets/icons/pixel-icons/profile.svg'
import zapSVG from '../../assets/icons/pixel-icons/zap-yellow.svg'

const ExploreGigsCard = ({data, type, projectsGridView}) => {
    const navigate = useNavigate()

    const navigateToProjectDetails = () => {
        navigate(`/projectdetails/${data?._id}`)
    }

    const [hovered, setHovered] = useState(false);
    console.log('clock',data);
    

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={navigateToProjectDetails} className={`cursor-pointer py-2 mt-2 flex items-center w-full border-b border-white4 ${projectsGridView ? "hover:bg-white4 bg-[#050E52] rounded-md p-2" : ""} relative`}>
        <div className={`flex flex-row justify-between transition-all duration-500 ${hovered ? "px-1" : "px-4"} ${projectsGridView ? "items-start" : "items-center"} w-full`}>
            <div className={`${projectsGridView ? "flex-col pl-4 py-4" : "flex-row"} flex `}>
                <img className='size-16 mr-2 rounded-2xl mb-2' src={data?.image} alt="Gig Profile Picture"/>
                <div className='flex flex-col w-full'>
                    <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48 mb-1'>{data?.organisationHandle}</p>
                    <p className='font-gridular text-[16px] leading-[19.2px] text-white88 mb-3'>{data?.title}</p>     
                    <div className={`flex flex-row ${projectsGridView ? 'flex-col' : "flex-row"} gap-2 text-white32 w-full mt-1`}>
                        <div className={`flex items-center gap-1 ${projectsGridView ? "mt-2" : ""}`}>
                            <img src={clockSVG} alt='clock' className='w-[16px] h-[16px]'/>
                            <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Due in <span className='text-white64'>{data?.deadline}</span></p>
                            <Dot size={16} />
                            <img src={calenderSVG} alt='calender' className='w-[16px] h-[16px]'/>
                            <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Delivery time: <span className='text-white64'>2 weeks</span></p>
                            {!projectsGridView && <Dot size={16} />}
                        </div>
                        <div className={`flex items-center gap-1 ${projectsGridView ? "mt-2" : ""}`}>
                            <img src={profileSVG} alt='profile' className='w-[16px] h-[16px]'/>
                            <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Role: <span className='text-white64'>Frontend</span></p>
                            <Dot size={16} />
                            <img src={zapSVG} alt='zap' className='w-[16px] h-[16px]'/>
                            <p className='font-inter font-medium text-cardYellowText text-[12px] leading-[14.4px] capitalize'>{data?.type}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`absolute transition-all duration-500 ${projectsGridView ? (hovered ? "right-3 top-4" : "right-5 top-4") : hovered ? "right-1" : "right-4"} flex flex-row justify-evenly items-center font-gridular leading-[19.2px] bg-[#091044] py-2 px-3 gap-[6px] rounded-md`}>
                <img className='h-[15px]' src={usdc} alt="currency" />
                <p className='text-[14px] font-inter text-white88'>{data?.totalPrize}</p>
                <p className='text-[14px] font-semibold text-white48'>USDC</p>
            </div>
        </div>
    </div>
  )
}

export default ExploreGigsCard