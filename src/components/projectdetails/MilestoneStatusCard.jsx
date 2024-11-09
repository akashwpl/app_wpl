import { submitMilestone, updateProjectDetails } from '../../service/api';
import { ArrowUpRight, Clock, HeartCrack, Hourglass } from 'lucide-react'
import { calculateRemainingDaysAndHours } from '../../lib/constants';
import React, { useEffect } from 'react'

import FancyButton from '../ui/FancyButton'
import btnImg from '../../assets/svg/btn_subtract_semi.png'
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png'

const MilestoneStatusCard = ({ data }) => {

    const handleSubmitMilestone = async () => {
        const res = await submitMilestone(data?._id);
    }

    const time_remain = calculateRemainingDaysAndHours(new Date(), data?.starts_in);

    return (
        <div className='flex flex-col gap-[14px]'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <p className='text-[14px] text-white32 ml-1'>?</p>
                    <p className='text-[12px] text-white32 leading-[16px]'>Milestone Status</p>
                </div>
                <div className='flex items-center gap-1 font-inter'>
                    <Hourglass size={14} className='text-white32'/>
                    <p className='text-white48 text-[12px] leading-[14px]'>{data?.status}</p>
                </div>
            </div>
            
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Clock size={14} className='text-white32'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>Starts in</p>
                </div>
                <div className='flex items-center gap-1'>
                    <p className='text-white88 text-[12px] font-medium font-inter'>{time_remain.days} D {time_remain.hours} H</p>
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <HeartCrack size={14} className='text-white32'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>Need Help?</p>
                </div>
                <div className='flex items-center gap-1'>
                    <a href={data?.help_link[0]} target='_blank' className='cursor-pointer'>
                        <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter flex items-center gap-1'>Join discord <ArrowUpRight size={14} className='text-white32'/></p>
                    </a>
                </div>
            </div>

            <div className="my-1">
                <FancyButton 
                    src_img={btnImg} 
                    hover_src_img={btnHoverImg} 
                    img_size_classes='w-[342px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                    btn_txt='submit milestone' 
                    alt_txt='project apply btn' 
                    onClick={handleSubmitMilestone}
                />
            </div>
            {/* <button onClick={handleSubmitMilestone} className='border border-primaryYellow w-full text-primaryYellow py-2 rounded-md font-gridular hover:bg-primaryYellow/10'>Submit Milestone</button> */}
        </div>
    )
}

export default MilestoneStatusCard