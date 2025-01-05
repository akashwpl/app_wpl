import { ArrowLeft, CheckCheck, Menu, Plus, Trash, Trophy, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import btnHoverImg from '../assets/svg/btn_hover_subtract.png';
import btnImg from '../assets/svg/btn_subtract_semi.png';
import DiscordSvg from '../assets/svg/discord.svg';
import saveBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png';
import saveBtnImg from '../assets/svg/menu_btn_subtract.png';
import USDCimg from '../assets/svg/usdc.svg';
import STRKimg from '../assets/images/strk.png';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";
import FancyButton from '../components/ui/FancyButton';
import { BASE_URL, getTimestampFromNow } from '../lib/constants';
import { storage } from '../lib/firebase';
import { createOpenProject, getUserOrgs } from '../service/api';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Spinner from '../components/ui/spinner';

import tickFilledImg from '../assets/icons/pixel-icons/tick-filled.png';
import { displaySnackbar } from '../store/thunkMiddleware';

const AddProjectPage = () => {

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user_id = useSelector((state) => state.user_id)

    const [title, setTitle] = useState('')
    const [organisationHandle, setOrganisationHandle] = useState('');
    const [organisationId, setOrganisationId] = useState('');
    const [description, setDescription] = useState('');
    const [aboutProject, setAboutProject] = useState('');
    const [discordLink, setDiscordLink] = useState('');
    const [logo, setLogo] = useState(null);
    const [role, setRole] = useState([]);
    const [logoPreview, setLogoPreview] = useState('');
    const [foundation, setFoundation] = useState('673067f8797130f180c2846e');
    const [projCurrency, setProjCurrency] = useState('USDC');
    const [isOpenBounty, setIsOpenBounty] = useState(false);
    const [errors, setErrors] = useState({}); // State for validation errors

    const [totalPrize, setTotalPrize] = useState(0);

    const [milestones, setMilestones] = useState([]);

    const [submitted, setSubmitted] = useState(false);
    const [createdProjectId, setCreatedProjectId] = useState(null);

    const [searchInput, setSearchInput] = useState()

    const [isCreatingProject, setIsCreatingProject] = useState(false);

    const [imgUploadHover, setImgUploadHover] = useState(false)

    const {data: userOrganisations, isLoading: isLoadingUserOrgs} = useQuery({
        queryKey: ['userOrganisations', user_id],
        queryFn: () => getUserOrgs(user_id),
    })

    useEffect(() => {
        if(userOrganisations?.length == 0) {
            if(userOrganisations[0]?.status == 'pending') {
                dispatch(displaySnackbar('Your Organisation is not yet approved by Admin. Please try again later.'))
                navigate('/sponsordashboard')
            }
            setOrganisationHandle(userOrganisations[0]?.organisationHandle)
            setOrganisationId(userOrganisations[0]?._id)
        }
    },[isLoadingUserOrgs, userOrganisations])

    const validateMilestones = () => {
        let isErr = false;
        if(milestones?.length > 0) {
            milestones.map((milestone,index) => {
                const newErrors = {};
                if (!milestone.title) newErrors.title = 'Title is required';
                if (!milestone.description) newErrors.description = 'Description is required';
                if (!milestone.starts_in) newErrors.starts_in = 'Start date is required';
                if (!milestone.prize) newErrors.prize = 'Prize is required';
                if (!milestone.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
                if (Object.keys(newErrors).length !== 0) {
                    const updatedMilestones = [...milestones];
                    updatedMilestones[index] = { ...updatedMilestones[index], err: newErrors };
                    console.log(`Milestone ${index}`, updatedMilestones);
                    setMilestones(updatedMilestones);
                    isErr = true;
                }
            })
        }
        return isErr;
    }

    const validateFields = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!organisationHandle) newErrors.organisationHandle = 'Organisation handle is required';
        if (!description) newErrors.description = 'Description is required';
        if (!discordLink) newErrors.discordLink = 'Discord link is required';
        if (!logo) newErrors.logo = 'Logo is required';
        if (!role) newErrors.role = 'Role is required';
        if (!projCurrency) newErrors.projCurrency = 'Prize currency is required';
        if (milestones.length === 0) newErrors.milestones = 'At least one milestone is required';
        if (!aboutProject) newErrors.aboutProject = 'About project is required';
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

    const handleMilestoneChange = (index, field, value) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
        setMilestones(updatedMilestones);
    };

    const handleAddMilestone = () => {
        setMilestones([...milestones, { title: '', description: '', prize: '', currency: projCurrency, deliveryTime: '', timeUnit: 'Weeks' }]);
    };

    const handleSubmit = async () => {
        
        const updatedMilestones = milestones.map(milestone => ({
            ...milestone,
            deadline: getTimestampFromNow(milestone.deliveryTime, milestone.timeUnit?.toLowerCase(), milestone.starts_in) // Add timestamp to each milestone
        }));
    
        if (validateFields()) {

            setIsCreatingProject(true);

            const imageRef = ref(storage, `images/${logo.name}`);
            await uploadBytes(imageRef, logo);
            const imageUrl = await getDownloadURL(imageRef);

            const data = {
                "project": {
                    "title": title,
                    "organisationHandle": organisationHandle,
                    "organisationId": foundation,
                    "description": description,
                    "discordLink": discordLink,
                    "status": "idle",
                    "about": aboutProject,
                    "roles": role,
                    "image" : imageUrl,
                    "isOpenBounty": isOpenBounty,
                    "foundation": foundation == "673067f8797130f180c2846e" ? 'starkware' : "starkwarefoundation",
                    "currency": projCurrency    // project currency strk or usdc
                },
                "milestones": updatedMilestones
            }

            // create open project
            if(isOpenBounty) {
                const resp = await createOpenProject(data);
                setCreatedProjectId(resp?.data?.project?._id);
                setIsCreatingProject(false);
                setSubmitted(true);
                return; 
            }
            
            const response = await fetch(`${BASE_URL}/projects/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token_app_wpl')}`
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
            .then(data => {
                setCreatedProjectId(data?.data?.project?._id);
                setIsCreatingProject(false);
            })

            setSubmitted(true);
        }
    };

    const handleNavigateToProjectDetails = () => {
        navigate(`/projectdetails/${createdProjectId}`);
    }

    const handleDeleteMilestone = (index) => {
        setMilestones((prevMilestones) => 
            prevMilestones.filter((_, i) => i !== index)
        );
    }

    const handleDateChange = (index,date) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], starts_in: date?.getTime()  };
        setMilestones(updatedMilestones);
    };

    useEffect(() => {
        const total = milestones.reduce((sum, milestone) => {
            const prize = parseInt(milestone.prize);
            return prize < 1 ? sum : isNaN(prize) ? sum : sum + prize;
        }, 0);
        setTotalPrize(total)
    },[milestones])

    const handleSearch = (e) => {
        setSearchInput(e.target.value)
    }

    const handleRemoveTile = (tile) => {
        setRole((prev) => prev.filter((t) => t !== tile))
    }

    const handleKeyboardEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            setRole((prev) => [...prev, e.target.value?.trim()])
            setSearchInput('')
        }
    }

    const handleFoundationChange = (e) => {
        setFoundation(e.target.value)
    }

  return (
    <div className='pb-40'>
        <div className='flex items-center gap-1 pl-20 py-2'>
            <div onClick={() => navigate(-1)} className='cursor-pointer text-white88 hover:text-white64 flex items-center gap-1 w-fit'>
                <ArrowLeft size={14} className=''/>
                <p className='font-inter text-[14px]'>Go back</p>
            </div>
        </div>

        {!submitted
            ?  <div className='flex justify-center items-center mt-4'>
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
                                                        <div
                                                            onMouseEnter={() => setImgUploadHover(true)} 
                                                            onMouseLeave={() => setImgUploadHover(false)} 
                                                            onClick={handleUploadClick} 
                                                            className='relative bg-[#FCBF041A] size-[72px] rounded-[8px] border-[1px] border-primaryYellow flex justify-center items-center cursor-pointer'
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
                                                <div onClick={() => {setLogoPreview(null)}} className='flex items-center gap-1 cursor-pointer'><Trash stroke='#E38070' size={15}/> <span className='text-[#E38070] text-[14px] font-inter'>Delete</span></div>
                                            }
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Title of the project <span className='text-[#F03D3D]'>*</span></p>
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
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle <span className='text-[#F03D3D]'>*</span></p>
                                            <div className='cursor-not-allowed bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='cursor-not-allowed bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={organisationHandle} 
                                                    onChange={(e) => setOrganisationHandle(e.target.value)}
                                                    
                                                />
                                            </div>
                                            {errors.organisationHandle && <p className='text-red-500 font-medium text-[10px]'>{errors.organisationHandle}</p>} {/* Error message */}
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add description<span className='text-[#F03D3D]'>*</span></p>
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
                                        
                                        {/* Add info button for Open and Gated (close) projects description */}
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Select bounty type <span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2 text-white64'>
                                                <input type="radio" id="isOpenTrue" name="isOpen" checked={isOpenBounty} onChange={() => setIsOpenBounty(true)} value={true} />
                                                <label className='mr-3' htmlFor="isOpenTrue"> Open</label>
                                                <input type="radio" id="isOpenFalse" name="isOpen" checked={!isOpenBounty} onChange={() => setIsOpenBounty(false)} value={false} />
                                                <label htmlFor="isOpenFalse"> Gated</label>
                                            </div>
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Role <span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                            <div className="w-full rounded-md flex flex-row flex-wrap gap-2">
                                                {role && role?.map((tile, index) => (
                                                    <div className="bg-cardBlueBg2 flex justify-between items-center px-2 py-2 border-transparent focus:outline-0 rounded-[6px] text-white88 w-fit font-gridular text-[14px] leading-[16.8px]">
                                                        {tile}
                                                        <X className='text-white48 w-6 cursor-pointer hover:text-white64 scale-105 transition duration-300' onClick={() => handleRemoveTile(tile)} size={14}/>
                                                    </div>
                                                ))}   
                                                <div className='flex items-center gap-2 w-full border border-white7 rounded-md px-2 h-[32px]'>
                                                    <input onKeyDown={handleKeyboardEnter} value={searchInput} onChange={handleSearch}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' placeholder='Type in roles ex. Frontend'/>
                                                </div>    
                                            </div>
                                            </div>
                                            {errors.organisationHandle && <p className='text-red-500 font-medium text-[10px]'>{errors.organisationHandle}</p>} {/* Error message */}
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation</p>
                                            <div className="min-w-[280px] h-[32px] bg-cardBlueBg2 rounded-md px-2 flex flex-row justify-between">
                                                <select onChange={handleFoundationChange} className='bg-cardBlueBg2 h-full outline-none border-none text-white88 font-gridular w-full text-[14px]'>
                                                    <option value="673067f8797130f180c2846e" className='text-white88 font-gridular text-[14px]'>Starkware</option>
                                                    <option value="67307ac0d5e10d5d8b55e7da" className='text-white88 font-gridular text-[14px]'>Starknet Foundation</option>
                                                </select>
                                            </div>
                                            {errors.discordLink && <p className='text-red-500 font-medium text-[10px]'>{errors.discordLink}</p>} {/* Error message */}
                                        </div>

                                        {/* Select project milestone currency */}
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Select Prize Currency</p>
                                            <div className="min-w-[280px] h-[32px] bg-cardBlueBg2 rounded-md px-2 flex flex-row gap-2 justify-between items-center">
                                                <img src={projCurrency === 'STRK' ? STRKimg : USDCimg} className='size-6' />
                                                <select onChange={(e) => setProjCurrency(e.target.value)} className='bg-cardBlueBg2 h-full outline-none border-none text-white88 font-gridular w-full text-[14px]'>
                                                    <option value="USDC" className='text-white88 bg- font-gridular text-[14px]'>USDC</option>
                                                    <option value="STRK" className='text-white88 font-gridular text-[14px]'>STRK</option>
                                                </select>
                                            </div>
                                            {errors.projCurrency && <p className='text-red-500 font-medium text-[10px]'>{errors.projCurrency}</p>} {/* Error message */}
                                        </div>

                                        <div className='mt-3'>
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
                                            {errors.discordLink && <p className='text-red-500 font-medium text-[10px]'>{errors.discordLink}</p>} {/* Error message */}
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
                                        <Menu size={14} className='text-primaryYellow'/>
                                        <div className='text-primaryYellow font-inter text-[14px]'>Project Details</div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="py-2">
                                    <div>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>What's the project about? (240 character)</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <textarea value={aboutProject} onChange={(e) => setAboutProject(e.target.value)} type='text' className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}/>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className='border border-dashed border-white12 my-4'/>

                        <div>
                            {milestones.map((milestone, index) => (
                                <Accordion key={index} type="single" defaultValue={`item-${index}`} collapsible>
                                    <AccordionItem value={`item-${index}`} key={index} className="border-none">
                                        <div className="flex w-full border-b border-primaryYellow justify-between items-center">
                                            <AccordionTrigger className="w-[425px] text-white48 font-inter hover:no-underline">
                                                <div className='flex items-center gap-1'>
                                                    <Trophy size={14} className='text-primaryYellow'/>
                                                    <div className='text-primaryYellow font-inter text-[14px]'>Milestone {index + 1}</div>
                                                </div>
                                            </AccordionTrigger>
                                            <X size={16} className='text-primaryRed w-[30px] cursor-pointer' onClick={() => handleDeleteMilestone(index)}/>
                                        </div>
                                        <AccordionContent className="py-2">
                                            <div>
                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Title</p>
                                                    <div className='bg-white7 rounded-md px-3 py-2'>
                                                        <input
                                                            type='text'
                                                            className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                            value={milestone.title}
                                                            onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)} 
                                                        />
                                                    </div>
                                                    {milestone.err?.title && <p className='text-red-500 font-medium text-[10px]'>{milestone.err.title}</p>}
                                                </div>
                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add Milestone goals</p>
                                                    <div className='bg-white7 rounded-md px-3 py-2'>
                                                        <textarea 
                                                            type='text' 
                                                            className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                            rows={4}
                                                            value={milestone.description} 
                                                            onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)} 
                                                        />
                                                    </div>
                                                    {milestone.err?.description && <p className='text-red-500 font-medium text-[10px]'>{milestone.err.description}</p>}
                                                </div>
                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Start date</p>
                                                    <div className='bg-white7 rounded-md'>
                                                        <DatePicker
                                                            className='w-[28rem] bg-transparent text-white88 placeholder:text-white64 outline-none border-none cursor-pointer px-3 py-2' 
                                                            selected={milestone.starts_in || ''}
                                                            onChange={(date) => handleDateChange(index,date)}
                                                            minDate={new Date()}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText='DD/MM/YYYY'
                                                        />
                                                    </div>
                                                    {milestone.err?.starts_in && <p className='text-red-500 font-medium text-[10px]'>{milestone.err.starts_in}</p>}
                                                </div>

                                                {/* new currency dropdown */}
                                                {/* <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>MB</p>
                                                    <div className='flex items-center gap-2 w-full mt-2'>
                                                        <div className='bg-[#091044] rounded-md p-2 w-[110px] flex justify-center items-center gap-1'>
                                                            <img src={milestone?.currency === 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px] rounded-sm'/>
                                                            <select 
                                                                className='bg-[#091044] text-white88 outline-none border-none w-full'
                                                                value={milestone.currency}
                                                                onChange={(e) => handleMilestoneChange(index, 'currency', e.target.value)}
                                                            >
                                                                <option value="USDC">
                                                                    <p className='text-white88 font-semibold font-inter text-[12px]'>USDC</p>
                                                                </option>
                                                                <option value="STRK">
                                                                    <p className='text-white88 font-semibold font-inter text-[12px]'>STRK</p>
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <div className='w-full'>
                                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                                <input 
                                                                    type='number' 
                                                                    placeholder='1200' 
                                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                                    value={milestone.prize} 
                                                                    onChange={(e) => handleMilestoneChange(index, 'prize', e.target.value)} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {milestone.err?.prize && <p className='text-red-500 ml-[110px] font-medium text-[10px]'>{milestone.err.prize}</p>}
                                                </div> */}

                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone budget</p>
                                                    <div className='flex items-center gap-2 w-full'>
                                                        <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                                                            <img src={milestone?.currency === 'STRK' ? STRKimg : USDCimg} alt='usdc' className='size-[16px] rounded-sm'/>
                                                            <p className='text-white88 font-semibold font-inter text-[12px]'>{milestone.currency}</p>
                                                        </div>
                                                        <div className='w-full'>
                                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                                <input 
                                                                    type='number' 
                                                                    placeholder='1200' 
                                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                                    value={milestone.prize} 
                                                                    onChange={(e) => handleMilestoneChange(index, 'prize', e.target.value)} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {milestone.err?.prize && <p className='text-red-500 ml-[110px] font-medium text-[10px]'>{milestone.err.prize}</p>}
                                                </div>
                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Delivery Time</p>
                                                    <div className='flex items-center gap-2 w-full mt-2'>
                                                        <div className='bg-[#091044] rounded-md p-2 w-[110px] flex justify-center items-center gap-1'>
                                                            <select 
                                                                className='bg-[#091044] text-white88 outline-none border-none w-full'
                                                                value={milestone.timeUnit}
                                                                onChange={(e) => handleMilestoneChange(index, 'timeUnit', e.target.value)}
                                                            >
                                                                <option value="Days">Days</option>
                                                                <option value="Weeks">Weeks</option>
                                                                <option value="Months">Months</option>
                                                            </select>
                                                        </div>
                                                        <div className='w-full'>
                                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                                <input 
                                                                    type='number' 
                                                                    placeholder='Enter delivery time' 
                                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                                    value={milestone.deliveryTime} 
                                                                    onChange={(e) => handleMilestoneChange(index, 'deliveryTime', e.target.value)} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {milestone.err?.deliveryTime && <p className='text-red-500 ml-[110px] font-medium text-[10px]'>{milestone.err.deliveryTime}</p>}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>

                        <div className='mt-4'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[470px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                                btn_txt={<span className='flex items-center justify-center gap-2'><Plus size={14}/><span>Add milestone</span></span>} 
                                alt_txt='add milestone btn' 
                                onClick={handleAddMilestone}
                            />
                            {/* <button className='flex justify-center items-center w-full border border-primaryYellow h-[43px]' onClick={handleAddMilestone}>
                                <Plus size={14} className='text-primaryYellow'/>
                                <p className='text-primaryYellow font-gridular text-[14px]'>Add milestone</p>
                            </button> */}
                        </div>                      
                    </div>
                </div>
            :   <div className='flex justify-center items-center mt-4'>
                    <div className='max-w-[469px] w-full'>
                        <div className='flex gap-4 border border-dashed border-[#FFFFFF1F] bg-[#FCBF041A] rounded-md px-4 py-3'>
                            <div>
                                <img src={logoPreview} alt='dummy' className='size-[72px] aspect-square rounded-md'/>
                            </div>
                            <div>
                                <p className='text-white88 font-gridular text-[20px] leading-[24px]'>{title}</p>
                                <p className='text-white88 font-semibold text-[13px] font-inter'>@{organisationHandle}</p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center mt-8'>
                            <img src={tickFilledImg} alt='tick-filled' className='size-[54px] mb-4'/>
                            <div className='text-white font-inter'>Added Project</div>
                            <p className='text-white32 text-[13px] font-semibold font-inter'>You can now view updated details of the project overview</p>
                        </div>

                        <div className='mt-6'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[490px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                                btn_txt='view project' 
                                alt_txt='view projects btn' 
                                onClick={handleNavigateToProjectDetails}
                            />
                            {/* <button onClick={handleNavigateToProjectDetails} className='flex justify-center items-center py-3 px-4 border border-primaryYellow text-primaryYellow w-full font-gridular'>View Project</button> */}
                        </div>
                    </div>
                </div>
        }

            <div className='bg-[#091044] px-20 py-4 fixed bottom-0 left-0 w-full flex justify-between items-center'>
                    
                    <div className='flex items-center gap-2'>
                        <p className='text-white88 font-semibold font-inter text-[13px]'>Project Total Sum</p>
                        <div className='bg-white4 rounded-md flex items-center gap-1 h-8 px-3'>
                            <img src={projCurrency === 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px]'/>
                            <p className='text-white88 text-[12px] font-semibold font-inter'>{totalPrize}</p>
                            <p className='text-white32 font-semibold font-inter text-[12px]'>{projCurrency}</p>
                        </div>
                    </div>
                    <div>
                        <FancyButton 
                            src_img={saveBtnImg} 
                            hover_src_img={saveBtnHoverImg} 
                            disabled={isCreatingProject}
                            img_size_classes='w-[175px] h-[44px]' 
                            className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                            btn_txt={<span className='flex items-center justify-center gap-2'>
                                {isCreatingProject ? <div className='flex justify-center items-center -translate-y-1'><Spinner /></div> : <>
                                    <CheckCheck size={14}/><span>Create</span>
                                </>
                            }
                            </span>} 
                            alt_txt='save project btn' 
                            onClick={handleSubmit}
                        />
                    </div>
            </div>
    </div>
  )
}

export default AddProjectPage