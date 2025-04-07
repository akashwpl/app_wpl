import { ArrowUpRight, CheckCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { calculateRemainingDaysAndHours, isValidLink } from '../../lib/constants';
import { createNotification, getOpenMilestoneSubmissions, getOpenProjectSubmissions, sendProjectMilestoneReward, submitMilestone, submitOpenMilestone, updateMilestone, updateProjectDetails } from '../../service/api';

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

const   MilestoneStatusCard = ({ data: milestoneData, projectDetails, refetchProjectDetails, username, userDetails }) => {

    const {user_id, user_role} = useSelector(state => state)
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const dispatch = useDispatch();

    const [linkError, setLinkError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);

    const [otpInput, setOtpInput] = useState('');
    const [userEmail, setUserEmail] = useState(userDetails?.email || '')
    const [otpSid, setOtpSid] = useState(null);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const [otpErr, setOtpErr] = useState('')

    // const [link, setLink] = useState('');
    // const [desc, setDesc] = useState('');

    const [showMilestoneSubmissionModal, setShowMilestoneSubmissionModal] = useState(false);
    const [isUserSubmittedOpenMS, setIsUserSubmittedOpenMS] = useState(false);

    const helpLink = projectDetails?.helpLink || projectDetails?.organisation?.socialHandleLink?.telegram || projectDetails?.organisation?.socialHandleLink?.discord;

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

    const time_remain = calculateRemainingDaysAndHours(new Date(), milestoneData?.starts_in);

    const handleOtpInputChange = (e) => {
        const value = e.target.value;
        setOtpInput(value);

        setOtpErr('');

        if (!value) {
            setOtpErr('OTP is required.');
            setOtpInput('');
            return;
        }

        if (!/^\d+$/.test(value)) {
            setOtpErr('OTP must contain only numeric digits.');
            const currentInput = otpInput
            setOtpInput(currentInput);
            return;
        }

        if (value.length > 6) {
            setOtpErr('OTP cannot be more than 6 digits.');
            const currentInput = otpInput
            setOtpInput(currentInput);
            return;
        }

        setOtpInput(value);
    }

    const handleGetCopperXOtp = async () => {
        const otpUrl = 'https://income-api.copperx.io/api/auth/email-otp/request';
        const userEmail = userDetails?._id === projectDetails?.owner_id ? userDetails?.email : "";
        const otpBody = {
            email: userEmail
        }
        const otpRes = await fetch(otpUrl,{
            method: 'POST',
            body: JSON.stringify(otpBody),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
    
        if(otpRes?.sid) {
            setUserEmail(userEmail);
            setOtpSid(otpRes?.sid);
            dispatch(displaySnackbar("Please enter CopperX OTP"))
            setShowOtpModal(true);
        } else {
            dispatch(displaySnackbar("Something went wrong!!"))
        }
    }

    const handleMilestoneReward = async () => {
        const data = {
            email: userEmail,
            otp: otpInput,
            sid: otpSid
        }
        const resp = await sendProjectMilestoneReward(milestoneData._id, data);
        console.log('otp res',resp);

        if(resp?.message === "payed") {
            refetchProjectDetails();
            dispatch(displaySnackbar("Payment Initiated"))
            setShowOtpModal(false);
        } else if (resp?.err == 'OTP verification failed') {
            dispatch(displaySnackbar("Invalid OTP. Please enter correct OTP"))
        } else {
            dispatch(displaySnackbar("Payment Failed"))
            setShowOtpModal(false);
        }
    }

    const handleCloseOtpModal = () => {
        setShowOtpModal(false);
        setOtpInput('');
    }

    return (
        <div className='flex flex-col gap-[14px]'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <img src={questionSVG} alt='question-mark' className='size-[16px]'/>
                    <p className='text-[12px] text-white32 leading-[16px]'>{projectDetails?.isOpenBounty ? "Project" : "Milestone"} Status</p>
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
                    <a href={helpLink.startsWith('https://') ? helpLink : 'https://' + helpLink} target='_blank' rel="noopener noreferrer" className='cursor-pointer'>
                        <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter flex items-center gap-1 underline'>Join {helpLink.includes('discord') ? "Discord" : "Telegram"}<ArrowUpRight size={14} className='text-white32'/></p>
                    </a>
                </div>
            </div>

            <div className="my-1">
                {!projectDetails?.isOpenBounty ?
                    milestoneData?.status == 'under_review' && projectDetails?.owner_id == user_id ?
                        <FancyButton 
                            src_img={btnImg} 
                            hover_src_img={btnHoverImg}
                            img_size_classes='w-[342px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                            btn_txt={"user submission"}  
                            onClick={() => setShowMilestoneSubmissionModal(true)}
                            alt_txt='user submitted milestone btn' 
                            transitionDuration={500}
                        />
                    :
                    milestoneData?.status == 'completed' && projectDetails?.owner_id == user_id ?
                        <FancyButton 
                            src_img={btnImg} 
                            img_size_classes='w-[342px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryGreen mt-1.5'
                            btn_txt={milestoneData?.paymentStatus === 'initiated' ? "Payment Initiated" : "Make Payment"}  
                            alt_txt='milestone payment btn' 
                            onClick={handleGetCopperXOtp}
                            disabled={milestoneData?.paymentStatus === 'initiated'}
                        />
                    : 
                    (milestoneData?.status == 'idle' || milestoneData?.status == 'ongoing') && projectDetails?.user_id?._id == user_id && milestoneData?.user_status == 'idle' ?
                        <FancyButton 
                            src_img={btnImg} 
                            hover_src_img={btnHoverImg}
                            img_size_classes='w-[342px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                            btn_txt={'submit milestone'}  
                            alt_txt='milestone submit btn' 
                            onClick={() => setShowSubmitModal(true)}
                            transitionDuration={500}
                        />
                    :
                    milestoneData?.status == 'under_review' && milestoneData?.user_status == 'submitted' && projectDetails?.user_id?._id == user_id ?
                        <FancyButton 
                            src_img={btnImg} 
                            hover_src_img={btnHoverImg}
                            img_size_classes='w-[342px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                            btn_txt={'submitted'}  
                            alt_txt='milestone submitted btn'
                            onClick={() => setShowMilestoneSubmissionModal(true)}
                            transitionDuration={500}
                        />
                    :
                    milestoneData?.status == 'rejected' && milestoneData?.user_status == 'submitted' && projectDetails?.user_id?._id == user_id ?
                        <div className='flex justify-center items-center gap-2 bg-cardRedBg px-4 py-2 rounded-md mt-2'>
                            <img src={warningRedSVG} alt='warning-red' className='size-[20px]'/>
                            <p className='text-cardRedText font-inter text-[12px] leading-[14.4px] font-medium'>Your milestone was rejected due to an issue</p>
                        </div>
                    :<></>
                : 
                (milestoneData?.status == 'idle' || milestoneData?.status == 'ongoing') && user_role == 'user' ?
                    <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={isUserSubmittedOpenMS ? btnImg : btnHoverImg}
                        img_size_classes='w-[342px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt={`${isUserSubmittedOpenMS ? 'submitted' : 'submit'}`}  
                        alt_txt='milestone submit btn' 
                        onClick={() => setShowSubmitModal(true)}
                        disabled={isUserSubmittedOpenMS}
                        transitionDuration={isUserSubmittedOpenMS ? '' : 500}
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
                                transitionDuration={500}
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
                            <a href={milestoneData?.submissionLink} target='_blank' className='bg-white12 text-white88 py-1 px-2 rounded-md w-full underline'>{milestoneData?.submissionLink}</a>
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
                                transitionDuration={500}
                            />
                            <FancyButton 
                                src_img={closeProjBtnImg} 
                                hover_src_img={closeProjBtnHoverImg} 
                                img_size_classes='w-full h-[44px]' 
                                className='font-gridular text-[14px] leading-[8.82px] text-primaryRed mt-1.5'
                                btn_txt='reject'  
                                alt_txt='project apply btn' 
                                onClick={() => handleMileStoneSponsorAction('reject')}
                                transitionDuration={500}
                            />
                        </div>
                        : ""
                        }
                    </div>
                </div>
            </CustomModal>

            <CustomModal isOpen={showOtpModal} closeModal={handleCloseOtpModal}>
                <div className='bg-primaryDarkUI border border-white4 rounded-md w-[500px] p-3'>
                    <div className='flex justify-end'><X size={20} onClick={handleCloseOtpModal}  className='text-white88 hover:text-white64 cursor-pointer'/></div>
                    <div>
                        <p className='text-primaryYellow font-semibold font-gridular'>Enter CopperX OTP</p>
                        <div className='h-[1px] bg-primaryYellow w-full mt-2 mb-5'/>
                        <div className='flex flex-col mt-4 mb-4'>
                            <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1' htmlFor='otp'>OTP</label>
                            <input 
                                type="text" 
                                value={otpInput} 
                                onChange={(e) => handleOtpInputChange(e)} 
                                name="otp" 
                                id="otp"
                                placeholder='112233'
                                className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' 
                            />
                            {otpErr && <p className='text-red-500 font-medium text-[12px] mt-2'>{otpErr}</p>}
                        </div>
                        <FancyButton 
                            src_img={btnImg} 
                            hover_src_img={btnHoverImg} 
                            img_size_classes='w-[500px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                            btn_txt='submit'  
                            alt_txt='payment btn' 
                            onClick={handleMilestoneReward}
                            disabled={otpErr}
                            transitionDuration={500}
                        />
                        
                    </div>
                </div>
            </CustomModal>
        </div>
    )
}

export default MilestoneStatusCard