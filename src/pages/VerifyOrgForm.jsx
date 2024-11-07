import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Menu, Plus, Send, Trash, Upload, X } from 'lucide-react';
import USDCsvg from '../assets/svg/usdc.svg'
import DiscordSvg from '../assets/svg/discord.svg'
import TwitterPng from '../assets/images/twitter.png'

const VerifyOrgForm = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [organisationHandle, setOrganisationHandle] = useState('');
    const [description, setDescription] = useState('');
    const [discordLink, setDiscordLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [errors, setErrors] = useState({}); // State for validation errors

    const [submitted, setSubmitted] = useState(false);

    const validateFields = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Name is required';
        if (!organisationHandle) newErrors.organisationHandle = 'Organisation handle is required';
        if (!description) newErrors.description = 'Description is required';
        if (!discordLink) newErrors.discordLink = 'Discord link is required';
        if (!twitterLink) newErrors.twitterLink = 'Twitter link is required';
        if (!telegramLink) newErrors.telegramLink = 'Telegram link is required';
        if (!logo) newErrors.logo = 'Logo is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

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

    const submitForm = () => {
        const isValid = validateFields();
        if (isValid) {
            setSubmitted(true);
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
                {submitted 
                ?   <div className='flex justify-center items-center mt-4'>
                        <div className='max-w-[469px] w-full'>
                            <div className='flex items-center gap-4 border border-dashed border-[#FFFFFF1F] bg-white12 rounded-md px-4 py-3'>
                                <div>
                                    <img src={logoPreview} alt='dummy' className='size-[72px] aspect-square rounded-md'/>
                                </div>
                                <div>
                                    <p className='text-white88 font-gridular text-[20px] leading-[24px]'>{title}</p>
                                    <p className='text-white88 font-semibold text-[13px] font-inter'>@{organisationHandle}</p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center mt-8'>
                                <div><CheckCircle2 fill='#FBF1B8' strokeWidth={1} size={54}/></div>
                                <div className='text-white font-inter'>Submitted your details</div>
                                <p className='text-white32 text-[13px] font-semibold font-inter'>You will be notified once the verification is compeleted</p>
                            </div>

                            <div className='mt-4'>
                                <button onClick={() => {}} className='flex justify-center items-center py-3 px-4 border border-primaryYellow text-primaryYellow w-full font-gridular'>Follow on X</button>
                            </div>
                        </div>
                    </div>
                :   <>
                        <div className='bg-primaryYellow/10 p-2 py-3 rounded-md border border-dashed border-primaryYellow/10'>
                            <p className='text-primaryYellow/70 text-[14px] font-gridular leading-[16.8px]'>We need to manually verify your organisation before you could post your projects.</p>
                        </div>

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
                                                            {errors.logo && <p className='text-red-500 font-medium text-[10px]'>{errors.logo}</p>} {/* Error message for logo */}
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            {logoPreview &&
                                                <div onClick={() => {setLogoPreview(null)}} className='flex items-center gap-1 cursor-pointer'><Trash stroke='#E38070' size={15}/> <span className='text-[#E38070] text-[14px] font-inter'>Delete</span></div>
                                            }
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Company Name<span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={title} 
                                                    onChange={(e) => setTitle(e.target.value)} 
                                                />
                                            </div>
                                            {errors.title && <p className='text-red-500 font-medium text-[10px]'>{errors.title}</p>} {/* Error message */}
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle<span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={organisationHandle} 
                                                    onChange={(e) => setOrganisationHandle(e.target.value)} 
                                                />
                                            </div>
                                            {errors.organisationHandle && <p className='text-red-500 font-medium text-[10px]'>{errors.organisationHandle}</p>} {/* Error message */}
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add description (240 character)<span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <textarea 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    rows={4} 
                                                    value={description} 
                                                    onChange={(e) => setDescription(e.target.value)} 
                                                />
                                            </div>
                                            {errors.description && <p className='text-red-500 font-medium text-[10px]'>{errors.description}</p>} {/* Error message */}
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
                                                    value={discordLink} 
                                                    onChange={(e) => setDiscordLink(e.target.value)} 
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
                                                    value={twitterLink} 
                                                    onChange={(e) => setTwitterLink(e.target.value)} 
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
                                                    value={telegramLink} 
                                                    onChange={(e) => setTelegramLink(e.target.value)} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className='border border-dashed border-white12 my-4'/>

                        <div className='mt-4'>
                            <button className='flex justify-center items-center gap-2 w-full border border-primaryYellow h-[43px]' onClick={submitForm}>
                                <p className='text-primaryYellow font-gridular text-[14px]'>Verify Org </p>
                                <ArrowRight className='text-primaryYellow' size={16}/>
                            </button>
                        </div>
                    </>
                }
            </div>
        </div>
    </div>
  )
}

export default VerifyOrgForm