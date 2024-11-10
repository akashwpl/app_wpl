import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import { ArrowLeft, CheckCheck, CheckCircle2, Globe, Menu, Send, Trash, Upload, X } from 'lucide-react';
import DiscordSvg from '../assets/svg/discord.svg'
import TwitterPng from '../assets/images/twitter.png'
import { useSelector } from 'react-redux';
import { approveOrgByAdmin, createOrganisation, getOrgById } from '../service/api';
import FancyButton from '../components/ui/FancyButton';
import btnImg from '../assets/svg/btn_subtract_semi.png'
import btnHoverImg from '../assets/svg/btn_hover_subtract.png'
import { useQuery } from '@tanstack/react-query';
import greenBtnImg from '../assets/svg/green_btn_subtract.png'
import greenBtnHoverImg from '../assets/svg/green_btn_hover_subtract.png'
import redBtnImg from '../assets/svg/close_proj_btn_subtract.png'
import redBtnHoverImg from '../assets/svg/close_proj_btn_hover_subtract.png'

const RequestsPage = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const { id } = useParams();
    const [orgState, setOrgState] = useState({})

    const {data: orgById, isLoading: isLoadingOrgById} = useQuery({
      queryKey: ['orgById', id],
      queryFn: () => getOrgById(id),
  })

  useEffect(() => {
    if(!isLoadingOrgById) {
      setOrgState(orgById[0])
    }
  },[isLoadingOrgById])

    const { user_id } = useSelector((state) => state)
    const [name, setName] = useState('')
    const [organisationHandle, setOrganisationHandle] = useState('');
    const [description, setDescription] = useState('');
    const [discordLink, setDiscordLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [errors, setErrors] = useState({}); // State for validation errors

    const handleUploadClick = () => {
        fileInputRef.current.click();
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submitted = false

    const handleAcceptRejectRequest = async (status) => {
      const dataObj = { isApproved: status }
      const res = await approveOrgByAdmin(orgState._id, dataObj);
      if(res._id) {
        alert(`You have ${status ? 'Approved' : 'Rejected'} ${orgState?.organisationHandle} organisation successfully.`)
        navigate('/requests')
      } 
    }


  return (
    <div className='pb-40'>
        <div className='flex items-center gap-1 pl-20 border-b border-white12 py-2'>
            <div onClick={() => navigate(-1)} className='flex items-center gap-1 text-white32 hover:text-white48 cursor-pointer'>
                <ArrowLeft size={14}/>
                <p className='font-inter text-[14px]'>Go back</p>
            </div>
        </div>
        <div className='flex justify-center items-center mt-4'>
            <div className='max-w-[469px] w-full'>
                        <Accordion type="single" defaultValue="item-1" collapsible>
                            <AccordionItem value={`item-${1}`} key={1} className="border-none">
                                <AccordionTrigger className="text-white48 font-inter hover:no-underline border-b border-primaryYellow">
                                    <div className='flex items-center gap-1'>
                                        <Menu size={14} className='text-primaryYellow'/>
                                        <div className='text-primaryYellow font-inter text-[14px]'>Basic Details</div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="py-2 border-t border-dashed border-white12">
                                    <div>
                                    <div className='flex justify-between items-center mt-4'>
                                            <div className='flex items-center gap-4'>
                                                {logoPreview ? 
                                                    <div className='relative'>
                                                        <img src={logoPreview} alt='dummy' className='size-[72px] aspect-square rounded-md'/>
                                                        <div onClick={() => {setLogoPreview(null)}} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                                    </div>
                                                :   <>
                                                        <div onClick={handleUploadClick} className='bg-[#FCBF041A] size-[72px] rounded-[8px] border-[1px] border-primaryYellow flex justify-center items-center cursor-pointer'>
                                                            <Upload size={16} className='text-white32'/>
                                                            <input
                                                                name='img'
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handleLogoChange}
                                                                style={{ display: 'none' }}
                                                            />                           
                                                        </div>
                                                        <div className='text-[14px] font-inter'>
                                                            <p className='text-white88'>Add your logo</p>
                                                            <p className='text-white32'>Recommended 1:1 aspect ratio</p>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            {logoPreview &&
                                                <div onClick={() => {setLogoPreview(null)}} className='flex items-center gap-1 cursor-pointer'><Trash stroke='#E38070' size={15}/> <span className='text-[#E38070] text-[14px] font-inter'>Delete</span></div>
                                            }
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Company Name</p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={orgState?.name}
                                                    disabled 
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle</p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={orgState?.organisationHandle}
                                                    disabled 
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add description (240 character)</p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <textarea 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    rows={4} 
                                                    value={orgState?.description} 
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className='border border-dashed border-white12 my-4'/>
                        
                        <Accordion type="single" defaultValue="item-2" collapsible>
                            <AccordionItem value={`item-${2}`} key={2} className="border-none">
                                <AccordionTrigger className="text-white48 font-inter hover:no-underline border-b border-primaryYellow">
                                    <div className='flex items-center gap-1'>
                                        <Globe size={14} className='text-primaryYellow'/>
                                        <div className='text-primaryYellow font-inter text-[14px]'>Social Handles</div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="py-2">
                                    <div>
                                        <div>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Discord Link</p>
                                            <div className='bg-white7 rounded-md px-3 py-2 flex items-center gap-2'>
                                                <img src={DiscordSvg} alt='discord' className='size-[20px]'/>
                                                <input 
                                                    type='text' 
                                                    placeholder='discord.gg' 
                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full' 
                                                    value={orgState?.socialHandleLink?.discord || '--'}
                                                    disabled 
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>X/Twitter Link</p>
                                            <div className='bg-white7 rounded-md px-3 py-2 flex items-center gap-2'>
                                                <img src={TwitterPng} alt='twitter' className='size-[20px]'/>
                                                <input 
                                                    type='text' 
                                                    placeholder='@john' 
                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full' 
                                                    value={orgState?.socialHandleLink?.twitter || '--'} 
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Telegram Link</p>
                                            <div className='bg-white7 rounded-md px-3 py-2 flex items-center gap-2'>
                                                <Send size={20} className='text-white32'/>
                                                <input 
                                                    type='text' 
                                                    placeholder='john' 
                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full' 
                                                    value={orgState?.socialHandleLink?.telegram || '--'}
                                                    disabled 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className='border border-dashed border-white12 my-4 mt-4'/>
                        <div className='flex items-center justify-around gap-4'>
                            <FancyButton 
                              src_img={redBtnImg} 
                              hover_src_img={redBtnHoverImg} 
                              img_size_classes='w-[160px] h-[44px]' 
                              className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                              btn_txt={<span className='flex items-center justify-center gap-2'><X size={14}/><span>Reject</span></span>} 
                              alt_txt='submission reject btn' 
                              onClick={() => handleAcceptRejectRequest(false)}
                            />
                            <FancyButton 
                              src_img={greenBtnImg} 
                              hover_src_img={greenBtnHoverImg} 
                              img_size_classes='w-[160px] h-[44px]' 
                              className='font-gridular text-[14px] leading-[16.8px] text-primaryGreen mt-0.5'
                              btn_txt={<span className='flex items-center justify-center gap-2'><CheckCheck size={14}/><span>Accept</span></span>}  
                              alt_txt='submission accept btn' 
                              onClick={() => handleAcceptRejectRequest(true)}
                            />
                          </div> 
            </div>
        </div>
    </div>
  )
}

export default RequestsPage