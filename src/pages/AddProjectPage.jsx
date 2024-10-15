import { ArrowLeft, Check, CheckCheckIcon, CheckCircle2, ChevronDown, Menu, Plus, Trash, Trophy, Upload, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import USDCsvg from '../assets/svg/usdc.svg'
import DiscordSvg from '../assets/svg/discord.svg'
import { BASE_URL, getTimestampFromNow } from '../lib/constants'
import { useNavigate } from 'react-router-dom'


const AddProjectPage = () => {

    const fileInputRef = useRef(null);
    const navigate = useNavigate();


    const [title, setTitle] = useState('')
    const [organisationHandle, setOrganisationHandle] = useState('');
    const [description, setDescription] = useState('');
    const [aboutProject, setAboutProject] = useState('');
    const [discordLink, setDiscordLink] = useState('');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [errors, setErrors] = useState({}); // State for validation errors

    const [milestones, setMilestones] = useState([]);

    const [submitted, setSubmitted] = useState(false);
    const [createdProjectId, setCreatedProjectId] = useState(null);

    const validateFields = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Title is required';
        if (!organisationHandle) newErrors.organisationHandle = 'Organisation handle is required';
        if (!description) newErrors.description = 'Description is required';
        if (!discordLink) newErrors.discordLink = 'Discord link is required';
        if (!logo) newErrors.logo = 'Logo is required';
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
        const newMilestoneIndex = milestones.length + 1; // Calculate the new milestone index
        setMilestones([...milestones, { title: `Milestone ${newMilestoneIndex}`, description: '', prize: '', currency: 'USDC', deliveryTime: '', timeUnit: 'Weeks' }]);
    };

    const handleSubmit = async () => {
        
        const updatedMilestones = milestones.map(milestone => ({
            ...milestone,
            timestamp: getTimestampFromNow(`${milestone.deliveryTime} ${milestone.timeUnit?.toLowerCase()}`) // Add timestamp to each milestone
        }));
    
        console.log('updatedMilestones:', updatedMilestones); // Log the timestamps for each milestone

        
        if (validateFields()) {

            const data = {
                "project": {
                    "title": title,
                    "organisationHandle": organisationHandle,
                    "description": description,
                    "discordLink": discordLink,
                    "image": "data:image/jpeg;base64,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",
                    "status": "idle",
                    "about": aboutProject,
                },
                "milestones": updatedMilestones
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
                console.log('Success: project created', data);
                setCreatedProjectId(data?.data?.project?._id);
            })

            console.log('Form submitted');
            setSubmitted(true);
        }
    };

    const handleNavigateToProjectDetails = () => {
        navigate(`/projectdetails/${createdProjectId}`);
    }

    console.log('Milestones:', milestones);

  return (
    <div className='pb-40'>
        <div className='flex items-center gap-1 pl-20 border-b border-white12 py-2'>
            <ArrowLeft size={14} stroke='#ffffff65'/>
            <p className='text-white32 font-inter text-[14px]'>Go back</p>
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
                                                        <div onClick={handleUploadClick} className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
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
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Title of the project</p>
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
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle</p>
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
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add description (240 character)</p>
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
                                        <AccordionTrigger className="text-white48 font-inter hover:no-underline border-b border-primaryYellow">
                                            <div className='flex items-center gap-1'>
                                                <Trophy size={14} className='text-primaryYellow'/>
                                                <div className='text-primaryYellow font-inter text-[14px]'>{milestone.title}</div> {/* Display milestone title */}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="py-2">
                                            <div>
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
                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone budget</p>
                                                    <div className='flex items-center gap-2 w-full'>
                                                        <div className='bg-[#091044] rounded-md py-2 w-[90px] flex justify-center items-center gap-1'>
                                                            <img src={USDCsvg} alt='usdc' className='size-[14px] rounded-sm'/>
                                                            <p className='text-white88 font-semibold font-inter text-[12px]'>{milestone.currency}</p>
                                                        </div>
                                                        <div className='w-full'>
                                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                                <input 
                                                                    type='text' 
                                                                    placeholder='1200' 
                                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                                    value={milestone.prize} 
                                                                    onChange={(e) => handleMilestoneChange(index, 'prize', e.target.value)} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='mt-3'>
                                                    <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Delivery Time</p>
                                                    <div className='flex items-center gap-2 w-full mt-2'>
                                                        <div className='bg-[#091044] rounded-md py-2 w-[90px] flex justify-center items-center gap-1'>
                                                            <select 
                                                                className='bg-transparent text-white88 outline-none border-none w-full'
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
            :   <div className='flex justify-center items-center mt-4'>
                    <div className='max-w-[469px] w-full'>
                        <div className='flex gap-4 border border-dashed border-[#FFFFFF1F] bg-[#FCBF041A] rounded-md px-4 py-3'>
                            <div>
                                <img src={logoPreview} alt='dummy' className='size-[72px] aspect-square rounded-md'/>
                            </div>
                            <div>
                                <p className='text-white88 font-gridular text-[20px] leading-[24px]'>{title}</p>
                                <p className='text-white88 font-semibold text-[13px] font-inter'>@credbii</p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center mt-8'>
                            <div><CheckCircle2 fill='#FBF1B8' strokeWidth={1} size={54}/></div>
                            <div className='text-white font-inter'>Added Project</div>
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
                            <p className='text-white88 text-[12px] font-semibold font-inter'>1200</p>
                            <p className='text-white32 font-semibold font-inter text-[12px]'>USDC</p>
                        </div>
                    </div>
                    <div>
                        <button disabled={submitted} className={`bg-primaryYellow px-6 py-2 rounded-md text-[14px] font-inter flex justify-center items-center gap-1 ${submitted ? "opacity-25" : ""}`} onClick={handleSubmit}><CheckCheckIcon size={20}/> Save</button>
                    </div>
            </div>
    </div>
  )
}

export default AddProjectPage