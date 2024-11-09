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
import USDCsvg from '../assets/svg/usdc.svg'
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
import { getOrgById, getProjectDetails, getProjectSubmissions, getUserProjects, updateProjectDetails } from '../service/api'

import alertPng from '../assets/images/alert.png'

const initialTabs = [
  {id: 'overview', name: 'Overview', isActive: true},
]
const isOwnerTabs = [
  {id: 'overview', name: 'Overview', isActive: true},
  {id: 'submissions', name: 'Submissions', isActive: false},
]

const ProjectDetailsPage = () => {

  const { id } = useParams();
  const { user_id } = useSelector((state) => state)
  const [orgHandle, setOrgHandle] = useState('');
  const [isProjApplied, setIsProjApplied] = useState(false);

  const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
    queryKey: ["userProjects"],
    queryFn: getUserProjects
  })

  useEffect(() => {
    !isLoadingUserProjects && 
    userProjects.map((project) => {
      if(project._id == id) {
        setIsProjApplied(true);
        return;
      }
    })
  },[])
  

  console.log('user projects', userProjects)
  const navigate = useNavigate()
  
  const {data: projectDetails, isLoading: isLoadingProjectDetails, refetch: refetchProjectDetails} = useQuery({
    queryKey: ['projectDetails', id],
    queryFn: () => getProjectDetails(id),
    enabled: !!id
  })

  const {data: projectSubmissions, isLoading: isLoadinProjectSubmissions} = useQuery({
    queryKey: ['projectSubmissions', id],
    queryFn: () => getProjectSubmissions(id),
  })

  useEffect(() => {
    const fetchOrgHandle = async () => {
      if(!isLoadingProjectDetails && !projectDetails.organisationHandle) {
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
    const { _id, __v, comments, milestones, totalPrize, created_at, updated_at, ...data } = projectDetails;
    data.status = 'closed';

    const res = await updateProjectDetails(projectDetails._id, data);
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

  const tmpMilestones = projectDetails?.milestones;
  const lastMilestone = tmpMilestones?.reduce((acc, curr) => {
    
    return new Date(curr).getTime() > new Date(acc).getTime() ? curr : acc;
  });

  const remain = calculateRemainingDaysAndHours(new Date(), convertTimestampToDate(lastMilestone?.deadline))

  const navigateBack = () => {
    if(showCloseProjectModal) {
      setShowCloseProjectModal(false)
    } else {
      navigate(-1)
    }
  }



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
                    <Zap size={14} className='text-[#FCBF04]'/>
                    <p className='capitalize'>{projectDetails?.type}</p>
                  </div>
                </div>
                <p className='text-[14px] text-white32 leading-5'>@{projectDetails?.organisationHandle || orgHandle}</p>
                <div className='flex gap-2 leading-5 font-inter text-[14px] mt-2'>
                  {/* <p className='text-white88'>DUMMY <span className='text-white32'>Interested</span></p> */}
                  <p className='text-white88'>{totalSubmissions} <span className='text-white32'>Submissions</span></p>
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
                      <div className='text-white48 text-[14px] mt-4'>Role: <span>{projectDetails?.role}</span></div>
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
                      <Accordion type={projectDetails?.milestones?.length <= 1 ? "single" : 'multiple'} defaultValue="item-1" collapsible>
                        {projectDetails?.milestones?.map((milestone, index) => (
                          <AccordionItem value={`item-${index + 1}`} key={index} className="border-white7">
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
                      <div className='text-[14px] font-gridular text-white88'>Submission ({totalSubmissions})</div>
                      <div className='text-[12px] font-gridular text-white48 flex items-center gap-2'>Download as CSV <Download size={18} color='#FFFFFF7A'/></div>
                    </div>
                    {totalSubmissions == 0 ? <div className='text-[14px] text-primaryYellow font-gridular'>No submissions yet</div> : <>
                      <div className='grid grid-cols-12 gap-2 mb-2 px-4'>
                        <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                        <div className='text-[14px] col-span-3 text-white48 font-inter'>Name</div>
                        <div className='text-[14px] col-span-4 text-white48 font-inter'>Why should we hire you</div>
                        <div className='text-[14px] col-span-4 text-white48 font-inter'>Share your work</div>
                      </div>

                      <div className='max-h-[300px] overflow-y-auto'>
                        {projectSubmissions?.map((submission, index) => (
                          <div onClick={() => navigateToSubmissions(index + 1)} key={index} className={`grid grid-cols-12 gap-2 py-2 px-4 rounded-sm hover:bg-white4 cursor-pointer ${index === projectSubmissions.length - 1 ? "" : "border-b border-white7"}`}>
                            <div className='text-[14px] col-span-1 text-white88 font-inter'>{index + 1}</div>
                            <div className='text-[14px] col-span-3 text-start text-white88 font-inter'>{submission?.user?.displayName}</div>
                            <div className='text-[14px] col-span-4 text-white88 font-inter truncate'>{submission?._doc?.experienceDescription}</div>
                            <div className='text-[14px] col-span-4 text-white88 font-inter'>{submission?._doc?.portfolioLink}</div>
                          </div>
                        ))}
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
                <Clock size={14} className='text-white32'/>
                <p className='text-[14px] text-white32 leading-[20px] font-inter'>Project Deadline in <span className='text-white88 ml-1'>{remain.days < 0 ? <span className='text-cardRedText'>Overdue</span> : `${remain.days} D ${remain.hours} H`}</span></p>
              </div>
              <div className='h-[1px] w-full'>
                <div className='h-[1px] w-[40%] bg-primaryYellow'/>
                <div className='h-[1px] translate-y-[-1px] w-full bg-white7'/>
              </div>
              <div className='flex flex-col justify-center items-center mt-8'>
                <p className='text-[14px] text-white32 leading-4 font-inter'>Total Prizes</p>
                <p className='text-[24px] text-white88 leading-[28px] font-gridular flex items-center gap-2'>
                  <img src={USDCsvg} alt='usdc' className='size-[24px]'/>
                  {totalPrize} <span className='text-white48'>USDC</span>
                </p>
              </div>

              <div className='bg-white7 border border-white4 rounded-[8px] px-3 mx-4 mt-4'>
                <Accordion type="single" defaultValue="item-0" collapsible>
                  {projectDetails?.milestones?.map((milestone, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-white7">
                      <AccordionTrigger className="text-white48 font-inter hover:no-underline">
                        <div className='flex justify-between items-center w-full text-[13px] font-medium text-white88'>
                          <p>Milestone {index + 1}</p>
                          <p className='flex items-center gap-1'><img src={USDCsvg} alt='usdc' className='size-[14px]'/>{milestone?.prize} <span className='text-white48'>{milestone?.currency}</span></p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="py-2 border-t border-dashed border-white12">
                        <MilestoneStatusCard data={milestone} projectDetails={projectDetails}/>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
                
              {isOwner ?
                projectDetails?.status == 'closed' ? <div className='text-primaryRed flex justify-center items-center gap-1 mt-4'><TriangleAlert size={20}/> Project has been closed</div> :
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
                
                    <div className='mx-4 mt-4'>
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
                  <p className='text-white32 font-inter text-[14px]'>@{projectDetails?.organisationHandle || orgHandle}</p>
                </div>
              </div>

              <div className='mt-10'>
                <img src={alertPng} alt='close project' className='' />
              </div>

              <div className='flex flex-col justify-center items-center mt-4'>
                <h2 className='font-inter text-white'>You're closing this project</h2>
                <p className='text-white32 text-[13px] font-semibold font-inter'>Make sure that you’ve communicated this to all the involved parties.</p>
              </div>

              <div className='flex justify-center items-center w-full mt-5 gap-2'>
                <FancyButton 
                  src_img={closeProjBtnImg} 
                  hover_src_img={closeProjBtnHoverImg}
                  img_size_classes='w-[480px] h-[44px]' 
                  className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5 lowercase capitalize'
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