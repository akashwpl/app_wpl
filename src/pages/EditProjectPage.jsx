import { ArrowLeft, CheckCircle2, ChevronDown, Menu, Plus, Trash, Trophy, Upload, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import USDCsvg from '../assets/svg/usdc.svg'
import DiscordSvg from '../assets/svg/discord.svg'
import { getProjectDetails, updateProjectDetails } from '../service/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTimestampFromNow } from '../lib/constants'
import DatePicker from 'react-datepicker'
// import '../components/ui/react-datepicker.css';

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

    const { id } = useParams();

    const {data: projectDetails, isLoading: isLoadingProjectDetails} = useQuery({
        queryKey: ['projectDetails', id],
        queryFn: () => getProjectDetails(id),
        enabled: !!id
    })

    const [title, setTitle] = useState(projectDetails?.title || '');
    const [organisationHandle, setOrganisationHandle] = useState(projectDetails?.organisationHandle || '');
    const [description, setDescription] = useState(projectDetails?.description || '');
    const [discordLink, setDiscordLink] = useState(projectDetails?.discordLink || '');
    const [about, setAbout] = useState(projectDetails?.about || '');

    const [submitted, setSubmitted] = useState(false);

    const [milestones, setMilestones] = useState(projectDetails?.milestones || [])

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
        const newMilestoneIndex = milestones.length + 1; // Calculate the new milestone index
        setMilestones([...milestones, { title: `Milestone ${newMilestoneIndex}`, description: '', prize: '', currency: 'USDC', deliveryTime: '', timeUnit: 'Weeks' }]);
    };

    const handleDeleteMilestone = (index) => {
        setMilestones((prevMilestones) => 
            prevMilestones.filter((_, i) => i !== index)
        );
    }

    // State for validation errors
    const [errors, setErrors] = useState({});


    // Validation function
    const validateFields = () => {
        const newErrors = {};
        if (title.length === 0) newErrors.title = 'Title is required.';
        if (title.length > 240) newErrors.title = 'Title cannot exceed 240 characters.';
        
        if (organisationHandle.length === 0) newErrors.organisationHandle = 'Organisation handle is required.';
        if (organisationHandle.length > 240) newErrors.organisationHandle = 'Organisation handle cannot exceed 240 characters.';
        
        if (description.length === 0) newErrors.description = 'Description is required.';
        if (description.length > 240) newErrors.description = 'Description cannot exceed 240 characters.';
        
        if (!discordLink.startsWith('https://discord.gg/')) newErrors.discordLink = 'Discord link must start with https://discord.gg/';
        if (!about) newErrors.about = 'About is required.';
        
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        const updatedMilestones = milestones.map(milestone => ({
            ...milestone,
            deadline: getTimestampFromNow(milestone.deliveryTime, milestone.timeUnit?.toLowerCase() || 'days', milestone.starts_in) // Add timestamp to each milestone
        }));

        console.log('Updatedmilestones', updatedMilestones);

        if (validateFields()) {
            // Proceed with saving the data
            const updData = {
                project: {
                    title: title,
                    description: description,
                    organisationHandle: organisationHandle,
                    discordLink: discordLink,
                    about: about,
                },
                milestones: updatedMilestones
            }
            console.log(updData);
            
            const res = await updateProjectDetails(projectDetails._id, updData);
            console.log('response', res);
            setSubmitted(true);
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

  return (
    <div className='mb-20'>
        <div className='flex items-center gap-1 pl-20 border-b border-white12 py-2'>
            <ArrowLeft size={14} stroke='#ffffff65'/>
            <p className='text-white32 font-inter text-[14px] cursor-pointer' onClick={handleNavigateToProjectDetails}>Go back</p>
        </div>

        {!submitted ?
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
                                    <div>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Title of the project</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <input
                                                type='text'
                                                value={title}   
                                                onChange={(e) => setTitle(e.target.value)}
                                                className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                            />
                                        </div>
                                        {errors.title && <p className='text-[10px] font-medium text-red-500'>{errors.title}</p>}
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <input
                                                type='text'
                                                value={organisationHandle}
                                                onChange={(e) => setOrganisationHandle(e.target.value)}
                                                className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                            />
                                        </div>
                                        {errors.organisationHandle && <p className='text-[10px] font-medium text-red-500'>{errors.organisationHandle}</p>}
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add description (240 character)</p>
                                        <div className='bg-white7 rounded-md px-3 py-2'>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                rows={4}
                                            />
                                        </div>
                                        {errors.description && <p className='text-[10px] font-medium text-red-500'>{errors.description}</p>}
                                    </div>

                                    <div className='flex justify-between items-center mt-4'>
                                        <div className='flex items-center gap-4'>
                                            {/* {projectDetails.imgPreview ? 
                                                <div className='relative'>
                                                    <img src={projectDetails.imgPreview} alt='dummy' className='size-[72px] aspect-square'/>
                                                    <div onClick={() => {}} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                                </div>
                                            :   <> */}
                                                    <div onClick={() => {}} className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
                                                        <Upload size={16} className='text-white32'/>
                                                        <input
                                                            name='img'
                                                            type="file"
                                                            // ref={fileInputRef}
                                                            onChange={() => {}}
                                                            style={{ display: 'none' }}
                                                        />                           
                                                    </div>
                                                    <div className='text-[14px] font-inter'>
                                                        <p className='text-white88'>Add a cover image</p>
                                                        <p className='text-white32'>Recommended 1:1 aspect ratio</p>
                                                    </div>
                                                {/* </> */}
                                            {/* } */}
                                        </div>
                                        <div className='flex items-center gap-1'><Trash stroke='#E38070' size={15}/> <span className='text-[#E38070] text-[14px] font-inter'>Delete</span></div>
                                    </div>

                                    <div className='mt-3'>
                                        <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Discord Link</p>
                                        <div className='bg-white7 rounded-md px-3 py-2 flex items-center gap-2'>
                                            <img src={DiscordSvg} alt='discord' className='size-[20px]'/>
                                            <input
                                                type='text'
                                                value={discordLink}
                                                onChange={(e) => setDiscordLink(e.target.value)}
                                                placeholder='discord.gg'
                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                            />
                                        </div>
                                        {errors.discordLink && <p className='text-[10px] font-medium text-red-500'>{errors.discordLink}</p>}
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
                                        <textarea value={about} onChange={(e) => setAbout(e.target.value)} type='text' className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}/>
                                    </div>
                                    {errors.title && <p className='text-[10px] font-medium text-red-500'>{errors.title}</p>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className='border border-dashed border-white12 my-4'/>

                    <div>
                        {milestones?.map((milestone, index) => (
                            <Accordion type="single" defaultValue="item-3" collapsible>
                            <AccordionItem value={`item-${3}`} key={3} className="border-none">
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
                                                    value={milestone.title}
                                                    name='title'
                                                    onChange={(e) => setMilestonesHelper(index,e)} 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add Milestone goals</p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <textarea type='text' 
                                                        value={milestone.description} 
                                                        name='description'
                                                        onChange={(e) => setMilestonesHelper(index,e)} 
                                                        className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}/>
                                            </div>
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
                                        </div>
                                        <div className='mt-3'>
                                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone budget</p>
                                                <div className='flex items-center gap-2 w-full'>
                                                    <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                                                        <img src={USDCsvg} alt='usdc' className='size-[14px] rounded-sm'/>
                                                        <p className='text-white88 font-semibold font-inter text-[12px]'>USDC</p>
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
                                        </div>
                                        <div className='mt-3'>
                                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Set Time</p>
                                                <div className='flex items-center gap-2 w-full mt-2'>
                                                    <div className='bg-[#091044] rounded-md p-2 w-[110px] flex justify-center items-center gap-1'>
                                                        <select 
                                                            className='bg-[#091044] text-white88 outline-none border-none w-full'
                                                            value={milestone.timeUnit || 'Days'}
                                                            name='timeUnit'
                                                            onChange={(e) => setMilestonesHelper(index,e)}
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
                                                                placeholder='1200' 
                                                                className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                                value={milestone.deliveryTime}
                                                                name='deliveryTime'
                                                                onChange={(e) => setMilestonesHelper(index,e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        ))}
                    </div>

                    <div className='mt-4'>
                        <button className='flex justify-center items-center w-full border border-primaryYellow h-[43px]' onClick={handleAddMilestone}>
                            <Plus size={14} className='text-primaryYellow'/>
                            <p className='text-primaryYellow font-gridular text-[14px]'>Add milestone</p>
                        </button>
                    </div>                      
                </div>
            </div>
        : 
            <div className='flex justify-center items-center mt-4'>
                <div className='max-w-[469px] w-full'>
                    <div className='flex gap-4 border border-dashed border-[#FFFFFF1F] bg-[#FCBF041A] rounded-md px-4 py-3'>
                        <div>
                            {/* <img src={} alt='dummy' className='size-[72px] aspect-square rounded-md'/> */}
                        </div>
                        <div>
                            <p className='text-white88 font-gridular text-[20px] leading-[24px]'>{title}</p>
                            <p className='text-white32 font-semibold text-[13px] font-inter'>@{organisationHandle}</p>
                        </div>
                    </div>

                    <div className='flex flex-col justify-center items-center mt-8'>
                        <div><CheckCircle2 fill='#FBF1B8' strokeWidth={1} size={54}/></div>
                        <div className='text-white font-inter'>Updated Project details</div>
                        <p className='text-white32 text-[13px] font-semibold font-inter'>You can now view updated details of the project overview</p>
                    </div>

                    <div className='mt-4'>
                        <button onClick={handleNavigateToProjectDetails} className='flex justify-center items-center py-3 px-4 border border-primaryYellow text-primaryYellow w-full font-gridular'>View Project</button>
                    </div>
                </div>
            </div>
        }

        <div className='bg-[#091044] px-20 py-4 fixed bottom-0 left-0 w-full flex justify-between items-center'>
            
            <div className='flex items-center gap-2'>
                <p className='text-white88 font-semibold font-inter text-[13px]'>Project Total Sum</p>
                <div className='bg-white4 rounded-md flex items-center gap-1 h-8 px-3'>
                    <img src={USDCsvg} alt='usdc' className='size-[14px]'/>
                    <p className='text-white88 text-[12px] font-semibold font-inter'>{projectDetails?.totalPrize}</p>
                    <p className='text-white32 font-semibold font-inter text-[12px]'>USDC</p>
                </div>
            </div>
            <div>
                <button onClick={handleSave} className='bg-primaryYellow px-6 py-2 rounded-md text-[14px] font-inter'>Save</button>
            </div>
        </div>
    </div>
  )
}

export default EditProjectPage