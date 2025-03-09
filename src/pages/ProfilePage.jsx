import { useMemo, useState } from 'react'
import headerPng from '../assets/images/prdetails_header.png'
import wpllogo from '../assets/images/wpl_prdetails.png'

import { ArrowUpRight, Edit2, TriangleAlert, X } from 'lucide-react'
import PoWCard from '../components/profile/PoWCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import dummyPng from '../assets/dummy/Container.png'
import CustomModal from '../components/ui/CustomModal'
import { deleteProject, getAllUers, getUserDetails } from '../service/api'

import discordSVG from '../assets/icons/pixel-icons/discord.svg'
import twitterSVG from '../assets/icons/pixel-icons/twitter.svg'
import mailSVG from '../assets/icons/pixel-icons/mail.svg'
import shareProfilePNG from '../assets/images/share_pfp.png'
import { displaySnackbar } from '../store/thunkMiddleware'

const ProfilePage = () => {

  const { id } = useParams();
  const { user_id } = useSelector((state) => state)
  const dispatch = useDispatch()

  const {data: allUsers, isLoading: isLoadingUses, refetch} = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUers(),
  })

  const [selectedProjectToDelete, setSelectedProjectToDelete] = useState(null)
  const [showProjectDeleteModal, setShowProjectDeleteModal] = useState(false)

  const handleShowDeleteProjectModal = (id) => {
    setShowProjectDeleteModal(true)
    setSelectedProjectToDelete(id)
  }

  const cancelDeleteProject = () => {
    setShowProjectDeleteModal(false)
    setSelectedProjectToDelete(null)
  }

  const handleDeleteProject = async () => {
    await deleteProject(selectedProjectToDelete)
    setShowProjectDeleteModal(false)
    refetch()
  }

  const userDetails = useMemo(() => {
    if (allUsers) {
      if(id?.includes('discord')) {
        return allUsers.find((user) => user.socials?.discord == id)
      } else {
        return allUsers.find((user) => user._id == id)
      }
    }
  }, [allUsers, id, user_id])

  const sampleProjects = useMemo(() =>  userDetails?.projects?.owned?.filter((proj) => proj.type == 'sample'), [userDetails, allUsers])

  const handleShareProfile = () => {
    dispatch(displaySnackbar('COMING SOON!!!!'))
  }

  const handleKyc = () => {
    if(userDetails?.isKYCVerified) return
    window.open('https://payout.copperx.io/auth/login', '_blank')
  }

  return (
    <div className='overflow-x-hidden'>
      <div>
        <img src={headerPng} alt='header' className='h-[200px] w-full'/>
      </div>

      <div className='flex flex-col justify-center items-center pb-20'>
        <div className='w-[350px] md:w-[480px]'>
          <div className='-translate-y-8 flex justify-between items-center'>
            <img src={userDetails?.pfp || wpllogo} alt="WPL Logo" className='size-[72px] rounded-md'/>
            <div className='w-[187px] h-[43px] cursor-pointer' onClick={handleShareProfile}>
              <img src={shareProfilePNG} alt='share profile' />
            </div>
          </div>

          <div>
            <div className='flex justify-between'>
              <div>
                <div className='flex items-center gap-2'>
                  <p className='text-[24px] leading-[28px] text-primaryYellow font-gridular'>{userDetails?.displayName}</p>
                  <div onClick={() => handleKyc()} className={`${userDetails?.isKYCVerified ? "bg-[#0ED0651A] hover:bg-[#0ED0651A]/90" : "bg-errorMsgRedText/10 hover:bg-errorMsgRedText/15"}  rounded-md px-2 py-1 cursor-pointer`}>
                    <p className={`text-[12px] ${userDetails?.isKYCVerified ? "text-[#9FE7C7]" : "text-cardRedText/80"}  font-semibold font-inter`}>
                      {userDetails?.isKYCVerified ? 'KYC Verified' : 'KYC Not Verified'}
                    </p>
                  </div>
                  <div onClick={() => handleCopperxPAT()} className={`${userDetails?.copperxPatHidden ? "bg-[#0ED0651A] hover:bg-[#0ED0651A]/90" : "bg-errorMsgRedText/10 hover:bg-errorMsgRedText/15"}  rounded-md px-2 py-1 cursor-pointer`}>
                    <Link to={'/editprofile'}><p className={`text-[12px] ${userDetails?.copperxPatHidden ? "text-[#9FE7C7]" : "text-cardRedText/80"}  font-semibold font-inter`}>
                      {userDetails?.copperxPatHidden ? 'Token' : 'No token'}
                    </p>
                    </Link>
                  </div>
                </div>
                <p className='text-[14px] text-white32 font-inter'>{userDetails?.username ? userDetails?.username : ""}</p>
              </div>
              <div className='bg-white7 rounded-[6px] flex gap-1 items-center h-[32px] px-2 py-1'>
                <Link to={'/editprofile'}><p className='text-[12px] text-white48 font-medium font-inter'>Edit Profile <Edit2 size={14} className='inline-block text-white32'/></p></Link>
              </div>
            </div>

            <div className='text-white88 font-inter mt-3'>
              <p>{userDetails?.bio}</p>
            </div>

            <div className='text-[14px] text-white88 font-inter flex items-center gap-2 mt-3'>
              <p>{userDetails?.projectsCompleted} <span className='text-white32'>Projects Completed</span></p>
              <p>${userDetails?.totalEarned} <span className='text-white32'>Earned</span></p>
            </div>
          </div>

          <div className='border-t border-white7 mt-6'>
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-white7">
                <AccordionTrigger className="text-white48 font-inter hover:no-underline">Proof of Work</AccordionTrigger>
                <AccordionContent>
                  {userDetails && sampleProjects?.length == 0 ? <div className='text-center pt-4'>
                        <p className='text-[#FAF1B1E0] font-gridular'>Nothing to see here</p>
                        <p className='text-[12px] text-white32 font-medium'>Add Work samples to showcase.</p>
                    </div>
                  : userDetails && sampleProjects?.map((project, index) => (
                    <div className='relative'>
                      <div onClick={() => handleShowDeleteProjectModal(project?._id)} className='absolute top-0 right-0 bg-white7 rounded-full p-[1px] cursor-pointer hover:bg-white12'><X size={12} color='#F03D3D'/></div>
                      <PoWCard key={index} data={project}/>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-white7">
              <AccordionTrigger className="text-white48 font-inter hover:no-underline">Active Projects</AccordionTrigger>
                <AccordionContent>
                  {userDetails && userDetails.projects?.taken?.length == 0 ? 
                    <div className='text-center pt-4'>
                        <p className='text-[#FAF1B1E0] font-gridular'>Nothing to see here</p>
                        <p className='text-[12px] text-white32 font-medium'>Start contributing to more projects and earn rewards.</p>
                    </div>
                  :
                    userDetails && userDetails.projects?.taken?.map((project, index) => (
                      <PoWCard key={index} data={project}/>
                    ))
                  }
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-white7">
                <AccordionTrigger className="text-white48 font-inter hover:no-underline">Contact</AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-col gap-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-1'>
                        <img src={discordSVG} alt='discord' className='size-[18px]'/>
                        <p className='text-[14px] text-white32'>Discord</p>
                      </div>
                      <div className='flex items-center gap-1 group'>
                        <a href={`https://discordapp.com/users/${userDetails?.socials?.discord}`} target='_blank' className='text-[14px] text-white88 group-hover:text-[#FFFFFFE0]/90'>{userDetails?.socials?.discord}</a>
                        <ArrowUpRight size={16} className='text-white32 group-hover:text-white48'/>
                      </div>
                    </div>

                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-1'>
                        <img src={twitterSVG} alt='twitter' className='size-[16px]'/>
                        <p className='text-[14px] text-white32'>Telegram</p>
                      </div>
                      <a href={`https://t.me/${userDetails?.socials?.telegram}`} target='_blank' className='flex items-center gap-1 group text-white88'>
                        <p className='text-[14px] flex items-center gap-1 group-hover:text-[#FFFFFFE0]/90'>
                        {userDetails?.socials?.telegram} <ArrowUpRight size={16} className='text-white32 group-hover:text-white48'/>
                        </p>
                      </a>
                    </div>

                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-1'>
                        <img src={mailSVG} alt='mail' className='size-[18px]'/>
                        <p className='text-[14px] text-white32'>Email</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <p className='text-[14px] text-white88'>{userDetails?.email}</p>
                      </div>
                    </div>

                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <CustomModal isOpen={showProjectDeleteModal} closeModal={() => setShowProjectDeleteModal(false)}>
          <div className='bg-primaryBlue w-[390px] h-[150px] px-4 flex flex-col justify-center items-center'>
            <div className='flex items-center gap-2'>
                <TriangleAlert size={28} className='text-cardRedText'/>
                <p className='text-white88 font-semibold'>Are you sure you want delete the project?</p>
            </div>
            <div className='flex justify-end items-center w-full mt-5 gap-2'>
              <button onClick={cancelDeleteProject} className='px-4 py-1 rounded-md bg-white12 text-white64'>Cancel</button>
              <button onClick={handleDeleteProject} className='px-4 py-1 rounded-md bg-cardRedBg text-cardRedText'>Delete</button>
            </div>
          </div>
      </CustomModal>
    </div>
  )
}

export default ProfilePage


const projectdummy = [
  {img: dummyPng, 
    title: 'UX Design for WPL', 
    projectdetails: {
      team: ['Akshit Verma', 'John Doe', 'Jane Doe'],
      endsOn: 'Ends on June 26',
    }
  },
]

const powdummy = [
  {img: dummyPng, 
    title: 'UX Design for WPL', 
    desc: 'Some one linear for my Project, coz it\'s asethetic', 
    skills: ['Frontend', 'Javascript', 'Figma'],
  },
  {img: dummyPng, 
    title: 'Frontend for WPL', 
    desc: 'Some one linear for my Project, coz it\'s asethetic', 
    skills: ['Frontend', 'Javascript', 'Figma', 'React'],
  },
]