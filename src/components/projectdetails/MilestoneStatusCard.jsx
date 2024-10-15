import { ArrowUpRight, Clock, HeartCrack, Hourglass } from 'lucide-react'
import React from 'react'

const MilestoneStatusCard = ({ data }) => {
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
                <p className='text-white88 text-[12px] font-medium font-inter'>DUMMY START IN</p>
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
    </div>
  )
}

export default MilestoneStatusCard