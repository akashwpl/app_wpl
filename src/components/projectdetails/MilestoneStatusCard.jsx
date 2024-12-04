import { ArrowUpRight, CheckCheck, Clock, HeartCrack, Hourglass, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { calculateRemainingDaysAndHours } from '../../lib/constants';
import { submitMilestone, updateMilestone } from '../../service/api';

import { useSelector } from 'react-redux';
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png';
import btnImg from '../../assets/svg/btn_subtract_semi.png';
import closeProjBtnHoverImg from '../../assets/svg/close_proj_btn_hover_subtract.png';
import closeProjBtnImg from '../../assets/svg/close_proj_btn_subtract.png';
import CustomModal from '../ui/CustomModal';
import FancyButton from '../ui/FancyButton';

import hourglassSVG from '../../assets/icons/pixel-icons/hourglass2.svg'
import warningSVG from '../../assets/icons/pixel-icons/warning.svg'
import clockSVG from '../../assets/icons/pixel-icons/watch.svg'
import questionSVG from '../../assets/icons/pixel-icons/question-mark.svg'
import heartSVG from '../../assets/icons/pixel-icons/heart-handshake.svg'

const MilestoneStatusCard = ({ data: milestoneData, projectDetails, refetchProjectDetails }) => {

    const {user_id, user_role} = useSelector(state => state)
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const [linkError, setLinkError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);

    const [showMilestoneSubmissionModal, setShowMilestoneSubmissionModal] = useState(false);


    const handleSubmitMilestone = async () => {

        const linkInput = document.querySelector('input').value;
        const descriptionTextarea = document.querySelector('textarea').value;
    
        let hasError = false;
    
        if (!linkInput) {
            setLinkError('Link is required');
            hasError = true;
            return
        } else {
            setLinkError(null);
        }
    
        if (!descriptionTextarea) {
            setDescriptionError('Description is required');
            hasError = true;
            return
        } else {
            setDescriptionError(null);
        }

        const body = {
            "submissionLink": linkInput,
            "submissionDescription": descriptionTextarea
        }

        const res = await submitMilestone(milestoneData?._id, body);
        setShowSubmitModal(false);
        
        if(res?.user_status === 'submitted') {
            alert('Milestone submitted successfully')
        } else {
            alert('Something went wrong. Please try again later!')
        }
    }

    // TODO :: sponsor can accept or reject the milestone
    const handleMileStoneSponsorAction = async (type) => {

        const { _id, __v, comments, milestones, totalPrize, created_at, updated_at, ...data } = milestoneData;
        data.status = type == 'accept' ? "completed" : "rejected";
        data.deadline = new Date(data.deadline).getTime();
        data.starts_in = new Date(data.starts_in).getTime();

        const res = await updateMilestone(milestoneData?._id, data);
        setShowMilestoneSubmissionModal(false);

        console.log('res', res)

        // if(type == 'accept') {
        //     const res = await updateMilestone(data?._id, data);
        //     setShowMilestoneSubmissionModal(false);

        // } else {
        //     const res = await updateMilestone(data?._id, data);
        //     setShowMilestoneSubmissionModal(false);
        // }

    }

    console.log('user_role', user_role)
    console.log('data', milestoneData)

    const time_remain = calculateRemainingDaysAndHours(new Date(), milestoneData?.starts_in);

    return (
        <div className='flex flex-col gap-[14px]'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <img src={questionSVG} alt='question-mark' className='size-[16px]'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>Milestone Status</p>
                </div>
                <div className='flex items-center gap-1 font-inter'>
                    {milestoneData?.status == 'idle' ? 
                        <>
                            <img src={hourglassSVG} alt='hourglass' className='size-[14px]'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>Idle</p>
                        </>
                    : milestoneData?.status == 'ongoing' ?
                        <>
                            <img src={hourglassSVG} alt='hourglass' className='size-[14px]'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>In Progress</p>
                        </>
                    :  milestoneData?.status == 'under_review' ?
                        <>
                            <img src={warningSVG} alt='warning' className='size-[14px]'/>
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
                    <img src={clockSVG} alt='clock' className='size-[16px]'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>Starts in</p>
                </div>
                <div className='flex items-center gap-1'>
                    <p className='text-white88 text-[12px] font-medium font-inter'>{time_remain.days < 0 ? <span className='text-white48'>Project Started</span> : `${time_remain.days} D ${time_remain.hours} H`}</p>
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <img src={heartSVG} alt='heart' className='size-[16px]'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>Need Help?</p>
                </div>
                <div className='flex items-center gap-1'>
                    <a href={milestoneData?.help_link[0]} target='_blank' className='cursor-pointer'>
                        <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter flex items-center gap-1'>Join discord <ArrowUpRight size={14} className='text-white32'/></p>
                    </a>
                </div>
            </div>

            <div className="my-1">
                    {milestoneData?.status == 'under_review' ? 
                        <div>
                            <p className='text-white64'>User has submitted the milestone: <span onClick={() => setShowMilestoneSubmissionModal(true)} className='text-primaryYellow underline cursor-pointer hover:text-primaryYellow/90'>view</span></p>
                        </div> : null
}
                {user_id != projectDetails?.user_id && user_role == 'sponsor' ?
                    <div>
                    </div>
                : 
                    projectDetails?.status == 'closed' ? "" : user_id == projectDetails?.user_id &&
                    <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={btnHoverImg}
                        img_size_classes='w-[342px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt={milestoneData?.status == 'under_review' || milestoneData?.status == 'closed' ? 're-submit milestone' : 'submit milestone'}  
                        alt_txt='project apply btn' 
                        onClick={() => setShowSubmitModal(true)}
                    />
                
                }
            </div>

            <CustomModal isOpen={showSubmitModal} closeModal={() => setShowSubmitModal(false)}>
                <div className='bg-primaryDarkUI border border-white4 rounded-md w-[500px] p-3'>
                    <div className='flex justify-end'><X size={20} onClick={() => setShowSubmitModal(false)}  className='text-white88 hover:text-white64 cursor-pointer'/></div>
                    <div>
                        <p className='text-primaryYellow font-semibold font-gridular'>Add details</p>
                        <div className='h-[1px] bg-primaryYellow w-full mt-2 mb-5'/>
                        <div className='flex flex-col'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Link <span className='text-primaryRed'>*</span></label>
                            <input className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' placeholder='project link..'/>
                            {linkError && <p className='text-primaryRed text-[12px] mt-1'>{linkError}</p>}
                        </div>
                        <div className='flex flex-col mt-4'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Description <span className='text-primaryRed'>*</span></label>
                            <textarea rows={4} className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' placeholder='Fixed UI Bug'/>
                            {descriptionError && <p className='text-primaryRed text-[12px] mt-1'>{descriptionError}</p>}
                        </div>
                    </div>

                    <div className='mt-6'>
                        <FancyButton 
                            src_img={btnImg} 
                            hover_src_img={btnHoverImg} 
                            img_size_classes='w-[500px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                            btn_txt='submit'  
                            alt_txt='project apply btn' 
                            onClick={handleSubmitMilestone}
                        />
                    </div>
                </div>
            </CustomModal>

            <CustomModal isOpen={showMilestoneSubmissionModal} closeModal={() => setShowMilestoneSubmissionModal(false)}>
                <div className='bg-primaryDarkUI border border-white4 rounded-md w-[500px] p-3'>
                    <div className='flex justify-end'><X size={20} onClick={() => setShowMilestoneSubmissionModal(false)}  className='text-white88 hover:text-white64 cursor-pointer'/></div>
                    <div>
                        <p className='text-primaryYellow font-semibold font-gridular'>Add details</p>
                        <div className='h-[1px] bg-primaryYellow w-full mt-2 mb-5'/>
                        <div className='flex flex-col'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Link</label>
                            <a href={milestoneData?.submissionLink} target='_blank' className='bg-white12 text-white88 py-1 px-2 rounded-md w-ful'>{milestoneData?.submissionLink}</a>
                        </div>
                        <div className='flex flex-col mt-4'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Description</label>
                            <textarea rows={4} value={milestoneData?.submissionDescription} className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' placeholder='Fixed UI Bug'/>
                        </div>
                    </div>

                    <div>
                        {milestoneData?.status == 'under_review' && projectDetails?.status != 'closed'
                        ? <div className='flex justify-center mt-6 items-center gap-2'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[190px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                                btn_txt='accept'
                                alt_txt='project apply btn' 
                                onClick={() => handleMileStoneSponsorAction('accept')}
                            />
                            <FancyButton 
                                src_img={closeProjBtnImg} 
                                hover_src_img={closeProjBtnHoverImg} 
                                img_size_classes='w-full h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryRed mt-1.5'
                                btn_txt='reject'  
                                alt_txt='project apply btn' 
                                onClick={() => handleMileStoneSponsorAction('reject')}
                            />
                        </div>
                        : ""
                        }
                    </div>
                </div>
            </CustomModal>
        </div>
    )
}

export default MilestoneStatusCard