import headerPng from '../assets/images/prdetails_header.png'
import wpl_prdetails from '../assets/images/wpl_prdetails.png'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Clock, Download, TriangleAlert, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
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
import { getOpenProjectSubmissions, getOrgById, getProjectDetails, getProjectSubmissions, getUserDetails, getUserProjects, updateOpenProjectDetails, updateProjectDetails } from '../service/api'

import alertPng from '../assets/images/alert.png'
import clockSVG from '../assets/icons/pixel-icons/watch.svg'
import warningSVG from '../assets/icons/pixel-icons/warning.svg'
import zapSVG from '../assets/icons/pixel-icons/zap-yellow.svg'
import OpenMilestoneSubmissions from '../components/projectdetails/OpenMilestoneSubmissions'

const initialTabs = [
  {id: 'overview', name: 'Overview', isActive: true},
]
const isOwnerTabs = [
  {id: 'overview', name: 'Overview', isActive: true},
  {id: 'submissions', name: 'Submissions', isActive: false},
]

const ProjectDetailsPage = () => {

  const { id } = useParams();
  const navigate = useNavigate()
  const { user_id } = useSelector((state) => state)
  const [orgHandle, setOrgHandle] = useState('');
  const [isProjApplied, setIsProjApplied] = useState(false);
  const [username, setUsername] = useState('A user');
  const [openMilestoneSubmissions, setOpenMilestoneSubmissions] = useState([]);

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
  
  const {data: projectDetails, isLoading: isLoadingProjectDetails, refetch: refetchProjectDetails} = useQuery({
    queryKey: ['projectDetails', id],
    queryFn: () => getProjectDetails(id),
    enabled: !!id
  })

  const {data: projectSubmissions, isLoading: isLoadingProjectSubmissions} = useQuery({
    queryKey: ['projectSubmissions', id],
    queryFn: () => getProjectSubmissions(id),
  })

  useEffect(() => {
    !isLoadingProjectSubmissions && 
    projectSubmissions?.map((project) => {
      if(project?.user?.email == userDetails?.email) {
        setIsProjApplied(true);
        return;
      }
    })
  },[isLoadingProjectSubmissions])

  const {data: openProjectSubmissions, isLoading: isLoadingOpenProjectSubmissions, refetch: refetchOpenProjectSubmissions} = useQuery({
    queryKey: ['openProjectSubmissions', id],
    queryFn: () => getOpenProjectSubmissions(id),
    enabled: !!projectDetails?.isOpenBounty
  })

  useEffect(() => {
    if(projectDetails?.isOpenBounty && !isLoadingOpenProjectSubmissions) {
      const groupedData = openProjectSubmissions?.reduce((acc, curr) => {
        (acc[curr.milestone_id] = acc[curr.milestone_id] || []).push(curr);
        return acc;
      }, {});
      const formattedData = groupedData && Object.entries(groupedData).reduce((acc, [milestone_id, data]) => {
        const milestoneData = projectDetails?.milestones.find(
          (item) => item._id === milestone_id
        );
        if (milestoneData) {
          acc.push({
            title: milestoneData.title,
            status: milestoneData.status,
            submissions: data
          })
        }
        return acc;
      }, []);
      setOpenMilestoneSubmissions(formattedData);
    }
  }, [isLoadingOpenProjectSubmissions]);

  useEffect(() => {
    const fetchOrgHandle = async () => {
      if(!isLoadingProjectDetails && !projectDetails?.organisationHandle) {
        const org = await getOrgById(projectDetails.organisationId);
        setOrgHandle(org[0].organisationHandle);
      }
    }
    fetchOrgHandle();
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
      const res = await updateOpenProjectDetails(projectDetails._id, data)
    } else {
      const res = await updateProjectDetails(projectDetails._id, data);
    }
    refetchProjectDetails()
    setShowCloseProjectModal(false);
  }

  const navigateToSubmissions = (page) => {
    navigate(`/submissions/${projectDetails?._id}/${page}`)
  }

  const navigateToPrevPage = () => {
    navigate(-1);
  }

  const isOwner = useMemo(() => projectDetails?.owner_id == user_id, [projectDetails, user_id])

  useEffect(() => {
    setTabs(isOwner ? isOwnerTabs : initialTabs)
  }, [isOwner])

  const totalPrize = useMemo(() => projectDetails?.milestones?.reduce((acc, milestone) => acc + parseFloat(milestone.prize), 0) || 0, [projectDetails]);
  const totalSubmissions = useMemo(() => projectSubmissions?.length, [projectSubmissions])

  const remain = calculateRemainingDaysAndHours(new Date(), convertTimestampToDate(projectDetails?.deadline))

  const navigateBack = () => {
    if(showCloseProjectModal) {
      setShowCloseProjectModal(false)
    } else {
      navigate(-1)
    }
  }

  const token = localStorage.getItem('token_app_wpl')

  const allMilestonesCompleted = useMemo(() => {
    return projectDetails?.milestones?.every(milestone => milestone.status == 'completed')
  }, [projectDetails])

  console.log('')

  return (
    <div className='relative'>
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
                    <p className='capitalize'>{projectDetails?.isOpenBounty ? 'Open' : 'Gated'}</p>
                  </div>
                </div>
                <p className='text-[14px] text-white32 leading-5 underline'><a href={projectDetails?.organisation?.websiteLink} target='_blank' rel="noopener noreferrer" >@{projectDetails?.organisationHandle || orgHandle}</a></p>
                <div className='flex gap-2 leading-5 font-inter text-[14px] mt-2'>
                  <p className='text-white88'>{projectDetails?.isOpenBounty ? openProjectSubmissions?.length : totalSubmissions} <span className='text-white32'>Submissions</span></p>
                </div>
              </div>

              {isLoadingProjectDetails ? <div>Loading...</div> : <div className='w-full'>
                <div className='mt-4 mb-4 border border-white7 rounded-md'>
                  <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab} submissionsCount={totalSubmissions} />
                </div>
                {selectedTab == 'overview' &&
                  <div className='w-[700px]'>
                    <div className='mt-5 flex flex-col justify-between'>
                      <p className='font-inter text-white88 leading-[21px] text-wrap'>{projectDetails?.description}</p>
                      <div className='text-white48 text-[14px] mt-4'>Role: <span>{projectDetails?.roles?.map((role, index) => <span className='mr-1 capitalize bg-white12 rounded-md px-2 py-1 text-[12px] font-inter'> {role}</span>)}</span></div>
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

                    <div className='pb-32'>
                      <Accordion type={projectDetails?.milestones?.length <= 1 ? "single" : 'multiple'} defaultValue={projectDetails?.milestones?.length <= 1 ? "item-0" : 'item-0'} collapsible>
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
                    <div className='text-[14px] px-4 py-2 text-center text-primaryYellow border-t border-white7 font-gridular'>No submissions yet</div> :
                      <Accordion type="single" defaultValue="item-0" collapsible>
                        {openMilestoneSubmissions?.map((milestone, index) => (
                          <AccordionItem value={`item-${index}`} key={index} className="border-white7">
                            <AccordionTrigger className="text-white48 font-inter hover:no-underline px-4">
                              <p className='text-[13px] font-medium text-white88'>{milestone.title}</p>
                            </AccordionTrigger>
                            <AccordionContent className="py-2 px-4 border-t border-dashed border-white12">
                              {
                                milestone.submissions.length == 0 ? 
                                <div className='text-[14px] text-primaryYellow font-gridular text-center'>No submissions yet</div> : 
                                <>
                                  <div className='grid grid-cols-12 gap-2 mb-2'>
                                    <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                                    <div className='text-[14px] col-span-2 text-white48 font-inter'>Name</div>
                                    <div className='text-[14px] col-span-4 text-white48 font-inter'>Link</div>
                                    <div className='text-[14px] col-span-5 text-white48 font-inter'>Description</div>
                                  </div>
                                  <div className='max-h-[300px] overflow-y-auto'>
                                  {milestone.submissions?.map((submission, index) => (
                                    <OpenMilestoneSubmissions submission={submission} index={index} submission_count={milestone.submissions.length-1} projectStatus={projectDetails?.status} milestoneStatus={milestone?.status} username={userDetails?.displayName} refetchProjectDetails={refetchProjectDetails}/>
                                  ))}
                                  </div>
                                </>
                              }
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
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
                  </div>
                }
              </div>
              }
            </div>
          </div>

          <div className='mt-[35px]'>
            <div className='w-[372px] h-fit pb-4 bg-white4 rounded-[10px]'>
              <div className='flex items-center gap-2 mx-4 py-4'>
                <img src={clockSVG} alt='clock' className='size-[16px]'/>
                <p className='text-[14px] text-white32 leading-[20px] font-inter'>Project Deadline in <span className='text-white88 ml-1'>{remain.days < 0 ? <span className='text-cardRedText'>Overdue</span> : `${remain.days} D ${remain.hours} H`}</span></p>
              </div>
              <div className='h-[1px] w-full'>
                <div className='h-[1px] w-full bg-primaryYellow'/>
                <div className='h-[1px] translate-y-[-1px] w-full bg-white7'/>
              </div>
              <div className='flex flex-col justify-center items-center mt-8'>
                <p className='text-[14px] text-white32 leading-4 font-inter'>Total Prizes</p>
                <p className='text-[24px] text-white88 leading-[28px] font-gridular flex items-center gap-2'>
                  <img src={projectDetails?.currency == 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[24px]'/>
                  {totalPrize} <span className='text-white48'>{projectDetails?.currency || 'USDC'}</span>
                </p>
              </div>

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
                        <MilestoneStatusCard data={milestone} projectDetails={projectDetails} refetchProjectDetails={refetchProjectDetails} username={username} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
                
              {isOwner ?
                projectDetails?.status == 'closed' ? <div className='text-primaryRed flex justify-center items-center gap-1 mt-4'><TriangleAlert size={20}/> Project has been closed</div>
                : allMilestonesCompleted ? <div className='text-primaryYellow flex justify-center items-center gap-1 mt-4 font-gridular'><TriangleAlert size={20}/> Project has been Completed</div>
                :
                <div className='mx-4 mt-4 flex justify-center items-center gap-3'>
                  <FancyButton 
                    src_img={closeProjBtnImg} 
                    hover_src_img={closeProjBtnHoverImg} 
                    img_size_classes='w-[162px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                    btn_txt='Close project' 
                    alt_txt='project close btn' 
                    onClick={() => setShowCloseProjectModal(true)}
                  />
                  <FancyButton 
                    src_img={menuBtnImg} 
                    hover_src_img={menuBtnImgHover} 
                    img_size_classes='w-[162px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                    btn_txt='Edit project' 
                    alt_txt='project edit btn' 
                    onClick={editProject}
                  />
                </div>
              :
                <>
                  {projectDetails?.status == 'closed' ? <div className='text-primaryRed flex justify-center items-center gap-1 mt-4'><TriangleAlert size={20}/> Project has been closed</div> : 
                    allMilestonesCompleted ? <div className='text-primaryYellow flex justify-center items-center gap-1 mt-4 font-gridular'><TriangleAlert size={20}/> Project has been Completed</div>
                    :
                    projectDetails?.status != "idle" || projectDetails?.isOpenBounty ? 
                    <div className='flex justify-center items-center gap-2 bg-cardYellowBg px-4 py-1.5 rounded-md mt-4 mx-4'>
                      <img src={warningSVG} alt='warning' className='size-[20px]'/>
                      <p className='text-cardYellowText font-inter text-[12px] leading-[14.4px] font-medium'>PS: You can submit a milestone only ONCE. No backsies.</p>
                    </div>
                    : 
                    token ? <div className='mx-4 mt-4'>
                      <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={isProjApplied ? btnImg : btnHoverImg} 
                        img_size_classes='w-[342px] h-[44px]' 
                        className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5 ${isProjApplied && 'cursor-not-allowed'}`}
                        btn_txt={isProjApplied ? 'Applied' : 'Apply'} 
                        alt_txt='project apply btn' 
                        onClick={applyForProject}
                        disabled={isProjApplied}
                    />
                    </div>
                    :
                    <div className='mx-4 mt-4'>
                      <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={isProjApplied ? btnImg : btnHoverImg} 
                        img_size_classes='w-[342px] h-[44px]' 
                        className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5 ${isProjApplied && 'cursor-not-allowed'}`}
                        btn_txt={'Login'} 
                        alt_txt='project apply btn' 
                        onClick={() => navigate('/onboarding')}
                        disabled={isProjApplied}
                      />
                    </div>
                  }
                  </>
              }
            </div>
          </div>
        </div>
      </>
      : <div className='flex justify-center items-center mt-10'>
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
                />
              </div>
              
            </div>
        </div>
      }
    </div>
  )
}

export default ProjectDetailsPage