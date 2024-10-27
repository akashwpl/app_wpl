import headerPng from '../assets/images/prdetails_header.png'
import wpl_prdetails from '../assets/images/wpl_prdetails.png'

import { useQuery } from '@tanstack/react-query'
import { Clock, Download, TriangleAlert, Zap } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import USDCsvg from '../assets/svg/usdc.svg'
import MilestoneCard from '../components/projectdetails/MilestoneCard'
import MilestoneStatusCard from '../components/projectdetails/MilestoneStatusCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import { getProjectDetails, getProjectSubmissions, updateProjectDetails } from '../service/api'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import CustomModal from '../components/ui/CustomModal'
import Tabs from '../components/ui/Tabs'


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

  console.log('current user Id', user_id)
  const navigate = useNavigate()
  
  const {data: projectDetails, isLoading: isLoadingProjectDetails} = useQuery({
    queryKey: ['projectDetails', id],
    queryFn: () => getProjectDetails(id),
    enabled: !!id
  })

  const {data: projectSubmissions, isLoading: isLoadinProjectSubmissions} = useQuery({
    queryKey: ['projectSubmissions', id],
    queryFn: () => getProjectSubmissions(id),
  })

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
    setShowCloseProjectModal(false);
  }

  const navigateToSubmissions = (page) => {
    navigate(`/submissions/${projectDetails?._id}/${page}`)
  }

  
  const isOwner = useMemo(() => projectDetails?.owner_id == user_id, [projectDetails, user_id])

  useEffect(() => {
    setTabs(isOwner ? isOwnerTabs : initialTabs)
  }, [isOwner])

  const totalPrize = useMemo(() => projectDetails?.milestones?.reduce((acc, milestone) => acc + parseFloat(milestone.prize), 0) || 0, [projectDetails]);
  const totalSubmissions = useMemo(() => projectSubmissions?.length, [projectSubmissions])

  console.log('projectSubmissions', projectSubmissions)

  return (
    <div className='relative'>
      <div>
        <img src={headerPng} alt='header' className='h-[200px] w-full'/>
      </div>
      <div className='flex justify-center gap-20 mx-44'>
        <div>
         
          <div className='md:min-w-[600px]'>
            <div className='translate-y-[-15px]'>
              <img src={wpl_prdetails} alt='wpl_prdetails' className='size-[72px]'/>
            </div>

            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <p className='text-[24px] text-primaryYellow font-gridular leading-7'>{projectDetails?.title}</p>
                <div className='text-[12px] font-medium text-[#FCBF04] flex items-center gap-1 bg-[#FCBF041A] rounded-[4px] px-2 py-1 font-inter'>
                  <Zap size={14} className='text-[#FCBF04]'/>
                  <p className='capitalize'>{projectDetails?.type}</p>
                </div>
              </div>
              <p className='text-[14px] text-white32 leading-5'>@{projectDetails?.organisationHandle}</p>
              <div className='flex gap-2 leading-5 font-inter text-[14px] mt-2'>
                <p className='text-white88'>DUMMY <span className='text-white32'>Interested</span></p>
                <p className='text-white88'>DUMMY <span className='text-white32'>Submissions</span></p>
              </div>
            </div>

            {isLoadingProjectDetails ? <div>Loading...</div> : <>
              <div className='mt-4 mb-4'>
                <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab} submissionsCount={totalSubmissions} />
              </div>
              {selectedTab == 'overview' &&
                <>
                  <div className='mt-5'>
                    <p className='font-inter text-white88 leading-[21px] text-wrap'>{projectDetails?.description}</p>
                  </div>
                  <div className='h-[1px] w-full bg-white7 mt-10 mb-3'/>
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

                  <div>
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
                </>
              }

              {isOwner && selectedTab == 'submissions' && <div className=''>
                <div className='bg-[#091044] rounded-md px-4 py-2'>
                  <div className='flex justify-between items-center py-2'>
                    <div className='text-[14px] font-gridular text-white88'>Submission ({totalSubmissions})</div>
                    <div className='text-[12px] font-gridular text-white48 flex items-center gap-2'>Download as CSV <Download size={18} color='#FFFFFF7A'/></div>
                  </div>
                  {totalSubmissions == 0 ? <div className='text-[14px] text-primaryYellow font-gridular'>No submissions yet</div> : <>
                    <div className='grid grid-cols-12 gap-2 mb-2'>
                      <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                      <div className='text-[14px] col-span-3 text-white48 font-inter'>Name</div>
                      <div className='text-[14px] col-span-4 text-white48 font-inter'>Why should we hire you</div>
                      <div className='text-[14px] col-span-4 text-white48 font-inter'>Share your work</div>
                    </div>

                    <div className='max-h-[300px] overflow-y-auto'>
                      {projectSubmissions?.map((submission, index) => (
                        <div onClick={() => navigateToSubmissions(index + 1)} key={index} className={`grid grid-cols-12 gap-2 py-2 ${index === projectSubmissions.length - 1 ? "" : "border-b border-white7"}`}>
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
            </>
            }
          </div>
        </div>

        <div className='mt-[35px]'>
          <div className='w-[372px] h-[463px] bg-white4 rounded-[10px]'>
            <div className='flex items-center gap-2 mx-4 py-4'>
              <Clock size={14} className='text-white32'/>
              <p className='text-[14px] text-white32 leading-[20px] font-inter'>Project Deadline in <span className='text-white88 ml-1'>DUMMY TIME</span></p>
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
                      <MilestoneStatusCard data={milestone}/>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
              
            {isOwner ? 
               <div className='mx-4 mt-4 flex justify-center items-center gap-3'>
                <button onClick={() => setShowCloseProjectModal(true)} className='border border-[#E38070] w-full bg-[#E38070]/10 text-[#E38070] py-2 rounded-md font-gridular text-[14px]'>Close Project</button>
                <button onClick={editProject} className='border border-primaryYellow w-full text-primaryYellow py-2 rounded-md font-gridular text-[14px]'>Edit Project</button>
              </div>
            :
              <div className='mx-4 mt-4'>
                <button onClick={applyForProject} className='border border-primaryYellow w-full text-primaryYellow py-2 rounded-md font-gridular'>Apply</button>
              </div>
            }
          </div>
        </div>
      </div>

      <CustomModal isOpen={showCloseProjectModal} closeModal={() => setShowCloseProjectModal(false)}>
        <div className='bg-primaryBlue w-[390px] h-[150px] px-4 flex flex-col justify-center items-center'>
          <div className='flex items-center gap-2'>
              <TriangleAlert size={28} className='text-cardRedText'/>
              <p className='text-white88 font-semibold'>Are you sure you want close the project?</p>
          </div>
          <div className='flex justify-end items-center w-full mt-5 gap-2'>
            <button onClick={() => setShowCloseProjectModal(false)} className='px-4 py-1 rounded-md bg-white12 text-white64'>Cancel</button>
            <button onClick={closeProject} className='px-6 py-1 rounded-md bg-cardRedBg text-cardRedText'>Close</button>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}

export default ProjectDetailsPage