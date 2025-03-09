import { ArrowUpRight, CheckCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateRemainingDaysAndHours, isValidLink } from '../../lib/constants';
import { createNotification, getOpenMilestoneSubmissions, getOpenProjectSubmissions, submitMilestone, submitOpenMilestone, submitOpenProject, updateMilestone, updateProjectDetails } from '../../service/api';

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
import warningRedSVG from '../../assets/icons/pixel-icons/warning-red.svg';
import warningSVG from '../../assets/icons/pixel-icons/warning.svg';
import clockSVG from '../../assets/icons/pixel-icons/watch.svg';
import { useQuery } from '@tanstack/react-query';

const OpenMilestoneStatusCard = ({ projectDetails, refetchProjectDetails, username }) => {
    const {user_id, user_role} = useSelector(state => state)
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const dispatch = useDispatch();

    const [linkError, setLinkError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);

    const [showMilestoneSubmissionModal, setShowMilestoneSubmissionModal] = useState(false);
    const [isUserSubmittedOpenMS, setIsUserSubmittedOpenMS] = useState(false);

    const helpLink = projectDetails?.helpLink || projectDetails?.organisation?.socialHandleLink?.telegram || projectDetails?.organisation?.socialHandleLink?.discord;

    const {data: openMilestoneSubmissions, isLoading: isLoadingOpenMilestoneSubmissions, refetch: refetchOpenMS} = useQuery({
        queryKey: ["openProjectSubmissions", projectDetails?._id],
        queryFn: () => getOpenProjectSubmissions(projectDetails?._id),
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

        if(!isValidLink(linkInput)) {
            setLinkError('Invalid Link');
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
                // milestone_id: milestoneData?._id,
                project_id: projectDetails?._id,
                user_id: user_id,
                submissionLink: linkInput,
                submissionDescription: descriptionTextarea,
                status: 'submitted'
            }
            response = await submitOpenProject(projectDetails?._id,body)
            setIsUserSubmittedOpenMS(true)
            refetchOpenMS();
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

        const { _id, __v, comments, milestones, totalPrize, created_at, updated_at, ...data } = projectDetails;
        data.status = type == 'accept' ? "completed" : "rejected";
        data.deadline = new Date(data.deadline).getTime();
        data.starts_in = new Date(data.starts_in).getTime();

        const res = await updateMilestone(projectDetails?._id, data);
        // const resProject = await updateProjectDetails(projectDetails._id, {status: type == 'accept' ? 'completed' : 'rejected'});
        // console.log('resProject', resProject)

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

    const time_remain = calculateRemainingDaysAndHours(new Date(), projectDetails?.starts_in);

    console.log('pd',projectDetails);
    

    return (
        <div className='flex flex-col gap-[14px]'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <img src={questionSVG} alt='question-mark' className='size-[16px]'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>{projectDetails?.isOpenBounty ? "Project" : "Milestone"} Status</p>
                </div>
                <div className='flex items-center gap-1 font-inter'>
                    {projectDetails?.status == 'idle' ? 
                        <>
                            <img src={hourglassSVG} alt='hourglass' className='size-[14px]'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>Idle</p>
                        </>
                    : projectDetails?.status == 'ongoing' ?
                        <>
                            <img src={hourglassSVG} alt='hourglass' className='size-[14px]'/>
                            <p className='text-white48 text-[12px] leading-[14px]'>In Progress</p>
                        </>
                    :  projectDetails?.status == 'under_review' ?
                        <>
                            <img src={warningSVG} alt='warning' className='size-[14px]'/>
                            <p className='text-cardYellowText text-[12px] leading-[14px]'>Under Review</p>
                        </>
                    :   projectDetails?.status == 'rejected' ?
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
                    <a href={helpLink?.startsWith('https://') ? helpLink : 'https://' + helpLink} target='_blank' rel="noopener noreferrer" className='cursor-pointer'>
                        <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter flex items-center gap-1 underline'>Join {helpLink?.includes('discord') ? "Discord" : "Telegram"}<ArrowUpRight size={14} className='text-white32'/></p>
                    </a>
                </div>
            </div>

            <div className="my-1">
                {
                (projectDetails?.status == 'idle' || projectDetails?.status == 'ongoing') && user_role == 'user' ?
                    <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={isUserSubmittedOpenMS ? btnImg : btnHoverImg}
                        img_size_classes='w-[342px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt={`${isUserSubmittedOpenMS ? 'submitted' : 'submit'}`}  
                        alt_txt='milestone submit btn' 
                        onClick={() => setShowSubmitModal(true)}
                        disabled={isUserSubmittedOpenMS}
                    />
                    : <></>
                }
                        {/* 
                        : milestoneData?.status == 'completed' ? 
                            <FancyButton 
                                src_img={btnImg} 
                                // hover_src_img={btnHoverImg}
                                img_size_classes='w-[342px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryGreen mt-1.5'
                                btn_txt={"Completed"}  
                                alt_txt='milestone submit btn' 
                                onClick={() => {}}
                                disabled={milestoneData?.status == 'completed'}
                            />
                        : ""
                        }
                {user_id != projectDetails?.user_id && user_role == 'sponsor' ?
                    <div>
                    </div>
                : 
                    projectDetails?.status == 'closed' ? "" :
                    milestoneData?.status == "completed" ? <div>
                       
                    </div> 
                    : ((projectDetails?.isOpenBounty && !isUserSubmittedOpenMS) || user_id == projectDetails?.user_id) ? 
                        milestoneData?.status != 'idle' && milestoneData?.status != 'ongoing'
                        ? 
                            <FancyButton 
                                src_img={btnImg} 
                                // hover_src_img={btnHoverImg}
                                img_size_classes='w-[342px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                                btn_txt={"Already Submitted"}  
                                alt_txt='milestone submit btn' 
                                onClick={() => {}}
                                disabled={milestoneData?.status != 'idle' && milestoneData?.status != 'ongoing'}
                            />
                        :
                        user_role == 'user' &&
                        <FancyButton 
                            src_img={btnImg} 
                            hover_src_img={btnHoverImg}
                            img_size_classes='w-[342px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                            // btn_txt={milestoneData?.status == 'under_review' || milestoneData?.status == 'rejected' ? 're-submit milestone' : 'submit milestone'}  
                            btn_txt={
                                milestoneData?.status == 'idle' || milestoneData?.status == 'ongoing' 
                                ? `${!projectDetails?.isOpenBounty ? "submit milestone" : "submit project"}` 
                                : `${!projectDetails?.isOpenBounty ?  "milestone submitted" : "project submitted"}`}  
                            alt_txt='milestone submit btn' 
                            onClick={() => setShowSubmitModal(true)}
                            disabled={milestoneData?.status != 'idle' && milestoneData?.status != 'ongoing'}
                        />
                    :
                        isUserSubmittedOpenMS && <FancyButton 
                        src_img={btnImg} 
                        // hover_src_img={btnHoverImg}
                        img_size_classes='w-[342px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt={"Already Submitted"}  
                        alt_txt='milestone submit btn' 
                        onClick={() => {}}
                        disabled={milestoneData?.status != 'idle' && milestoneData?.status != 'ongoing'}
                    />
                } */}
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
                            <p className='text-[11px] text-white32 font-inter mt-[2px]'>Prefered links: Google, Notion, Github or Figma</p>
                            {linkError && <p className='text-primaryRed text-[12px] mt-1'>{linkError}</p>}
                        </div>
                        <div className='flex flex-col mt-4'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Description <span className='text-primaryRed'>*</span></label>
                            <textarea rows={4} className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' placeholder='Fixed UI Bug'/>
                            {descriptionError && <p className='text-primaryRed text-[12px] mt-1'>{descriptionError}</p>}
                        </div>
                    </div>

                    {!isUserSubmittedOpenMS &&
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
                    }
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
                            <a href={projectDetails?.submissionLink} target='_blank' className='bg-white12 text-white88 py-1 px-2 rounded-md w-full underline'>{projectDetails?.submissionLink}</a>
                        </div>
                        <div className='flex flex-col mt-4'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Description</label>
                            <textarea rows={4} value={projectDetails?.submissionDescription} className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' placeholder='Fixed UI Bug'/>
                        </div>
                    </div>

                    <div>
                        {projectDetails?.status == 'under_review' && projectDetails?.status != 'closed' && user_role == 'sponsor'
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

export default OpenMilestoneStatusCard