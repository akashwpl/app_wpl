import { ArrowUpRight, CheckCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateRemainingDaysAndHours } from '../../lib/constants';
import { createNotification, getOpenMilestoneSubmissions, getOpenProjectSubmissions, submitMilestone, submitOpenMilestone, updateMilestone } from '../../service/api';

import { useDispatch, useSelector } from 'react-redux';
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png';
import btnImg from '../../assets/svg/btn_subtract_semi.png';
import closeProjBtnHoverImg from '../../assets/svg/close_proj_btn_hover_subtract.png';
import closeProjBtnImg from '../../assets/svg/close_proj_btn_subtract.png';
import CustomModal from '../ui/CustomModal';
import FancyButton from '../ui/FancyButton';

import { displaySnackbar } from '../../store/thunkMiddleware';
import heartSVG from '../../assets/icons/pixel-icons/heart-handshake.svg';
import hourglassSVG from '../../assets/icons/pixel-icons/hourglass2.svg';
import questionSVG from '../../assets/icons/pixel-icons/question-mark.svg';
import warningSVG from '../../assets/icons/pixel-icons/warning.svg';
import clockSVG from '../../assets/icons/pixel-icons/watch.svg';
import { useQuery } from '@tanstack/react-query';

const MilestoneStatusCard = ({ data: milestoneData, projectDetails, refetchProjectDetails, username }) => {

    const {user_id, user_role} = useSelector(state => state)
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const dispatch = useDispatch();

    const [linkError, setLinkError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);

    const [showMilestoneSubmissionModal, setShowMilestoneSubmissionModal] = useState(false);
    const [isUserSubmittedOpenMS, setIsUserSubmittedOpenMS] = useState(false);

    const {data: openMilestoneSubmissions, isLoading: isLoadingOpenMilestoneSubmissions, refetch: refetchOpenMS} = useQuery({
        queryKey: ["openMilestoneSubmissions", milestoneData?._id],
        queryFn: () => getOpenMilestoneSubmissions(milestoneData?._id),
        enabled: !!projectDetails?.isOpenBounty,
    })

    useEffect(() => {
        if(!isLoadingOpenMilestoneSubmissions && projectDetails?.isOpenBounty) {
            setIsUserSubmittedOpenMS(openMilestoneSubmissions?.some(ms => ms.user_id == user_id));
        }
    },[isLoadingOpenMilestoneSubmissions])

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

        let response = {};
        if(projectDetails?.isOpenBounty) {
            const body = {
                milestone_id: milestoneData?._id,
                project_id: projectDetails?._id,
                user_id: user_id,
                submissionLink: linkInput,
                submissionDescription: descriptionTextarea,
                status: 'submitted'
            }
            response = await submitOpenMilestone(milestoneData?._id,body)
            setIsUserSubmittedOpenMS(true)
            refetchOpenMS();
        } else {
            const body = {
                submissionLink: linkInput,
                submissionDescription: descriptionTextarea,
            }
            response = await submitMilestone(milestoneData?._id, body);
        }

        if(response?._id) {
            const notiObj = {
              msg: `${username} has submitted a milestone for..`,
              type: 'project_req',
              fromId: user_id,
              user_id: projectDetails.owner_id,
              project_id: projectDetails._id
            }
            const notiRes = await createNotification(notiObj);
            setShowSubmitModal(false);
        }
        
        if(response?.user_status === 'submitted' || response?.status === 'submitted') {
            dispatch(displaySnackbar('Milestone submitted successfully'))
        } else {
            dispatch(displaySnackbar('Something went wrong. Please try again later!'))
        }
        refetchProjectDetails()
    }

    // TODO :: sponsor can accept or reject the milestone
    const handleMileStoneSponsorAction = async (type) => {

        const { _id, __v, comments, milestones, totalPrize, created_at, updated_at, ...data } = milestoneData;
        data.status = type == 'accept' ? "completed" : "rejected";
        data.deadline = new Date(data.deadline).getTime();
        data.starts_in = new Date(data.starts_in).getTime();

        const res = await updateMilestone(milestoneData?._id, data);
       

        if(res?._id) {
            const notiObj = {
                msg: `${username} has ${type}ed your milestone submission...`,
                type: 'project_req',
                fromId: user_id,
                user_id: projectDetails.user_id,
                project_id: projectDetails._id
            }
            const notiRes = await createNotification(notiObj)
            setShowMilestoneSubmissionModal(false);
        }
        refetchProjectDetails()
    }

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
                    :   milestoneData?.status == 'rejected' ?
                        <>
                            <TriangleAlert className='size-[14px] text-errorMsgRedText'/>
                            <p className='text-errorMsgRedText text-[12px] leading-[14px]'>Rejected</p>
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
                    <a href={projectDetails?.project?.discordLink} target='_blank' className='cursor-pointer'>
                        <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter flex items-center gap-1'>Join discord <ArrowUpRight size={14} className='text-white32'/></p>
                    </a>
                </div>
            </div>

            <div className="my-1">
                    {milestoneData?.status == 'under_review' 
                        ?
                            <div className='mb-1'>
                                <p className='text-white64 text-[12px]'>User has submitted the milestone: <span onClick={() => setShowMilestoneSubmissionModal(true)} className='text-primaryYellow underline cursor-pointer hover:text-primaryYellow/90'>view</span></p>
                            </div>
                        : milestoneData?.status == 'completed' ? <div className='text-primaryGreen bg-primaryDarkUI px-3 py-1 rounded-md flex items-center gap-1 font-gridular w-fit'><Info size={16}/> Milestone is completed</div> : ""
                        }
                {user_id != projectDetails?.user_id && user_role == 'sponsor' ?
                    <div>
                    </div>
                : 
                    projectDetails?.status == 'closed' ? "" :
                    milestoneData?.status == "completed" ? <div></div> 
                    : ((projectDetails?.isOpenBounty && !isUserSubmittedOpenMS) || user_id == projectDetails?.user_id) ? 
                    <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={btnHoverImg}
                        img_size_classes='w-[342px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt={milestoneData?.status == 'under_review' || milestoneData?.status == 'rejected' ? 're-submit milestone' : 'submit milestone'}  
                        alt_txt='milestone submit btn' 
                        onClick={() => setShowSubmitModal(true)}
                    />
                    :
                    isUserSubmittedOpenMS && <p className='text-white88 bg-primaryDarkUI px-3 py-1 rounded-md flex items-center gap-1 font-gridular w-fit'><Info size={16}/> Milestone Already Submitted</p>
                
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
                        {milestoneData?.status == 'under_review' && projectDetails?.status != 'closed' && user_role == 'sponsor'
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