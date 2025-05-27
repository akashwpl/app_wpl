import { useDispatch, useSelector } from 'react-redux'
import headerPng from '../assets/images/prdetails_header.png'
import wpl_prdetails from '../assets/images/wpl_prdetails.png'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Trophy } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import btnHoverImg from '../assets/svg/btn_hover_subtract.png'
import btnImg from '../assets/svg/btn_subtract_semi.png'
import USDCimg from '../assets/svg/usdc.svg'
import STRKimg from '../assets/images/strk.png'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import FancyButton from '../components/ui/FancyButton'
import { closeGrantById, createNotification, getAllGrants, getGrantById, grantApproveOrRejectById } from '../service/api'

import zapSVG from '../assets/icons/pixel-icons/zap-yellow.svg'

import closeProjBtnHoverImg from '../assets/svg/close_proj_btn_hover_subtract.png'
import closeProjBtnImg from '../assets/svg/close_proj_btn_subtract.png'
import menuBtnImgHover from '../assets/svg/menu_btn_hover_subtract.png'
import menuBtnImg from '../assets/svg/menu_btn_subtract.png'
import { displaySnackbar } from '../store/thunkMiddleware'
import { useEffect } from 'react'

const GrantDetailsPage = () => {
  const { id } = useParams();
  const { user_id, user_role } = useSelector((state) => state)
  const token = localStorage.getItem('token_app_wpl')
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const {data: grantDetails, isLoading: isLoadingGrantDetails, refetch: refetchGrantDetails} = useQuery({
    queryKey: ['grantDetails', id],
    queryFn: () => getGrantById(id),
    enabled: !!id
  })

  const {data: allGrantDetails, isLoading: isLoadingAllGrantDetails} = useQuery({
    queryKey: ["allGrantDetails"],
    queryFn: () => getAllGrants(),
  })

  useEffect(() => {
    if(!isLoadingGrantDetails) {
      if(grantDetails?.status == 'closed') {
        dispatch(displaySnackbar('Grant has been marked as Closed by Admin'))
        navigate('/grants')
      } else if(grantDetails?.approvalStatus == 'rejected') {
        dispatch(displaySnackbar('Grant has been marked as Rejected by Admin'))
        navigate('/grants')
      }
    }
  },[isLoadingGrantDetails])

  const handleAcceptRejectRequest = async (id, userId, title, status) => {
    // const approvalStatus = status === true ? "approved" : "rejected";
    const dataObj = { isApproved: status }
    const res = await grantApproveOrRejectById(id, dataObj);
    
    if(res._id) {
      const notiObj = {
        msg: `Admin has ${status ? "approved" : "rejected"} your Grant: ${title}.`,
        type: 'grant_req',
        fromId: user_id,
        user_id: userId,
        project_id: id
      }
      const res = await createNotification(notiObj)
      dispatch(displaySnackbar(`You have successfully ${status ? 'Approved' : 'Rejected'} the grant: ${title}.`))
    } 
    refetchGrantDetails();
  }

  const handleGrantEdit = (id) => {
    navigate(`/editGrant/${id}`)
  }

  const handleGrantCLose = async (id,userId,title) => {
    const res = await closeGrantById(id);
    if(res._id) {
      const notiObj = {
        msg: `Admin has Closed your Grant: ${title}.`,
        type: 'grant_req',
        fromId: user_id,
        user_id: userId,
        project_id: id
      }
      const res = await createNotification(notiObj)
      // dispatch(displaySnackbar(`You have successfully  the grant: ${title}.`))
    }
    refetchGrantDetails()
  }

  return (
    <div className='relative pb-10'>
      <div>
        <img src={headerPng} alt='header' className='h-[200px] w-full'/>
      </div>

      <div className='absolute top-1 left-0 w-full py-1'>
        <div onClick={() => {navigate('/grants')}} className='flex items-center gap-1 mx-20 text-white text-[14px] font-inter cursor-pointer hover:text-white88 w-fit'>
          <ArrowLeft size={18}/> Go Back
        </div>
      </div>


        <div className='flex justify-center gap-20 mx-44'>
          <div>
            <div className='md:min-w-[600px]'>
              <div className='translate-y-[-15px]'>
                <img src={grantDetails?.image || wpl_prdetails} alt='wpl_prdetails' className='size-[72px] rounded-md'/>
              </div>

              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <p className='text-[24px] text-primaryYellow font-gridular leading-7'>{grantDetails?.title}</p>
                  <div className='text-[12px] font-medium text-[#FCBF04] flex items-center gap-1 bg-[#FCBF041A] rounded-[4px] px-2 py-1 font-inter'>
                    <img src={zapSVG} alt='zap' className='size-[16px]'/>
                    <p>Grant</p>
                  </div>
                </div>
                <p className='text-[14px] text-white32 leading-5 underline'><a href={grantDetails?.organisation?.websiteLink} target='_blank' rel="noopener noreferrer" >@{grantDetails?.organisation?.organisationHandle}</a></p>
                {/* <div className='flex gap-2 leading-5 font-inter text-[14px] mt-2'>
                  <p className='text-white88'><span className='text-white32'>Submissions</span></p>
                </div> */}
              </div>
               
              <div className='w-[700px]'>
                <div className='mt-5 flex flex-col justify-between'>
                  <p className='font-inter text-white88 leading-[21px] text-wrap'>{grantDetails?.description}</p>
                </div>
                <div className='h-[1px] w-full bg-white7 mt-4 mb-3'/>
                <div>
                  <Accordion type="single" defaultValue="item-1" collapsible>
                    <AccordionItem value="item-1" className="border-white7">
                      <AccordionTrigger className="text-white48 font-inter hover:no-underline">Grant Description</AccordionTrigger>
                      <AccordionContent>
                      <div className='font-inter text-white88 leading-[21px]'>
                        <p className='mt-3 text-wrap'>{grantDetails?.about}</p>
                      </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
              </div>
          </div>
          
          {/* LEFT SIDE */}
          <div className='mt-[35px]'>
            <div className='bg-white4 rounded-[10px] border border-white4 w-[374px]'>
              <div className='flex items-center gap-2 p-4'>
                <Trophy size={14} className='text-white32'/>
                <p className='text-white32 text-[14px] font-inter'>Prizes</p>
              </div>

              <div className='h-[1px] bg-[#FBF1B8]'/>

              <div className='p-4 flex flex-col gap-4'>
                {/* <div className='flex flex-col gap-[6px]'>
                  <p className='text-white32 text-[14px] font-inter'>Skills needed</p>
                  <div className='flex items-center gap-2 flex-wrap'>
                    {grantDetails?.roles?.map((role,idx) => {
                      return(
                        <div className='bg-[#0ED065]/10 rounded-[4px] py-1 px-1 flex items-center gap-1 w-fit'>
                          <img src={zapSVG} alt='zap' className='size-[16px]'/>
                          <p className='text-[#9FE7C7] text-[12px] font-semibold'>{role}</p>
                        </div>
                      )
                    })
                    }
                  </div>
                </div> */}
                <div className='flex flex-col gap-[6px]'>
                  <p className='text-white32 text-[14px] font-inter'>Avg. Response Time</p>
                  <p className='text-white48 font-gridular text-[24px]'>{grantDetails?.avgResponseTime} {grantDetails?.responseTimeUnit[0] || 'h'}</p>
                </div>
                <div className='flex flex-col gap-[6px]'>
                  <p className='text-white32 text-[14px] font-inter'>Avg. Grant Size</p>
                  <div className='flex items-center gap-2'>
                    <img src={grantDetails?.currency == 'STRK' ? STRKimg : USDCimg} alt='curr img' className='size-[24px]'/>
                    <p className='text-white88 font-gridular text-[24px]'>{grantDetails?.avgGrantSize}</p>
                    <p className='text-white48 font-gridular text-[24px]'>{grantDetails?.currency}</p>
                  </div>
                </div>
                <div className='flex flex-col gap-[6px] mb-4'>
                  <p className='text-white32 text-[14px] font-inter'>Approved so far</p>
                  <div className='flex items-center gap-2'>
                  <img src={grantDetails?.currency == 'STRK' ? STRKimg : USDCimg} alt='curr img' className='size-[24px]'/>
                    <p className='text-white88 font-gridular text-[24px]'>{grantDetails?.prizeApproved}</p>
                    <p className='text-white48 font-gridular text-[24px]'>{grantDetails?.currency}</p>
                  </div>
                </div>
                
                {/* btn based on user type */}
                {
                  // for type: user
                  user_role === 'user' ?
                  <a
                    href={grantDetails?.grantLink.slice(0,8) === 'https://' ? grantDetails?.grantLink : "https://"+grantDetails?.grantLink}
                    target='_blank'
                    rel="noopener noreferrer"
                  > 
                    <FancyButton 
                      src_img={btnImg} 
                      hover_src_img={btnHoverImg} 
                      img_size_classes='w-[500px] h-[44px]' 
                      className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                      btn_txt='Apply'  
                      alt_txt='Grant apply btn' 
                      transitionDuration={500}
                    />
                  </a>
                  // for type: admin
                  : user_role === 'admin' ?
                    // project is in pending status and requires admin approval
                    grantDetails?.approvalStatus === 'pending' ?
                    <div className='flex justify-center items-center gap-4'>
                      <FancyButton 
                        src_img={menuBtnImg} 
                        hover_src_img={menuBtnImgHover} 
                        img_size_classes='w-[162px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                        btn_txt='Accept' 
                        alt_txt='admin grant accept btn' 
                        onClick={() => handleAcceptRejectRequest(grantDetails._id,grantDetails.owner_id,grantDetails.title,true)}
                        transitionDuration={500}
                      />
                      <FancyButton 
                        src_img={closeProjBtnImg} 
                        hover_src_img={closeProjBtnHoverImg}
                        img_size_classes='w-[162px] h-[44px]'
                        className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                        btn_txt='Reject'
                        alt_txt='admin grant reject btn'
                        onClick={() => handleAcceptRejectRequest(grantDetails._id,grantDetails.owner_id,grantDetails.title,false)}
                        transitionDuration={500}
                      />
                    </div>
                  :
                    // project is not in pending status
                    <div className='flex justify-center items-center gap-4'>
                      {/* Grant close btn */}
                      <FancyButton 
                        src_img={menuBtnImg} 
                        hover_src_img={menuBtnImgHover} 
                        img_size_classes='w-[162px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                        btn_txt='Close' 
                        alt_txt='admin grant close btn' 
                        onClick={() => handleGrantCLose(grantDetails._id,grantDetails.owner_id,grantDetails.title)}
                        transitionDuration={500}
                      />
                      {/* Grant edit btn */}
                      <FancyButton 
                        src_img={closeProjBtnImg} 
                        hover_src_img={closeProjBtnHoverImg}
                        img_size_classes='w-[162px] h-[44px]'
                        className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                        btn_txt='Edit'
                        alt_txt='admin grant edit btn'
                        onClick={() => handleGrantEdit(grantDetails._id)}
                        transitionDuration={500}
                      />
                    </div>
                  :
                  // Grant waiting for admin approval
                  grantDetails?.approvalStatus === 'pending' ? 
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
                  grantDetails?.approvalStatus === 'rejected' ?
                  <div className='mx-4 mt-4'>
                    <FancyButton 
                      src_img={btnImg} 
                      img_size_classes='w-[342px] h-[44px]' 
                      className={`font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5`}
                      btn_txt={'Grant rejected by Admin'} 
                      alt_txt='admin pending approval btn' 
                      disabled={true}
                    />
                  </div>
                  :
                  <></>
                }
              </div>
            </div>

            <div className='border border-dashed h-[1px] border-white12 my-4'/>

            <div className='bg-white4 rounded-[10px] border border-white4 w-[374px]'>
              <div className='flex justify-between items-center gap-2 p-4'>
                <p className='text-white32 text-[14px] font-inter'>Latest Grants</p>
                <div className='bg-white4 rounded-[6px] px-[6px] h-[26px] flex items-center gap-[6px]'>
                  <p className='text-[12px] text-white88 font-semibold'>{allGrantDetails?.length} <span className='text-white48'>live</span></p>
                </div>
              </div>

              <div className='h-[1px] bg-[#FBF1B8]'/>

              <div className=''>
                {allGrantDetails?.map((grant, idx) => {
                  if(idx < 4) {
                    return(
                      <div onClick={() => navigate(`/grantdetails/${grant?._id}`)} className='flex gap-4 border-b border-dashed border-white32 p-4 cursor-pointer items-center hover:bg-white7'>
                        <img src={grant?.image} alt='grant image' className='size-[45px] rounded-md object-fill' />
                        <div className='flex flex-col gap-1'>
                          <p className='text-white88 font-gridular text-[14px]'>{grant?.title}</p>
                          <div className='bg-[#091044] px-2 py-1 rounded-md flex items-center gap-1.5 w-fit'>
                            <img src={grant?.currency == 'STRK' ? STRKimg : USDCimg} alt='curr img' className='size-[12px]'/>
                            <p className='text-white88 font-inter text-[12px] font-semibold'>{grant?.prizeApproved}</p>
                            <p className='text-white48 font-inter text-[12px] font-semibold'>{grant?.currency}</p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>

            </div>
          </div>
        </div>
    </div>
  )
}

export default GrantDetailsPage