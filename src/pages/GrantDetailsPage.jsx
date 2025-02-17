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
import { getAllGrants, getGrantById } from '../service/api'

import zapSVG from '../assets/icons/pixel-icons/zap-yellow.svg'

const GrantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const {data: grantDetails, isLoading: isLoadingGrantDetails} = useQuery({
    queryKey: ['grantDetails', id],
    queryFn: () => getGrantById(id),
    enabled: !!id
  })

  const {data: allGrantDetails, isLoading: isLoadingAllGrantDetails} = useQuery({
    queryKey: ["allGrantDetails"],
    queryFn: () => getAllGrants(),
  })

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
                      <AccordionTrigger className="text-white48 font-inter hover:no-underline">About</AccordionTrigger>
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
                <div className='flex flex-col gap-[6px]'>
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
                    <div className='bg-[#0ED065]/10 rounded-[4px] py-1 px-1 flex items-center gap-1 w-fit'>
                      <img src={zapSVG} alt='zap' className='size-[16px]'/>
                      <p className='text-[#9FE7C7] text-[12px] font-semibold'>Frontend</p>
                    </div>
                    <div className='bg-[#0ED065]/10 rounded-[4px] py-1 px-1 flex items-center gap-1 w-fit'>
                      <img src={zapSVG} alt='zap' className='size-[16px]'/>
                      <p className='text-[#9FE7C7] text-[12px] font-semibold'>Design</p>
                    </div>
                  </div>
                </div>
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
                <div className='flex flex-col gap-[6px]'>
                  <p className='text-white32 text-[14px] font-inter'>Approved so far</p>
                  <div className='flex items-center gap-2'>
                  <img src={grantDetails?.currency == 'STRK' ? STRKimg : USDCimg} alt='curr img' className='size-[24px]'/>
                    <p className='text-white88 font-gridular text-[24px]'>{grantDetails?.prizeApproved}</p>
                    <p className='text-white48 font-gridular text-[24px]'>{grantDetails?.currency}</p>
                  </div>
                </div>
                <a
                  href={grantDetails?.grantLink}
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
                  />
                </a>
              </div>
            </div>

            <div className='border border-dashed h-[1px] border-white12 my-4'/>

            <div className='bg-white4 rounded-[10px] border border-white4 w-[374px]'>
              <div className='flex justify-between items-center gap-2 p-4'>
                <p className='text-white32 text-[14px] font-inter'>Other Grants</p>
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
                          <div className='bg-[#091044] px-2 py-1 rounded-md flex items-center gap-1.5'>
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