/* eslint-disable no-unused-vars */
import headerPng from '../assets/images/prdetails_header.png'
import wpl_prdetails from '../assets/images/wpl_prdetails.png'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Clock, Download, TriangleAlert, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import btnHoverImg from '../assets/svg/btn_hover_subtract.png'
import btnImg from '../assets/svg/btn_subtract_semi.png'
import closeProjBtnHoverImg from '../assets/svg/close_proj_btn_hover_subtract.png'
import closeProjBtnImg from '../assets/svg/close_proj_btn_subtract.png'
import menuBtnImgHover from '../assets/svg/menu_btn_hover_subtract.png'
import menuBtnImg from '../assets/svg/menu_btn_subtract.png'
import USDCimg from '../assets/svg/usdc.svg'
import STRKimg from '../assets/images/strk.png'
import MilestoneCard from '../components/projectdetails/MilestoneCard'
import MilestoneStatusCard from '../components/projectdetails/MilestoneStatusCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import FancyButton from '../components/ui/FancyButton'
import Tabs from '../components/ui/Tabs'
import { calculateRemainingDaysAndHours, convertTimestampToDate } from '../lib/constants'
import { acceptOpenProjectSubmissions, adminOpenProjectApproveOrReject, adminProjectApproveOrReject, createNotification, getOpenProjectSubmissions, getOrgById, getPendingProjects, getProjectDetails, getProjectSubmissions, getUserDetails, getUserProjects, updateOpenProjectDetails, updateProjectDetails } from '../service/api'

import alertPng from '../assets/images/alert.png'
import clockSVG from '../assets/icons/pixel-icons/watch.svg'
import warningSVG from '../assets/icons/pixel-icons/warning.svg'
import zapSVG from '../assets/icons/pixel-icons/zap-yellow.svg'
import OpenMilestoneSubmissions from '../components/projectdetails/OpenMilestoneSubmissions'
import { displaySnackbar } from '../store/thunkMiddleware'
import CustomModal from '../components/ui/CustomModal'
import TrophyPng from '../assets/images/trophy.png'

import { Reorder, useDragControls } from "framer-motion"
import { debounce, set } from 'lodash'
import DraggableDotsPng from '../assets/images/dragable-dots.png'

import GreenButtonPng from '../assets/svg/green_btn_subtract.png'
import GreenButtonHoverPng from '../assets/svg/green_btn_hover_subtract.png'
import DistributeRewardsPage from '../components/projectdetails/DistributeRewardsPage'
import OpenMilestoneStatusCard from '../components/projectdetails/OpenMilestoneStatusCard'
import WinnersTable from '../components/projectdetails/WinnersTable'


const initialTabs = [
  {id: 'overview', name: 'Overview', isActive: true},
]
const isOwnerTabs = [
  {id: 'overview', name: 'Overview', isActive: true},
  {id: 'submissions', name: 'Submissions', isActive: false},
]

const ProjectDetailsPage = () => {

  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const controls = useDragControls()
  const { user_id, user_role } = useSelector((state) => state)

  const {data: projectDetails, isLoading: isLoadingProjectDetails, refetch: refetchProjectDetails} = useQuery({
    queryKey: ['projectDetails', id],
    queryFn: () => getProjectDetails(id),
    enabled: !!id
  })

  const [orgHandle, setOrgHandle] = useState('');
  const [isProjApplied, setIsProjApplied] = useState(false);
  const [username, setUsername] = useState('A user');
  const [openMilestoneSubmissions, setOpenMilestoneSubmissions] = useState([]);

  const [selectedWinners, setSelectedWinners] = useState([])
  console.log('sw',selectedWinners);
  
  const [canSelectWinners, setCanSelectWinners] = useState(true)  
  const [showSelecteWinnersModal, setShowSelecteWinnersModal] = useState(false)
  const [isDistributingRewards, setIsDistributingRewards] = useState(false)

  const token = localStorage.getItem('token_app_wpl')

  const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })
  
  useEffect(() => {
    if(!isLoadingUserDetails) setUsername(userDetails?.displayName);
  },[isLoadingUserDetails])

  const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
    queryKey: ["userProjects", user_id],
    queryFn: getUserProjects
  })

  const {data: projectSubmissions, isLoading: isLoadingProjectSubmissions} = useQuery({
    queryKey: ['projectSubmissions', id],
    queryFn: () => getProjectSubmissions(id),
  })

  const {data: openProjectSubmissions, isLoading: isLoadingOpenProjectSubmissions, refetch: refetchOpenProjectSubmissions} = useQuery({
    queryKey: ['openProjectSubmissions', id],
    queryFn: () => getOpenProjectSubmissions(id),
    enabled: !!projectDetails?.isOpenBounty
  })

  // To check if the user has applied to bounty or not
  useEffect(() => {
    !isLoadingProjectSubmissions && 
    projectSubmissions?.map((project) => {
      if(project?.user?.email?.toLowerCase() == userDetails?.email?.toLowerCase()) {
        setIsProjApplied(true);
        return;
      }
    })
  },[isLoadingProjectSubmissions])

  useEffect(() => {
    if(projectDetails?.isOpenBounty && !isLoadingOpenProjectSubmissions) {
      // const formattedData = []
      // const groupedData = openProjectSubmissions?.reduce((acc, curr) => {
      //   (acc[curr.milestone_id] = acc[curr.milestone_id] || []).push(curr);
      //   return acc;
      // }, {});
      // const formattedData = groupedData && Object.entries(groupedData).reduce((acc, [milestone_id, data]) => {
      //   const milestoneData = projectDetails?.milestones.find(
      //     (item) => item._id === milestone_id
      //   );
      //   if (milestoneData) {
      //     acc.push({
      //       title: milestoneData.title,
      //       status: milestoneData.status,
      //       submissions: data
      //     })
      //   }
      //   return acc;
      // }, []);
      setOpenMilestoneSubmissions(openProjectSubmissions);
    }
  }, [isLoadingOpenProjectSubmissions]);

  useEffect(() => {
    const fetchOrgHandle = async () => {
      if(!isLoadingProjectDetails && !projectDetails?.organisationHandle) {
        const org = await getOrgById(projectDetails.organisationId);
        setOrgHandle(org[0].organisationHandle);
      }
    }

    console.log('pd',projectDetails);
    const updateProjectStatus = async () => {
      
      if(!isLoadingProjectDetails && !projectDetails?.isOpenBounty) {
        const submittedMs = projectDetails?.milestones?.filter((ms) => {
          return ms.status == 'rejected' || ms.status == 'completed'
        })
  
        if(submittedMs.length == projectDetails?.milestones?.length && !projectDetails?.isOpenBounty && (projectDetails?.status != 'completed' && projectDetails?.status != 'closed')) {
          // Mark project as completed
          const data = {
            project: { status: "completed" },
            milestones: projectDetails?.milestones        // milestones is a required field
          }
          const res = await updateProjectDetails(projectDetails._id, data);
          const notiObj = {
            msg: `The Bounty has been marked as Complete. Check this out...`,
            type: 'project_req',
            fromId: user_id,
            user_id: projectDetails.user_id,
            project_id: projectDetails._id
          }
          const notiRes = await createNotification(notiObj)
        }
        refetchProjectDetails()
      }
    } 

    fetchOrgHandle();
    updateProjectStatus();
  },[isLoadingProjectDetails])

  const [tabs, setTabs] = useState([])
  const [selectedTab, setSelectedTab] = useState('overview')

  const [showCloseProjectModal, setShowCloseProjectModal] = useState(false)

  const handleTabClick = (id) => {
    const newTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === id
    }));
    setTabs(newTabs)
    setSelectedTab(id)
  }

  const editProject = () => {
    navigate(`/editproject/${id}`)
  }

  const applyForProject = () => {
    navigate(`/projectdetails/form/${id}`)
  }

  const closeProject = async () => {
    const data = {
      project: { status: "closed" },
      milestones: projectDetails?.milestones        // milestones is a required field
    }

    if(projectDetails?.isOpenBounty) {
      const data = {
        status: "closed"
      }
      const res = await updateOpenProjectDetails(projectDetails._id, data);
    } else {
      const res = await updateProjectDetails(projectDetails._id, data);
    }

    const notiObj = {
      msg: `${username} has marked the project as Closed...`,
      type: 'project_req',
      fromId: user_id,
      user_id: projectDetails.user_id,
      project_id: projectDetails._id
    }
    await createNotification(notiObj)

    refetchProjectDetails()
    setShowCloseProjectModal(false);
  }

  const navigateToSubmissions = (page) => {
    navigate(`/submissions/${projectDetails?._id}/${page}`)
  }

  const isOwner = useMemo(() => projectDetails?.owner_id == user_id, [projectDetails, user_id])

  useEffect(() => {
    setTabs(isOwner ? isOwnerTabs : initialTabs)
  }, [isOwner])

  // const totalPrize = useMemo(() => projectDetails?.milestones?.reduce((acc, milestone) => acc + parseFloat(milestone.prize), 0) || 0, [projectDetails]);
  const totalPrize = projectDetails?.totalPrize || 0;
  const totalSubmissions = useMemo(() => projectSubmissions?.length, [projectSubmissions])

  const remain = calculateRemainingDaysAndHours(new Date(), convertTimestampToDate(projectDetails?.deadline))

  const navigateBack = () => {
    if(showCloseProjectModal) {
      setShowCloseProjectModal(false)
    } else {
      navigate(-1)
    }
  }

  const allMilestonesCompleted = useMemo(() => {
    return projectDetails?.milestones?.every(milestone => milestone.status == 'completed')
  }, [projectDetails])

  const allMilestonesPaymentCompleted = useMemo(() => {
    return projectDetails?.milestones?.every(milestone => milestone.paymentStatus != 'pending' && milestone.paymentStatus != 'failed')
  }, [projectDetails])

  const handleAcceptRejectRequest = async (id, userId, title, bountyType, status) => {
    const dataObj = { isApproved: status }
    let res;
    if(!bountyType) {
      res = await adminProjectApproveOrReject(id, dataObj);
    } else {
      res = await adminOpenProjectApproveOrReject(id, dataObj);
    }
    
    if(res._id) {
      const notiObj = {
        msg: `Admin has ${status ? "approved" : "rejected"} your bounty: ${title}.`,
        type: 'project_req',
        fromId: user_id,
        user_id: userId,
        project_id: id
      }
      const res = await createNotification(notiObj)
      dispatch(displaySnackbar(`You have successfully ${status ? 'Approved' : 'Rejected'} the bounty: ${title}.`))
    } 
    refetchProjectDetails();
  }

  // Not allowing users to view pending or rejected bounties, those are only accessible to admin and sponsor
  useEffect(() => {
    if(!isLoadingProjectDetails) {
      if(projectDetails?.approvalStatus != 'approved' && (user_role == 'user' || !token)) {
        dispatch(displaySnackbar(`You are not allowed to check this page`));
        navigate('/')
      }
    }
  },[isLoadingProjectDetails])

  const handleAddRemoveSelectedWinner = (e, submission) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedWinners((prevWinners) => {
        // Check if the submission already exists in the list
        const exists = prevWinners?.some((winner) => winner._id === submission._id);

        if (exists) {
            // Remove the submission if it exists
            return prevWinners.filter((winner) => winner._id !== submission._id);
        } else {
            // Add the submission if it does not exist
            return [...prevWinners, submission];
        }
    });
};

const debouncedOnReorder = useCallback(
  debounce((newOrder) => {
    setSelectedWinners(newOrder);
  }, 450), // 300ms delay
  []
);
  
  const handleRewardWinners = async () => {
    const body = selectedWinners?.map((winner, index) => {
      return {
        rank: index+1,
        id: winner._id
      }
    })

    // Accept user submissions and add to winner list
    const res = await acceptOpenProjectSubmissions(projectDetails?._id, body)
    console.log('rsp',res);
    

    if(res?.message == 'success') {
      dispatch(displaySnackbar('You have selected winners successfully'))      
      setShowSelecteWinnersModal(false)
      setIsDistributingRewards(true)
    } else {
      dispatch(displaySnackbar('Something went wrong'))      
    }
  }

  const handleSelectWinner = () => {
    console.log(projectDetails.winners)
    if(projectDetails?.winners?.length == 0) {
      setShowSelecteWinnersModal(true);
    } else {
      console.log('in len > 0');
      setSelectedWinners(projectDetails?.winners)
      setCanSelectWinners(false)
      setShowSelecteWinnersModal(false)
      setIsDistributingRewards(true)
    }
  }

  return (
    <div className='relative'>
      {!isDistributingRewards ? 
      <>
        <div>
          <img src={headerPng} alt='header' className='h-[200px] w-full'/>
        </div>

        <div className='absolute top-1 left-0 w-full py-1'>
          <div onClick={() => {navigateBack()}} className='flex items-center gap-1 mx-20 text-white text-[14px] font-inter cursor-pointer hover:text-white88 w-fit'>
            <ArrowLeft size={18}/> Go Back
          </div>
        </div>


        {!showCloseProjectModal ?
          <>
            <div className='flex justify-center gap-20 mx-44'>
              {/* Left side */}
              <div>
                <div className='md:min-w-[600px]'>
                  <div className='translate-y-[-15px]'>
                    <img src={projectDetails?.image || wpl_prdetails} alt='wpl_prdetails' className='size-[72px] rounded-md'/>
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                      <p className='text-[24px] text-primaryYellow font-gridular leading-7'>{projectDetails?.title}</p>
                      <div className='text-[12px] font-medium text-[#FCBF04] flex items-center gap-1 bg-[#FCBF041A] rounded-[4px] px-2 py-1 font-inter'>
                        <img src={zapSVG} alt='zap' className='size-[16px]'/>
                        {/* <Zap size={14} className='text-[#FCBF04]'/> */}
                        <p className='capitalize'>{projectDetails?.isOpenBounty ? 'Bounty' : 'Project'}</p>
                      </div>
                    </div>
                    <p className='text-[14px] text-white32 leading-5 underline'><a href={projectDetails?.organisation?.websiteLink} target='_blank' rel="noopener noreferrer" >@{projectDetails?.organisationHandle || orgHandle}</a></p>
                    <div className='flex gap-2 leading-5 font-inter text-[14px] mt-2'>
                      <p className='text-white88'>{projectDetails?.isOpenBounty ? openProjectSubmissions?.length : totalSubmissions} <span className='text-white32'>Submissions</span></p>
                    </div>
                  </div>

                  {projectDetails?.isOpenBounty && projectDetails?.status === 'completed' && projectDetails?.winners?.length == projectDetails?.noOfWinners && 
                    <>
                      <p className='font-gridular text-[16px] text-primaryYellow mt-4'>Bounty Winner/s</p>
                      <WinnersTable projectDetails={projectDetails} />
                    </> 
                  }

                  {isLoadingProjectDetails ? <div>Loading...</div> : <div className='w-full'>
                    <div className='mt-4 mb-4 border border-white7 rounded-md flex justify-between items-center'>
                      <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab} submissionsCount={totalSubmissions} />
                      {isOwner && selectedTab == 'submissions' && projectDetails?.isOpenBounty && projectDetails?.winners.length == 0 && openMilestoneSubmissions?.length !==0 && <button onClick={() => setCanSelectWinners((prev) => !prev)} className='border border-white7 rounded-lg h-[32px] w-[135px] mr-4 flex justify-center items-center'>
                        <p className='text-[14px] font-gridular text-white48'>Select winners</p>
                      </button>}
                    </div>
                    {selectedTab == 'overview' &&
                      <div className='w-[700px]'>
                        <div className='mt-5 flex flex-col justify-between'>
                          <p className='font-inter text-white88 leading-[21px] text-wrap'>{projectDetails?.description}</p>
                          <div className='text-white48 text-[14px] mt-4'>Role: <span className='flex flex-wrap gap-1'>{projectDetails?.roles?.map((role, index) => <span className='mr-1 capitalize bg-white12 rounded-md px-2 py-1 text-[12px] font-inter'> {role}</span>)}</span></div>
                        </div>
                        <div className='h-[1px] w-full bg-white7 mt-4 mb-3'/>
                        <div>
                          <Accordion type="single" defaultValue="item-1" collapsible>
                            <AccordionItem value="item-1" className="border-white7">
                              <AccordionTrigger className="text-white48 font-inter hover:no-underline">About</AccordionTrigger>
                              <AccordionContent>
                              <div className='font-inter text-white88 leading-[21px]'>
                                <p className='mt-3 text-wrap'>{projectDetails?.about}</p>
                              </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {!projectDetails?.isOpenBounty &&
                          <div className='pb-32'>
                            <Accordion type={projectDetails?.milestones?.length <= 1 ? "single" : 'multiple'} defaultValue={projectDetails?.milestones?.length <= 1 ? "item-0" : ''} collapsible>
                              {projectDetails?.milestones?.map((milestone, index) => (
                                <AccordionItem value={`item-${index}`} key={index} className="border-white7">
                                  <AccordionTrigger className="text-white48 font-inter hover:no-underline">Milestone {index + 1}</AccordionTrigger>
                                  <AccordionContent>
                                    <MilestoneCard data={milestone}/>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        }
                      </div>
                    }

                    {isOwner && selectedTab == 'submissions' && <div className='w-[700px]'>
                      <div className='bg-[#091044] rounded-md py-2'>
                        <div className='flex justify-between items-center py-2 px-4'>
                          <div className='text-[14px] font-gridular text-white88'>Submission ({projectDetails?.isOpenBounty ? openProjectSubmissions?.length : totalSubmissions})</div>
                          {/* <div className='text-[12px] font-gridular text-white48 flex items-center gap-2'>Download as CSV <Download size={18} color='#FFFFFF7A'/></div> */}
                        </div>
                        { projectDetails?.isOpenBounty ? 
                        openMilestoneSubmissions?.length == 0 ?
                          <div className='text-[14px] px-4 py-2 text-center text-primaryYellow border-t border-white7 font-gridular'>No submissions yet</div>
                        :
                          <>
                            {/* <div className='text-[14px] text-primaryYellow font-gridular text-center'>No submissions yet</div> :  */}
                            <div className={` ${canSelectWinners ? "px-0" : "px-4"} border-t border-dashed border-white12`}>
                              <div className='grid grid-cols-12 gap-2 my-2'>
                                {canSelectWinners && <div className='col-span-1'/>}
                                <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                                <div className='text-[14px] col-span-2 text-white48 font-inter'>Name</div>
                                <div className='text-[14px] col-span-4 text-white48 font-inter'>Link</div>
                                <div className={`text-[14px] ${canSelectWinners ? "col-span-4" : "col-span-5"} text-white48 font-inter`}>Description</div>
                              </div>
                              <div className='max-h-[400px] overflow-y-auto'>
                              {openMilestoneSubmissions?.map((submission, index) => (
                                <div key={index}>
                                  <OpenMilestoneSubmissions key={index} submission={submission} index={index} submission_count={openMilestoneSubmissions?.length-1} projectStatus={projectDetails?.status} milestoneStatus={projectDetails?.status} username={userDetails?.displayName} refetchProjectDetails={refetchProjectDetails} canSelectWinners={canSelectWinners} selectedWinners={selectedWinners} handleAddRemoveSelectedWinner={handleAddRemoveSelectedWinner}/>
                                </div>
                              ))}
                              </div>
                            </div>
                          </>
                        :
                        totalSubmissions == 0 ? <div className='text-[14px] px-4 text-primaryYellow font-gridular'>No submissions yet</div> : <>
                          <div className='grid grid-cols-12 gap-2 mb-2 px-4'>
                            <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                            <div className='text-[14px] col-span-3 text-white48 font-inter'>Name</div>
                            <div className='text-[14px] col-span-4 text-white48 font-inter'>Why should we hire you</div>
                            <div className='text-[14px] col-span-4 text-white48 font-inter'>Share your work</div>
                          </div>

                          <div className='max-h-[300px] overflow-y-auto'>
                            {projectSubmissions?.map((submission, index) => {
                              return <div onClick={() => navigateToSubmissions(index + 1)} key={index} className={`grid grid-cols-12 gap-2 py-2 px-4 rounded-sm hover:bg-white4 cursor-pointer ${index === projectSubmissions.length - 1 ? "" : "border-b border-white7"}`}>
                                <div className='text-[14px] col-span-1 text-white88 font-inter'>{index + 1}</div>
                                <div className='text-[14px] col-span-3 text-start text-white88 font-inter flex gap-1 items-center truncate text-ellipsis'>
                                  {submission?.user?.displayName}
                                  <div className={`${submission?.user?.isKYCVerified ? "bg-[#0ED0651A] text-[#9FE7C7]" : "bg-errorMsgRedText/10 text-cardRedText/80"} text-[10px] w-fit px-2 py-[3px] rounded-md`}>
                                    {submission?.user?.isKYCVerified ? "Verified" : "Not Verified"}
                                  </div>
                                </div>
                                <div className='text-[14px] col-span-4 text-white88 font-inter truncate'>{submission?._doc?.experienceDescription}</div>
                                <div className='text-[14px] col-span-4 text-white88 font-inter'>{submission?._doc?.portfolioLink}</div>
                              </div>
                            })}
                          </div>
                        </>
                        }
                        </div>
                        {canSelectWinners && openMilestoneSubmissions?.length > 0 &&
                        <div className='flex justify-center items-center mt-6'>
                          <FancyButton 
                            src_img={menuBtnImg} 
                            hover_src_img={menuBtnImgHover} 
                            img_size_classes='w-[263px] h-[44px]' 
                            className='font-gridular text-[13px] leading-[16.8px] text-primaryYellow mt-0.5'
                            btn_txt={<span className='flex items-center justify-center gap-2 text-[13px] font-gridular normal-case'>{projectDetails?.winners?.length == 0 ? 'Shortlist selected winners' : 'Complete Payment'}</span>} 
                            alt_txt='save project btn' 
                            onClick={handleSelectWinner}
                            transitionDuration={500}
                          />
                        </div>}
                      </div>
                    }
                  </div>
                  }
                </div>
              </div>

              {/* Right side */}
              <div className='mt-[35px]'>
                <div className='w-[372px] h-fit pb-4 bg-white4 rounded-[10px]'>
                  {/* project dealine  */}
                  <div className='flex items-center gap-2 mx-4 py-4'>
                    <img src={clockSVG} alt='clock' className='size-[16px]'/>
                    <p className='text-[14px] text-white32 leading-[20px] font-inter'>Project Deadline in <span className='text-white88 ml-1'>{remain.days < 0 ? <span className=''>--</span> : `${remain.days} D ${remain.hours} H`}</span></p>
                  </div>

                  {/* loader line */}
                  <div className='h-[1px] w-full'>
                    <div className='h-[1px] w-full bg-primaryYellow'/>
                    <div className='h-[1px] translate-y-[-1px] w-full bg-white7'/>
                  </div>

                  {/* Total Prize section */}
                  <div className='flex flex-col justify-center items-center mt-8'>
                    <p className='text-[14px] text-white32 leading-4 font-inter'>Total Prizes</p>
                    <p className='text-[24px] text-white88 leading-[28px] font-gridular flex items-center gap-2'>
                      <img src={projectDetails?.currency == 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[24px]'/>
                      {totalPrize} <span className='text-white48'>{projectDetails?.currency || 'USDC'}</span>
                    </p>
                  </div>

                  {/* Milestone status card for Open / Gated bounties */}
                  {!projectDetails?.isOpenBounty ?
                    // for gated bounties
                    <div className='bg-white7 border border-white4 rounded-[8px] px-3 mx-4 mt-4'>
                      <Accordion type="single" defaultValue="item-0" collapsible>
                        {projectDetails?.milestones?.map((milestone, index) => (
                          <AccordionItem value={`item-${index}`} key={index} className="border-white7">
                            <AccordionTrigger className="text-white48 font-inter hover:no-underline">
                              <div className='flex justify-between items-center w-full text-[13px] font-medium text-white88'>
                                <p>Milestone {index + 1}</p>
                                <p className='flex items-center gap-1'><img src={milestone?.currency == 'STRK' ? STRKimg : USDCimg} alt='ms-currency' className='size-[14px]'/>{milestone?.prize} <span className='text-white48'>{milestone?.currency}</span></p>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="py-2 border-t border-dashed border-white12">
                              <MilestoneStatusCard data={milestone} projectDetails={projectDetails} refetchProjectDetails={refetchProjectDetails} username={username} userDetails={userDetails} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  :
                    // for open bounties
                    <div className='bg-white7 border border-white4 rounded-[8px] p-3 mx-4 mt-4'>
                      {projectDetails?.isOpenBounty ?
                        <OpenMilestoneStatusCard projectDetails={projectDetails} refetchProjectDetails={refetchProjectDetails} username={username} />
                        // <div>open</div> 
                        :
                        projectDetails?.milestones?.map((milestone, index) => (
                          <MilestoneStatusCard data={milestone} projectDetails={projectDetails} refetchProjectDetails={refetchProjectDetails} username={username} />
                        ))
                      }
                    </div>
                  }

                  {/* below milestone card section   */}
                  {
                  // user not logged in view
                  !token ?
                    <div className='mx-4 mt-4'>
                      <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={btnHoverImg} 
                        img_size_classes='w-[342px] h-[44px]' 
                        className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5`}
                        btn_txt={'login'} 
                        alt_txt='login btn' 
                        onClick={() => {navigate('/onboarding')}}
                        transitionDuration={500}
                      />
                    </div>
                  : 

                  // bounty closed view for all user types
                  projectDetails?.status == 'closed' ? 
                    <div className='text-primaryRed flex justify-center items-center gap-1 mt-4'><TriangleAlert size={20}/> Project has been closed</div>
                  :

                  // bounty completed view for all user types
                  projectDetails?.status == 'completed' && allMilestonesCompleted && allMilestonesPaymentCompleted || (projectDetails?.isOpenBounty && projectDetails?.status == 'completed') ?
                    <div className='text-primaryGreen flex justify-center items-center gap-1 mt-4'><TriangleAlert size={20}/> Project has been Completed</div>
                  :

                  // for sponsor view
                  isOwner && user_role == 'sponsor' ?

                    // sponsor project approval dependent UI updates
                    projectDetails?.approvalStatus == 'pending' ?

                      // project waiting for admin approval
                      <div className='mx-4 mt-4'>
                        <FancyButton 
                          src_img={btnImg} 
                          img_size_classes='w-[342px] h-[44px]' 
                          className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5`}
                          btn_txt={'waiting for admin approval'} 
                          alt_txt='admin pending approval btn' 
                          disabled={true}
                        />
                      </div>
                    :
                      projectDetails?.approvalStatus == 'rejected' ?

                      // project rejected by admin
                      <div className='mx-4 mt-4'>
                        <FancyButton 
                          src_img={btnImg} 
                          img_size_classes='w-[342px] h-[44px]' 
                          className={`font-gridular text-[14px] leading-[8.82px] text-primaryRed mt-1.5`}
                          btn_txt={'Rejected by admin'} 
                          alt_txt='admin rejected approval btn' 
                          disabled={true}
                        />
                      </div>
                    :
                      // project approved by admin
                        <div className='mx-4 mt-4'>
                        <FancyButton 
                          src_img={btnImg} 
                          img_size_classes='w-[342px] h-[44px]' 
                          className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5`}
                          // className={`font-gridular text-[14px] leading-[8.82px] ${projectDetails?.approvalStatus == 'approved' ? 'text-primaryGreen' : 'text-primaryRed'} mt-1.5`}
                          // btn_txt={`bounty ${projectDetails?.approvalStatus}`} 
                          btn_txt={`submissions`} 
                          alt_txt='submissions btn' 
                          onClick={() => setSelectedTab('submissions')}
                          // disabled={true}
                        />
                      </div>
                  :
                    // for Admin project flow
                    user_role == 'admin' ?
                    
                    // project is in pending status and requires admin approval
                    projectDetails?.approvalStatus == 'pending' ?
                      <div className='mx-4 mt-4 flex justify-center items-center gap-3'>
                        <FancyButton 
                          src_img={menuBtnImg} 
                          hover_src_img={menuBtnImgHover} 
                          img_size_classes='w-[162px] h-[44px]' 
                          className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                          btn_txt='Accept' 
                          alt_txt='admin project accept btn' 
                          onClick={() => handleAcceptRejectRequest(projectDetails._id,projectDetails.owner_id,projectDetails.title,projectDetails.isOpenBounty,true)}
                          transitionDuration={500}
                        />
                        <FancyButton 
                          src_img={closeProjBtnImg} 
                          hover_src_img={closeProjBtnHoverImg}
                          img_size_classes='w-[162px] h-[44px]'
                          className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                          btn_txt='Reject'
                          alt_txt='admin project reject btn'
                          onClick={() => handleAcceptRejectRequest(projectDetails._id,projectDetails.owner_id,projectDetails.title,projectDetails.isOpenBounty,false)}
                          transitionDuration={500}
                        />
                      </div>
                    :
                      // project is not in pending status
                      <div className='mx-4 mt-4 flex justify-center items-center gap-3'>

                        {/* Bounty close btn */}
                        <FancyButton 
                          src_img={closeProjBtnImg} 
                          hover_src_img={closeProjBtnHoverImg}
                          img_size_classes='w-[162px] h-[44px]'
                          className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                          btn_txt='Close project'
                          alt_txt='project close btn'
                          onClick={() => setShowCloseProjectModal(true)}
                          transitionDuration={500}
                        />

                        {/* bounty edit btn */}
                        <FancyButton 
                          src_img={menuBtnImg} 
                          hover_src_img={menuBtnImgHover} 
                          img_size_classes='w-[162px] h-[44px]' 
                          className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                          btn_txt='Edit Project' 
                          alt_txt='view submissions btn' 
                          // onClick={() => setSelectedTab('submissions')}
                          onClick={editProject}
                          transitionDuration={500}
                        />
                      </div>
                    : 
                    //user view
                    // user_role == 'user' ?

                    // for Gated bounties
                    !projectDetails?.isOpenBounty ?

                    // user apply button condition
                    projectDetails?.status == 'idle' ?

                      // user apply btn for bounty
                      <div className='mx-4 mt-4'>
                        <FancyButton 
                          src_img={btnImg} 
                          hover_src_img={isProjApplied ? btnImg : btnHoverImg} 
                          img_size_classes='w-[342px] h-[44px]' 
                          className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5}`}
                          btn_txt={isProjApplied ? 'Applied' : 'Apply'} 
                          alt_txt='project apply btn' 
                          onClick={applyForProject}
                          disabled={isProjApplied}
                          transitionDuration={isProjApplied ? '' : 500}
                        />
                      </div>
                    :
                    
                    // situation for ongoing projects
                    projectDetails?.status == 'ongoing' ?

                    // if user was selected to work on project
                    projectDetails?.user_id?._id === user_id ?
                      <div className='flex justify-center items-center gap-2 bg-cardYellowBg px-4 py-1.5 rounded-md mt-4 mx-4'>
                        <img src={warningSVG} alt='warning' className='size-[20px]'/>
                        <p className='text-cardYellowText font-inter text-[12px] leading-[14.4px] font-medium'>PS: You can submit {projectDetails?.isOpenBounty ? 'the bounty' : 'a milestone'} only ONCE. No backsies.</p>
                      </div>
                    :

                      // if another user got selected to work on project
                      <div className='flex justify-center items-center gap-2 bg-cardYellowBg px-4 py-1.5 rounded-md mt-4 mx-4'>
                        <img src={warningSVG} alt='warning' className='size-[20px]'/>
                        <p className='text-cardYellowText font-inter text-[12px] leading-[14.4px] font-medium'>Oops! {projectDetails?.isOpenBounty ? 'Bounty' : 'Project'} already assigned. Meanwhile, check other bounties on the platform.</p>
                      </div>
                    :
                    null
                    :
                    <div className='flex justify-center items-center gap-2 bg-cardYellowBg px-4 py-1.5 rounded-md mt-4 mx-4'>
                      <img src={warningSVG} alt='warning' className='size-[20px]'/>
                      <p className='text-cardYellowText font-inter text-[12px] leading-[14.4px] font-medium'>PS: You can submit {projectDetails?.isOpenBounty ? 'the bounty' : 'a milestone'} only ONCE. No backsies.</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </>
        : 
          // Close project Modal
          <div className='flex justify-center items-center mt-10'>
            <div className='w-[480px] px-4 flex flex-col justify-center items-center'>
                <div className='border border-dashed border-primaryRed/15 bg-primaryRed/10 w-full flex gap-2 p-2 rounded-md'>
                  <div className=''>
                    <img src={projectDetails?.image || wpl_prdetails} alt='wpl_prdetails' className='size-[72px] rounded-md'/>
                  </div>
                  <div>
                    <h2 className='text-white88 font-gridular text-[20px]'>{projectDetails?.title}</h2>
                    <p className='text-white32 font-inter text-[14px] underline'><a href={projectDetails?.organisation?.websiteLink} target='_blank' rel="noopener noreferrer" >@{projectDetails?.organisationHandle || orgHandle}</a></p>
                  </div>
                </div>

                <div className='mt-10'>
                  <img src={alertPng} alt='close project' className='' />
                </div>

                <div className='flex flex-col justify-center items-center mt-4'>
                  <h2 className='font-inter text-white'>You're closing this project</h2>
                  <p className='text-white32 text-[13px] font-semibold font-inter'>Make sure that you've communicated this to all the involved parties.</p>
                </div>

                <div className='flex justify-center items-center w-full mt-5 gap-2'>
                  <FancyButton 
                    src_img={closeProjBtnImg} 
                    hover_src_img={closeProjBtnHoverImg}
                    img_size_classes='w-[480px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                    btn_txt='Close project' 
                    alt_txt='project close btn' 
                    onClick={closeProject}
                    transitionDuration={500}
                  />
                </div>
                
              </div>
          </div>
        }
        </>
        : <DistributeRewardsPage selectedWinner={selectedWinners} projectDetails={projectDetails} setIsDistributingRewards={setIsDistributingRewards}/>
      }

      {showSelecteWinnersModal && (projectDetails?.winners?.length > 0 || selectedWinners?.length > 0) &&
        <CustomModal
          isOpen={showSelecteWinnersModal}
          closeModal={() => setShowSelecteWinnersModal(false)}
        >
          <div className='bg-[#101C77] w-[580px] h-full rounded-xl py-6 px-4'>
            <div className='flex flex-col justify-center items-center gap-3'>
              <img src={TrophyPng} className='size-[48px]'/>
              <h3 className='text-primaryYellow text-[24px] leading-[28px] font-gridular'>Reorder submissions as per rank</h3>
              <p className='w-[390px] text-center text-white32 text-[14px] font-inter leading-[19px]'>Hold and drag a submission to move it around. Remember 
              to rank people in descending order.</p>
            </div>
            <div className='bg-[#091044] rounded-xl mt-6'>
              <div className='grid grid-cols-3 py-3 border-b border-white4'>
                <p className='col-span-1 text-white32 text-[13px] font-semibold font-inter text-start pl-14'>Rank</p>
                <p className='col-span-1 text-white32 text-[13px] font-semibold font-inter text-start'>Name</p>
                <p className='col-span-1 text-white32 text-[13px] font-semibold font-inter text-end pr-4'>Share your work</p>
              </div>
              <Reorder.Group axis='y' values={selectedWinners} onReorder={debouncedOnReorder}>
                {selectedWinners?.map((submission, index) => (
                  <Reorder.Item
                    value={submission}
                    key={index}
                    className='rounded-md flex items-center cursor-pointer'
                    dragListener={true}
                    dragControls={controls}
                  >
                    <div className='grid grid-cols-3  w-full h-[52px]'>
                      <div className='col-span-1 flex justify-start items-center pl-10'>
                        <div className='-translate-x-4'>
                          <img src={DraggableDotsPng} alt='drag' className='size-[16px]'/>
                        </div>
                        <p className='text-white88 text-[14px]'>{index == 0 ? "First" : index == 1 ? "Second" : index == 2 ? "Third" : "Shortlisted"}</p>
                      </div>
                      <div className='col-span-1 flex justify-start items-center gap-2'>
                        <img src={submission?.user?.pfp} alt='user' className='size-[24px] rounded-md'/>
                        <p className='text-white88 text-[14px]'>{submission?.user?.displayName}</p>
                      </div>
                      <div className='col-span-1 flex justify-end items-center pr-4'>
                        <p className='text-white88 text-[14px]'>{submission?.submissionLink}</p>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <div className='mt-6 w-full flex justify-between items-center'>
              <FancyButton 
                src_img={closeProjBtnImg} 
                hover_src_img={closeProjBtnHoverImg} 
                img_size_classes='w-[263px] h-[44px]' 
                className='font-gridular text-[13px] leading-[16.8px] text-[#E38070] mt-1'
                btn_txt='Go back' 
                alt_txt='save project btn' 
                onClick={() => {setShowSelecteWinnersModal(false)}}
                transitionDuration={500}
              />
              <FancyButton 
                src_img={GreenButtonPng} 
                hover_src_img={GreenButtonHoverPng} 
                img_size_classes='w-[263px] h-[44px]' 
                className='font-gridular text-[13px] leading-[16.8px] text-[#9FE7C7] mt-1'
                btn_txt='Reward winners' 
                alt_txt='save project btn' 
                onClick={handleRewardWinners}
                transitionDuration={500}
              />
            </div>
          </div>
        </CustomModal>
      }
    </div>
  )
}

export default ProjectDetailsPage


const numdum = [0, 1, 2, 3, 4, 5]
const dummyData = [
  {
    milestone_id: "67c0eef0456e1e6f9f7bfe32",
    project_id: "67c0eef0456e1e6f9f7bfe2d",
    status: "submitted",
    submissionDescription: "yolo",
    submissionLink: "https://google.com",
    submitted_at: "2025-03-02T12:50:21.196Z",
    user: {
      bio: "Yo I am an awesome dev",
      displayName: "Test user",
      email: "onemlbb69@gmail.com",
      experienceDescription: "Hi, this is a test account",
      isKYCVerified: true,
      job_preferences: [],
      kycStatus: "Verified",
      pfp: "https://firebasestorage.googleapis.com/v0/b/ehop-93b6a.appspot.com/o/images%2Fsamuel.png?alt=media&token=46e89025-bed1-42f2-b6e2-5960c7d6b5e1",
      role: "user",
      skills: [],
      socials: { discord: "testuser1", telegram: "testuser1" },
      teammates: [],
      totalEarned: 0,
      username: "TestUser1",
      walletAddress: "0xa27CEF8aF2B6575903b676e5644657FAe96F491F",
      _id: "67900c707377508655a21458",
    },
    user_id: "67900c707377508655a21458",
    _id: "67c4540dd63b2805de8f2745",
    __v: 0,
  },
  {
    milestone_id: "67c0eef0456e1e6f9f7bfe33",
    project_id: "67c0eef0456e1e6f9f7bfe2e",
    status: "approved",
    submissionDescription: "Implemented feature X",
    submissionLink: "https://github.com/repo",
    submitted_at: "2025-03-01T10:30:00.000Z",
    user: {
      bio: "Building cool stuff",
      displayName: "Jane Doe",
      email: "janedoe@example.com",
      experienceDescription: "Software Engineer with 5 years experience",
      isKYCVerified: false,
      job_preferences: ["Frontend", "Backend"],
      kycStatus: "Pending",
      pfp: "https://example.com/jane-avatar.png",
      role: "developer",
      skills: ["React", "Node.js", "GraphQL"],
      socials: { discord: "janedoe", telegram: "janedoe_tg" },
      teammates: ["John Doe"],
      totalEarned: 5000,
      username: "JaneD",
      walletAddress: "0xb27CEF8aF2B6575903b676e5644657FAe96F491F",
      _id: "67900c707377508655a21459",
    },
    user_id: "67900c707377508655a21459",
    _id: "67c4540dd63b2805de8f2746",
    __v: 0,
  },
  {
    milestone_id: "67c0eef0456e1e6f9f7bfe34",
    project_id: "67c0eef0456e1e6f9f7bfe2f",
    status: "rejected",
    submissionDescription: "Added new API endpoints",
    submissionLink: "https://bitbucket.org/repo",
    submitted_at: "2025-02-28T15:20:30.000Z",
    user: {
      bio: "Full-stack developer",
      displayName: "John Smith",
      email: "johnsmith@example.com",
      experienceDescription: "10 years of experience in web dev",
      isKYCVerified: true,
      job_preferences: ["Full Stack"],
      kycStatus: "Verified",
      pfp: "https://example.com/john-avatar.png",
      role: "lead developer",
      skills: ["Python", "Django", "PostgreSQL"],
      socials: { discord: "johnsmith", telegram: "johnsmith_tg" },
      teammates: [],
      totalEarned: 8000,
      username: "JohnS",
      walletAddress: "0xc27CEF8aF2B6575903b676e5644657FAe96F491F",
      _id: "67900c707377508655a21460",
    },
    user_id: "67900c707377508655a21460",
    _id: "67c4540dd63b2805de8f2747",
    __v: 0,
  },
  {
    milestone_id: "67c0eef0456e1e6f9f7bfe35",
    project_id: "67c0eef0456e1e6f9f7bfe30",
    status: "pending",
    submissionDescription: "Initial project setup",
    submissionLink: "https://gitlab.com/repo",
    submitted_at: "2025-02-27T09:45:10.000Z",
    user: {
      bio: "I love open-source",
      displayName: "Alice Brown",
      email: "alicebrown@example.com",
      experienceDescription: "Open-source contributor & engineer",
      isKYCVerified: false,
      job_preferences: ["Blockchain", "Smart Contracts"],
      kycStatus: "Pending",
      pfp: "https://example.com/alice-avatar.png",
      role: "blockchain dev",
      skills: ["Solidity", "Rust", "Ethereum"],
      socials: { discord: "alicebrown", telegram: "alicebrown_tg" },
      teammates: ["Bob Martin"],
      totalEarned: 3000,
      username: "AliceB",
      walletAddress: "0xd27CEF8aF2B6575903b676e5644657FAe96F491F",
      _id: "67900c707377508655a21461",
    },
    user_id: "67900c707377508655a21461",
    _id: "67c4540dd63b2805de8f2748",
    __v: 0,
  },
];
