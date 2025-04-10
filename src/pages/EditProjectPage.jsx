import { ArrowLeft, CheckCheck, Menu, Pen, Plus, Trash, Upload, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import USDCimg from '../assets/svg/usdc.svg'
import STRKimg from '../assets/images/strk.png'
import DiscordSVG from '../assets/icons/pixel-icons/discord.svg'
import { createNotification, getProjectDetails, getUserOrgs, updateOpenProjectDetails, updateProjectDetails } from '../service/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { discord_server_link_regex, getTimestampFromNow, ROLES, telegram_channel_link_regex } from '../lib/constants'
import DatePicker from 'react-datepicker'
import saveBtnImg from '../assets/svg/menu_btn_subtract.png'
import saveBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png'
import btnImg from '../assets/svg/btn_subtract_semi.png'
import btnHoverImg from '../assets/svg/btn_hover_subtract.png'
import FancyButton from '../components/ui/FancyButton'
import { useDispatch, useSelector } from 'react-redux'

import { storage } from '../lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import trophySVG from '../assets/icons/pixel-icons/trophy-yellow.svg'
import tickFilledImg from '../assets/icons/pixel-icons/tick-filled.png'
import { displaySnackbar } from '../store/thunkMiddleware'
import DropdownSearchList from '../components/form/DropdownSearchList'

const calcDaysUntilDate = (futureDate) => {
    const today = new Date();
    const differenceInMilliseconds = new Date(futureDate) - today;
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    if (differenceInDays%30 == 0) {
        return { timeUnit: 'months', deliveryTime: Math.floor(differenceInDays / 30) };
    } else if (differenceInDays%7 == 0) {
        return { timeUnit: 'weeks', deliveryTime: Math.floor(differenceInDays / 7) };
    } else {
        return { timeUnit: 'days', deliveryTime: differenceInDays };
    }
}

const EditProjectPage = () => {
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const { id } = useParams();
    const { user_id } = useSelector((state) => state)
    const [username, setUsername] = useState('Bounty owner');

    const {data: projectDetails, isLoading: isLoadingProjectDetails} = useQuery({
        queryKey: ['projectDetails', id],
        queryFn: () => getProjectDetails(id),
        enabled: !!id
    })

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    useEffect(() => {
        if(!isLoadingUserDetails) setUsername(userDetails?.displayName);
    },[isLoadingUserDetails])

    const {data: userOrganisations, isLoading: isLoadingUserOrgs} = useQuery({
        queryKey: ['userOrganisations', user_id],
        queryFn: () => getUserOrgs(user_id),
        enabled: !!user_id,
    })

    const [title, setTitle] = useState(projectDetails?.title || '');
    const [organisationHandle, setOrganisationHandle] = useState(projectDetails?.organisationHandle || projectDetails?.organisation?.organisationHandle || '');
    const [organisationId, setOrganisationId] = useState('');
    const [description, setDescription] = useState(projectDetails?.description || '');
    const [helpLink, setHelpLink] = useState(projectDetails?.helpLink || projectDetails?.organisation?.socialHandleLink?.telegram || projectDetails?.organisation?.socialHandleLink?.discord || '');
    const [about, setAbout] = useState(projectDetails?.about || '');
    const [projCurrency, setProjCurrency] = useState(projectDetails?.currency || '');
    const [isOpenBounty, setIsOpenBounty] = useState(projectDetails?.isOpenBounty || '');

    const [role, setRole] = useState(projectDetails?.roles || []);

    const [submitted, setSubmitted] = useState(false);

    const [milestones, setMilestones] = useState(projectDetails?.milestones || [])
   
    const [pfpPreview, setPfpPreview] = useState('')
    const [pfp, setPfp] = useState('')

    // State for validation errors
    const [errors, setErrors] = useState({});

    // For milestone validation errors
    const [msErrors, setMsErrors] = useState([])

    const updateCurrency = (currency) => {
        setProjCurrency(currency);
        if(milestones?.length > 0) {
            const tempMS = [...milestones];
            tempMS.map((ms,idx) => {
                tempMS[idx] = { ...ms, currency: currency };
            })
            setMilestones(tempMS)
        }
    }

    const setMilestonesHelper = (index,event) => {
        setMilestones(prevMilestones => {
            const updatedMilestones = [...prevMilestones];

            updatedMilestones[index] = {
                ...updatedMilestones[index],
                [event.target.name]: event.target.value,
            };
            return updatedMilestones;
        });
    }

    const handleAddMilestone = () => {
        // const newMilestoneIndex = milestones.length + 1; // Calculate the new milestone index
        setMilestones([...milestones, { title: '', description: '', prize: '1', currency: projCurrency, deliveryTime: '1', timeUnit: 'Days' }]);
    };

    const handleDeleteMilestone = (index) => {
        setMilestones((prevMilestones) => 
            prevMilestones.filter((_, i) => i !== index)
        );
        const newMsError = [...msErrors.slice(0, index), ...msErrors.slice(index + 1)]
        setMsErrors(newMsError)
    }

    // Milestone validation
    const validateMilestones = () => {
        let isErr = false;
        if(milestones?.length > 0) {
            let tempMsErr = msErrors;
            milestones.map((milestone,index) => {
                const newErrors = {};
                if (!milestone.title) newErrors.title = 'Milestone title is required';
                if (!milestone.description) newErrors.description = 'Milestone description is required';
                if (!milestone.starts_in) newErrors.starts_in = 'Start date is required';
                if (!milestone.prize) {
                    newErrors.prize = 'Prize is required';
                } else if(parseInt(milestone.prize) < 1) {
                    newErrors.prize = 'Prize should be greater than 0'
                }
                if (!milestone.deliveryTime) {
                    newErrors.deliveryTime = 'Delivery time is required';
                } else if(parseInt(milestone.deliveryTime) < 1) {
                    newErrors.deliveryTime = 'Delivery time should be greater than 0';
                }
                tempMsErr[index] = newErrors;
                if (Object.keys(newErrors).length !== 0) {
                    isErr = true;
                }
            })
            setMsErrors(tempMsErr);
        }
        return isErr;
    }

    // Validation function
    const validateFields = () => {
        const newErrors = {};
        if (title.length === 0) newErrors.title = `${isOpenBounty ? "Bounty" : "Project"} title is required`;
        if (title.length > 100) newErrors.title = `${isOpenBounty ? "Bounty" : "Project"} title cannot exceed 100 characters.`;
        
        if (description.length === 0) newErrors.description = 'About Organisation field is required';
        if (description.length > 1000) newErrors.description = 'About Organisation field cannot exceed 1000 characters.';
        
        if (!helpLink) {
            newErrors.helpLink = 'Help link is required';
        } else if(!discord_server_link_regex.test(helpLink) && !telegram_channel_link_regex.test(helpLink)) {
            newErrors.helpLink = 'Link must be a valid Telegram channel or Discord server link'
        } 
        if (!about) newErrors.about = 'About project field is required.';
        if (milestones.length === 0) {
            newErrors.milestones = 'At least one milestone is required';
        } else if(validateMilestones()) {
            newErrors.milestones = 'Please fill all the fields for milestones'
        }

        if (role.length < 1) newErrors.role = 'Role/s is/are required'
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUploadClick = () => {
        fileInputRef.current.click();   
    }

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        setPfp(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPfpPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = async () => {
        const updatedMilestones = milestones.map(milestone => ({
            ...milestone,
            deadline: getTimestampFromNow(milestone.deliveryTime, milestone.timeUnit?.toLowerCase(), milestone.starts_in), // Add timestamp to each milestone
            starts_in: milestone?.starts_in
        }));

        const tmpMilestones = [...updatedMilestones];
        const lastMilestone = tmpMilestones?.length == 0 ? [] : tmpMilestones?.reduce((last, curr) => { 
            return new Date(parseInt(last.deadline)) < new Date(parseInt(curr.deadline)) ? curr : last;
        });


        if (validateFields()) {

            // Proceed with saving the data
            const updData = {
                project: {
                    title: title,
                    description: description,
                    organisationHandle: organisationHandle,
                    organisationId: organisationId,
                    helpLink: helpLink,
                    about: about,
                    image: projectDetails?.image,
                    currency: projCurrency,
                    deadline: lastMilestone?.deadline,
                    roles: role,
                    status: projectDetails?.status || 'idle'
                },
                milestones: updatedMilestones
            }

            if(pfp) {
                const imageRef = ref(storage, `images/${pfp.name}`);
                await uploadBytes(imageRef, pfp);
                const imageUrl = await getDownloadURL(imageRef);
        
                updData.project.image = imageUrl
            } else {
                updData.project.image = projectDetails?.image
            }
            
            // Edit open project
            if(projectDetails?.isOpenBounty) {
                const updData = {
                    title: title,
                    // organisationHandle: userOrg?.organisationHandle,
                    organisationId: userOrg?._id,
                    description: description,
                    // helpLink: helpLink,
                    status: "idle",
                    about: aboutProject,
                    roles: role,
                    image: imageUrl || userOrg?.img,
                    isOpenBounty: isOpenBounty,
                    currency: projCurrency,    // project currency strk or usdc
                    deadline: lastMilestone?.deadline,
                    // noOfWinners: parseFloat(numOfWinners),
                    // prizePool: multiWinnerPrizePool
                }
                const res = await updateOpenProjectDetails(projectDetails._id, updData);
            } else {
                const res = await updateProjectDetails(projectDetails._id, updData);
            }
            const notiObj = {
                msg: `${username} has updated the project...`,
                type: 'project_req',
                fromId: user_id,
                user_id: projectDetails.user_id,
                project_id: projectDetails._id
            }
            const notiRes = await createNotification(notiObj)
            setSubmitted(true)
        }
    };

    const handleNavigateToProjectDetails = () => {
        navigate(`/projectdetails/${projectDetails._id}`);
    }

    const handleDateChange = (index,date) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], starts_in: date.getTime() };
        setMilestones(updatedMilestones);
    };

    useEffect(() => {
        const updatedMilestones = milestones.map(milestone => {
            const daysObj = calcDaysUntilDate(milestone?.deadline);
            return {
                ...milestone,
                deliveryTime: daysObj.deliveryTime,
                timeUnit: daysObj.timeUnit
            }
        });
        
        setMilestones(updatedMilestones)
    },[])

    useEffect(() => {
        if(!isLoadingUserOrgs) {
            if(userOrganisations[0]?.status == 'pending') {
                dispatch(displaySnackbar('Your Organisation is not yet approved by Admin. Please try again later.'))
                navigate('/sponsordashboard')
            }
            setOrganisationHandle(userOrganisations[0]?.organisationHandle)
            setOrganisationId(userOrganisations[0]?._id)
        }
    },[isLoadingUserOrgs])
    
  return (
    <div className='mb-20'>
        <div className='flex items-center gap-1 pl-20 border-b border-white12 text-white32 hover:text-white64 py-2'>
            <ArrowLeft size={14}/>
            <p className='font-inter text-[14px] cursor-pointer' onClick={handleNavigateToProjectDetails}>Go back</p>
        </div>

        {!submitted ?
            <div className='flex justify-center items-center mt-4'>
                <div className='max-w-[530px] w-full mb-12 bg-white7 px-6 py-2 rounded-md'>
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
                                    <div>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>{isOpenBounty ? "Bounty" : "Project"} Title</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <input
                                                type='text'
                                                value={title}   
                                                onChange={(e) => setTitle(e.target.value)}
                                                className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                            />
                                        </div>
                                        {errors.title && <p className='text-[12px] font-medium text-red-500'>{errors.title}</p>}
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <input
                                                type='text'
                                                value={organisationHandle}
                                                className='cursor-not-allowed bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                disabled
                                            />
                                        </div>
                                        {errors.organisationHandle && <p className='text-[12px] font-medium text-red-500'>{errors.organisationHandle}</p>}
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>About the Organisation</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                rows={4}
                                            />
                                        </div>
                                        {errors.description && <p className='text-[12px] font-medium text-red-500'>{errors.description}</p>}
                                    </div>

                                    <div className='flex justify-between items-center mt-4'>
                                        <div className='flex items-center gap-4'>
                                            {pfpPreview ? 
                                                <div className='relative'>
                                                    <img src={pfpPreview || projectDetails?.image}  onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = projectDetails?.image;
                                                        }} 
                                                        alt='dummy' className='size-[72px] aspect-square rounded-md'/
                                                    >
                                                    <div onClick={() => {setPfpPreview(null)}} className='absolute -top-2 -right-1 bg-white64 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                                </div>
                                                : <>
                                                    <div className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
                                                        <div className='relative'>
                                                            <img src={projectDetails?.image} alt='dummy' className='size-[72px] aspect-square'/>
                                                            <div onClick={handleUploadClick} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><Pen size={14} className='text-black/60'/></div>
                                                        </div>
                                                        <input
                                                            name='img'
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleProfilePicChange}
                                                            style={{ display: 'none' }}
                                                        />                           
                                                    </div>
                                                    <div className='text-[14px] font-inter'>
                                                        <p className='text-white88'>Add a cover image</p>
                                                        <p className='text-white32'>Recommended 1:1 aspect ratio</p>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>

                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Role </p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <DropdownSearchList dropdownList={ROLES} setterFunction={setRole} prefilledTiles={role} />
                                        </div>
                                        {errors.role && <p className='text-[12px] font-medium text-red-500'>{errors.role}</p>}
                                    </div>

                                    {/* Select project milestone currency */}
                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Select Prize Currency</p>
                                        <div className="min-w-[280px] h-[32px] bg-cardBlueBg2 rounded-md px-2 flex flex-row gap-2 justify-between items-center">
                                            <img src={projCurrency === 'STRK' ? STRKimg : USDCimg} className='size-6' />
                                            <select value={projCurrency} onChange={(e) => updateCurrency(e.target.value)} className='bg-cardBlueBg2 h-full outline-none border-none text-white88 font-gridular w-full text-[14px] cursor-pointer'>
                                                <option value="USDC" className='text-white88 bg- font-gridular text-[14px]'>USDC</option>
                                                <option value="STRK" className='text-white88 font-gridular text-[14px]'>STRK</option>
                                            </select>
                                        </div>
                                        {errors.projCurrency && <p className='text-red-500 font-medium text-[10px]'>{errors.projCurrency}</p>} {/* Error message */}
                                    </div>

                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Help link (Telegram/Discord)</p>
                                        <div className='bg-white7 rounded-md px-3 py-2 flex items-center gap-2'>
                                            <img src={DiscordSVG} alt='discord' className='size-[20px]'/>
                                            <input
                                                type='text'
                                                value={helpLink}
                                                onChange={(e) => setHelpLink(e.target.value)}
                                                placeholder='https://app_name/group_name'
                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                            />
                                        </div>
                                        {errors.helpLink && <p className='text-[12px] font-medium text-red-500'>{errors.helpLink}</p>}
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
                                    <div className='text-primaryYellow font-inter text-[14px]'>{isOpenBounty ? "Bounty" : "Project"} Details</div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="py-2">
                                <div>
                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>What's the {isOpenBounty ? "Bounty" : "Project"} about?</p>
                                    <div className='bg-white7 rounded-md px-3 py-2'>
                                        <textarea value={about} onChange={(e) => setAbout(e.target.value)} type='text' className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}/>
                                    </div>
                                    {errors.about && <p className='text-[12px] font-medium text-red-500'>{errors.about}</p>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                    {isOpenBounty ?
                        <>
                            <div className='mt-3'>
                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Start date</p>
                                <div className='bg-white7 rounded-md'>
                                    <DatePicker
                                        className='w-[28rem] bg-transparent text-white88 placeholder:text-white64 outline-none border-none cursor-pointer px-3 py-2' 
                                        selected={projectDetails?.starts_in || ''}
                                        onChange={(date) => handleDateChange(0,date)}
                                        minDate={new Date()}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText='DD/MM/YYYY'
                                    />
                                </div>
                                {msErrors.length != 0 && msErrors[0]?.starts_in && <p className='text-red-500 font-medium text-[12px]'>{msErrors[0]?.starts_in}</p>}
                            </div>
                            <div className='mt-3'>
                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone budget</p>
                                <div className='flex items-center gap-2 w-full'>
                                    <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                                        <img src={projCurrency == 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px] rounded-sm'/>
                                        <p className='text-white88 font-semibold font-inter text-[12px]'>{projCurrency}</p>
                                    </div>
                                    <div className='w-full'>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <input 
                                                type='number' 
                                                value={projectDetails?.totalPrize} 
                                                name='prize'
                                                onChange={(e) => setMilestonesHelper(0,e)} 
                                                placeholder='1200' 
                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'/>
                                        </div>
                                    </div>
                                </div> 
                                {msErrors.length != 0 && msErrors[0]?.prize && <p className='text-red-500 font-medium text-[12px] ml-[100px]'>{msErrors[0]?.prize}</p>}
                            </div>
                            <div className='mt-3'>
                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Delivery Time</p>
                                <div className='flex items-center gap-2 w-full mt-2'>
                                    <div className='bg-[#091044] rounded-md p-2 w-[110px] flex justify-center items-center gap-1'>
                                        <select 
                                            className='bg-[#091044] text-white88 outline-none border-none w-full cursor-pointer'
                                            value={projectDetails?.timeUnit || 'Days'}
                                            name='timeUnit'
                                            onChange={(e) => setMilestonesHelper(0,e)}
                                        >
                                            <option value="Days">Days</option>
                                            <option value="Weeks">Weeks</option>
                                            {/* <option value="Months">Months</option> */}
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <input 
                                                type='number' 
                                                placeholder='1200' 
                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                value={projectDetails?.deliveryTime}
                                                name='deliveryTime'
                                                onChange={(e) => setMilestonesHelper(0,e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {msErrors.length != 0 && msErrors[0]?.deliveryTime && <p className='text-red-500 font-medium text-[12px] ml-[100px]'>{msErrors[0]?.deliveryTime}</p>}
                            </div>
                        </>
                    :
                    <>
                        <div className='border border-dashed border-white12 my-4'/>
                        {errors?.milestones && <p className='text-red-500 font-medium text-[12px]'>{errors?.milestones}</p>}

                        <div>
                            {milestones?.map((milestone, index) => (
                                <Accordion type="single" defaultValue="item-3" collapsible>
                                <AccordionItem value={`item-${3}`} key={3} className="border-none">
                                        <div className="flex w-full border-b border-primaryYellow justify-between items-center">
                                            <AccordionTrigger className="w-[425px] text-white48 font-inter hover:no-underline">
                                                <div className='flex items-center gap-1'>
                                                    <img src={trophySVG} alt="trophy" className='size-[18px]'/>
                                                    <div className='text-primaryYellow font-inter text-[14px]'>Milestone {index + 1}</div>
                                                </div>
                                            </AccordionTrigger>
                                            <X size={16} className='text-primaryRed w-[30px] cursor-pointer' onClick={() => handleDeleteMilestone(index)}/>
                                        </div>
                                    <AccordionContent className="py-2">
                                        <div>
                                            <div className='mt-3'>
                                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone title</p>
                                                <div className='bg-white7 rounded-md px-3 py-2'>
                                                    <input
                                                        type='text'
                                                        value={milestone.title}
                                                        name='title'
                                                        onChange={(e) => setMilestonesHelper(index,e)} 
                                                        className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                    />
                                                </div>
                                                {msErrors.length != 0 && msErrors[index]?.title && <p className='text-red-500 font-medium text-[12px]'>{msErrors[index]?.title}</p>}
                                            </div>
                                            <div className='mt-3'>
                                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone description</p>
                                                <div className='bg-white7 rounded-md px-3 py-2'>
                                                    <textarea type='text' 
                                                        value={milestone.description} 
                                                        name='description'
                                                        onChange={(e) => setMilestonesHelper(index,e)} 
                                                        className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}
                                                    />
                                                </div>
                                                {msErrors.length != 0 && msErrors[index]?.description && <p className='text-red-500 font-medium text-[12px]'>{msErrors[index]?.description}</p>}
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
                                                {msErrors.length != 0 && msErrors[index]?.starts_in && <p className='text-red-500 font-medium text-[12px]'>{msErrors[index]?.starts_in}</p>}
                                            </div>
                                            <div className='mt-3'>
                                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone budget</p>
                                                <div className='flex items-center gap-2 w-full'>
                                                    <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                                                        <img src={projCurrency == 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px] rounded-sm'/>
                                                        <p className='text-white88 font-semibold font-inter text-[12px]'>{projCurrency}</p>
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                                            <input 
                                                                type='number' 
                                                                value={milestone.prize} 
                                                                name='prize'
                                                                onChange={(e) => setMilestonesHelper(index,e)} 
                                                                placeholder='1200' 
                                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'/>
                                                        </div>
                                                    </div>
                                                </div> 
                                                {msErrors.length != 0 && msErrors[index]?.prize && <p className='text-red-500 font-medium text-[12px] ml-[100px]'>{msErrors[index]?.prize}</p>}
                                            </div>
                                            <div className='mt-3'>
                                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Delivery Time</p>
                                                <div className='flex items-center gap-2 w-full mt-2'>
                                                    <div className='bg-[#091044] rounded-md p-2 w-[110px] flex justify-center items-center gap-1'>
                                                        <select 
                                                            className='bg-[#091044] text-white88 outline-none border-none w-full cursor-pointer'
                                                            value={milestone.timeUnit || 'Days'}
                                                            name='timeUnit'
                                                            onChange={(e) => setMilestonesHelper(index,e)}
                                                        >
                                                            <option value="Days">Days</option>
                                                            <option value="Weeks">Weeks</option>
                                                            {/* <option value="Months">Months</option> */}
                                                        </select>
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                                            <input 
                                                                type='number' 
                                                                placeholder='1200' 
                                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                                value={milestone.deliveryTime}
                                                                name='deliveryTime'
                                                                onChange={(e) => setMilestonesHelper(index,e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {msErrors.length != 0 && msErrors[index]?.deliveryTime && <p className='text-red-500 font-medium text-[12px] ml-[100px]'>{msErrors[index]?.deliveryTime}</p>}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            ))}
                        </div>
                    </>
                    }
                    
                    {!isOpenBounty &&
                        <div className='mt-4'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[470px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                                btn_txt={<span className='flex items-center justify-center gap-2'><Plus size={14}/><span>Add milestone</span></span>} 
                                alt_txt='add milestone btn' 
                                onClick={handleAddMilestone}
                                transitionDuration={500}
                            />
                        </div>          
                    }            
                </div>
            </div>
        : 
            <div className='flex justify-center items-center mt-4'>
                <div className='max-w-[469px] w-full'>
                    <div className='flex gap-4 border border-dashed border-[#FFFFFF1F] bg-[#FCBF041A] rounded-md px-4 py-3'>
                        <div>
                         </div>
                        <div>
                            <p className='text-white88 font-gridular text-[20px] leading-[24px]'>{title}</p>
                            <p className='text-white32 font-semibold text-[13px] font-inter underline'><a href={projectDetails?.organisation?.websiteLink} target='_blank' rel="noopener noreferrer" >@{organisationHandle}</a></p>
                        </div>
                    </div>

                    <div className='flex flex-col justify-center items-center mt-8'>
                        <img src={tickFilledImg} alt='tick-filled' className='size-[54px] mb-4'/>
                        <div className='text-white font-inter'>Updated Project details</div>
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
                            transitionDuration={500}
                        />
                    </div>
                </div>
            </div>
        }
        
        {!submitted &&
        <div className='bg-[#091044] px-20 py-4 fixed bottom-0 left-0 w-full flex justify-between items-center'>
            <div className='flex items-center gap-2'>
                <p className='text-white88 font-semibold font-inter text-[13px]'>Project Total Sum</p>
                <div className='bg-white4 rounded-md flex items-center gap-1 h-8 px-3'>
                    <img src={projCurrency == 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px]'/>
                    <p className='text-white88 text-[12px] font-semibold font-inter'>{projectDetails?.totalPrize}</p>
                    <p className='text-white32 font-semibold font-inter text-[12px]'>{projCurrency}</p>
                </div>
            </div>
            <div>
                <FancyButton 
                    src_img={saveBtnImg} 
                    hover_src_img={saveBtnHoverImg} 
                    img_size_classes='w-[175px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                    btn_txt={<span className='flex items-center justify-center gap-2'><CheckCheck size={14}/><span>Save</span></span>} 
                    alt_txt='save project btn' 
                    onClick={handleSave}
                    transitionDuration={500}
                />
            </div>
        </div>
        }
    </div>
  )
}

export default EditProjectPage