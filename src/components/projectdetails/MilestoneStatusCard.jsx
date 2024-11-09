import { submitMilestone, updateProjectDetails } from '../../service/api';
import { ArrowUpRight, CheckCheck, Clock, HeartCrack, Hourglass, TriangleAlert } from 'lucide-react'
import { calculateRemainingDaysAndHours } from '../../lib/constants';
import React, { useEffect } from 'react'

import FancyButton from '../ui/FancyButton'
import btnImg from '../../assets/svg/btn_subtract_semi.png'
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png'
import { useSelector } from 'react-redux';
import closeProjBtnImg from '../../assets/svg/close_proj_btn_subtract.png'
import closeProjBtnHoverImg from '../../assets/svg/close_proj_btn_hover_subtract.png'


const MilestoneStatusCard = ({ data, projectDetails }) => {

    const {user_id, user_role} = useSelector(state => state)

    const handleSubmitMilestone = async () => {
        const res = await submitMilestone(data?._id);
        if(res?.user_status === 'submitted') {
            alert('Milestone submitted successfully')
        } else {
            alert('Something went wrong. Please try again later!')
        }
    }

    // TODO :: sponsor can accept or reject the milestone
    const handleMileStone = async (type) => {

    }

    console.log('user_role', user_role)

    const time_remain = calculateRemainingDaysAndHours(new Date(), data?.starts_in);

    return (
        <div className='flex flex-col gap-[14px]'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <p className='text-[14px] text-white32 ml-1'>?</p>
                    <p className='text-[12px] text-white32 leading-[16px]'>Milestone Status</p>
                </div>
                <div className='flex items-center gap-1 font-inter'>
                    {data?.status == 'idle' ? 
                        <>
                            <Hourglass size={14} className='text-white32'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>Idle</p>
                        </>
                    : data?.status == 'ongoing' ?
                        <>
                            <Hourglass size={14} className='text-white32'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>In Progress</p>
                        </>
                    :  data?.status == 'under_review' ?
                        <>
                            <TriangleAlert size={14} className='text-cardYellowText'/>
                            <p className='text-cardYellowText text-[12px] leading-[14px]'>Under Review</p>
                        </>
                    :
                        <>
                            <CheckCheck size={14} className='text-white32'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>Completed</p>
                        </>
                    }
                </div>
            </div>
            
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Clock size={14} className='text-white32'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>Starts in</p>
                </div>
                <div className='flex items-center gap-1'>
                    <p className='text-white88 text-[12px] font-medium font-inter'>{time_remain.days < 0 ? <span className='text-white48'>Project Started</span> : `${time_remain.days} D ${time_remain.hours} H`}</p>
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
                {user_id != projectDetails?.user_id && user_role == 'sponsor' ?
                    <div>
                        {data?.status == 'under_review' 
                        ? <div className='flex items-center gap-2'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[190px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                                btn_txt='accept'
                                alt_txt='project apply btn' 
                                onClick={handleSubmitMilestone}
                            />
                            <FancyButton 
                                src_img={closeProjBtnImg} 
                                hover_src_img={closeProjBtnHoverImg} 
                                img_size_classes='w-full h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryRed mt-1.5'
                                btn_txt='reject'  
                                alt_txt='project apply btn' 
                                onClick={handleSubmitMilestone}
                            />
                        </div>
                        : ""
                        }
                    </div>
                : 
                    projectDetails?.status == 'closed' ? "" : 
                    <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={btnHoverImg} 
                        img_size_classes='w-[342px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt={data?.status == 'under_review' || data?.status == 'closed' ? 're-submit milestone' : 'submit milestone'}  
                        alt_txt='project apply btn' 
                        onClick={handleSubmitMilestone}
                    />
                
                }
            </div>
        </div>
    )
}

export default MilestoneStatusCard