import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { ArrowLeft, Globe, Menu, Send, Trash, Upload, X } from 'lucide-react';
import DiscordSvg from '../assets/svg/discord.svg'
import TwitterPng from '../assets/images/twitter.png'
import { useSelector } from 'react-redux';
import { createNotification, createOrganisation, getAdmins } from '../service/api';
import FancyButton from '../components/ui/FancyButton';
import btnImg from '../assets/svg/btn_subtract_semi.png'
import btnHoverImg from '../assets/svg/btn_hover_subtract.png'

import tickFilledImg from '../assets/icons/pixel-icons/tick-filled.png'
import Spinner from '../components/ui/spinner';

const VerifyOrgForm = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

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

    const [submitted, setSubmitted] = useState(false);
    const [imgUploadHover, setImgUploadHover] = useState(false)

    const [isloading, setIsLoading] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
        }); 
    }

    const validateFields = async () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!organisationHandle) newErrors.organisationHandle = 'Organisation handle is required';
        if (!description) newErrors.description = 'Description is required';
        if (!discordLink && !twitterLink && !telegramLink) newErrors.socialHandleLink = 'Please provide at least one social media handle link';
        if (!logo) newErrors.logo = 'Logo is required';
        setErrors(newErrors);
        scrollToTop();
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

    const submitForm = async () => {
        setIsLoading(true);
        const isValid = validateFields();

        const imageRef = ref(storage, `images/${logo.name}`);
        await uploadBytes(imageRef, logo);
        const imageUrl = await getDownloadURL(imageRef);

        if (isValid) {
            const data = {
                userId: user_id,
                name: name,
                description: description,
                organisationHandle: organisationHandle,
                socialHandleLink: {
                    twitter: twitterLink,
                    telegram: telegramLink,
                    discord: discordLink
                },
                status: 'pending',
                img: imageUrl
            }
            const res = await createOrganisation(data);
            
            if(res.err == 'Organisation already exists') {
                const errorObj = {organisationHandle: 'Oops! The Handle is already taken. Please try a different one.'};
                setErrors(errorObj);
                scrollToTop();
                return;
            }

            // notification to be created for Admin as someone raised a req to become an org
            const notification = {
                msg: `Company ${name} has requested to become a sponsor.`,
                type: 'org_request',
                fromId: `${user_id}`,
                project_id: res._id
            }

            const adminList = await getAdmins();
            adminList.data.map(async(admin) => {
                const notiRes = await createNotification({...notification, user_id: admin._id});
            });

            setSubmitted(true);
        }
        setIsLoading(false);
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
                                    <p className='text-white88 font-gridular text-[20px] leading-[24px]'>{name}</p>
                                    <p className='text-white88 font-semibold text-[13px] font-inter'>@{organisationHandle}</p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center items-center mt-8'>
                                <img src={tickFilledImg} alt='tick-filled' className='size-[54px] mb-4'/>
                                <div className='text-white font-inter'>Submitted your details</div>
                                <p className='text-white32 text-[13px] font-semibold font-inter'>You will be notified once the verification is compeleted</p>
                            </div>

                            <div className='mt-4'>
                                <FancyButton 
                                    src_img={btnImg} 
                                    hover_src_img={btnHoverImg} 
                                    img_size_classes='w-[490px] h-[44px]' 
                                    className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                                    btn_txt='Welcome Aboard' 
                                    alt_txt='redirect to all projects' 
                                    onClick={() => {navigate('/allprojects')}}
                                />
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
                                                        <div onClick={() => {setLogoPreview(null);setLogo(null)}} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                                    </div>
                                                :   <>
                                                        <div 
                                                            onMouseEnter={() => setImgUploadHover(true)} 
                                                            onMouseLeave={() => setImgUploadHover(false)} 
                                                            onClick={handleUploadClick} 
                                                            className={`relative bg-[#FCBF041A] size-[72px] rounded-[8px] border-[1px] ${errors.logo ? "border-cardRedText" : "border-primaryYellow"} flex justify-center items-center cursor-pointer`}
                                                        >
                                                            <Upload size={16} className={`text-white32 absolute ${imgUploadHover ? "animate-hovered" : ""}`}/>
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
                                                <div onClick={() => {setLogoPreview(null);setLogo(null)}} className='flex items-center gap-1 cursor-pointer'><Trash stroke='#E38070' size={15}/> <span className='text-[#E38070] text-[14px] font-inter'>Delete</span></div>
                                            }
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Company Name <span className='text-[#F03D3D]'>*</span></p>
                                            <div className={`bg-white7 rounded-md px-3 py-2 ${errors.name && "border border-cardRedText"}`}>
                                                <input 
                                                    type='text' 
                                                    className={`bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full`}
                                                    value={name} 
                                                    onChange={(e) => setName(e.target.value)} 
                                                />
                                            </div>
                                            {errors.name && <p className='text-red-500 font-medium text-[10px]'>{errors.name}</p>} {/* Error message */}
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle <span className='text-[#F03D3D]'>*</span></p>
                                            <div className={`bg-white7 rounded-md px-3 py-2 ${errors.organisationHandle && "border border-cardRedText"}`}>
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
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add description <span className='text-[#F03D3D]'>*</span></p>
                                            <div className={`bg-white7 rounded-md px-3 py-2 ${errors.description && "border border-cardRedText"}`}>
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
                                        <div className='text-primaryYellow font-inter text-[14px]'>Social Handles <span className='text-[#F03D3D]'>*</span></div>
                                    </div>
                                </AccordionTrigger>
                                {errors.socialHandleLink && <p className='text-red-500 font-medium text-[10px] mt-1'>{errors.socialHandleLink}</p>} {/* Error message */}
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

                        <div className='border border-dashed border-white12 my-4 mt-4'/>
                        <div className='mt-4'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[470px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                                btn_txt={isloading ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> : 'Verify Organisation'}
                                alt_txt='verify org btn' 
                                onClick={submitForm}
                                isArrow='true'
                            />
                        </div> 
                    </>
                }
            </div>
        </div>
    </div>
  )
}

export default VerifyOrgForm