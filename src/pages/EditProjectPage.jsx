import { ArrowLeft, ChevronDown, Menu, Plus, Trash, Trophy, Upload, X } from 'lucide-react'
import React, { useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"
import USDCsvg from '../assets/svg/usdc.svg'
import DiscordSvg from '../assets/svg/discord.svg'
import { getProjectDetails } from '../service/api'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'


const EditProjectPage = () => {
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

    const handleSave = () => {
        if (validateFields()) {
            // Proceed with saving the data
            alert('Data is valid and can be saved.');
        }
    };

    console.log('projectDetails', projectDetails);

    // http://139.59.58.53:3000/projects/update/670697df9143fef611d24903

  return (
    <div className='mb-20'>
        <div className='flex items-center gap-1 pl-20 border-b border-white12 py-2'>
            <ArrowLeft size={14} stroke='#ffffff65'/>
            <p className='text-white32 font-inter text-[14px]'>Go back</p>
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
                    {projectDetails?.milestones?.map((milestone, index) => (
                           <Accordion type="single" defaultValue="item-3" collapsible>
                           <AccordionItem value={`item-${3}`} key={3} className="border-none">
                               <AccordionTrigger className="text-white48 font-inter hover:no-underline border-b border-primaryYellow">
                                   <div className='flex items-center gap-1'>
                                       <Trophy size={14} className='text-primaryYellow'/>
                                       <div className='text-primaryYellow font-inter text-[14px]'>Milestone {index + 1}</div>
                                   </div>
                               </AccordionTrigger>
                               <AccordionContent className="py-2">
                                   <div>
                                        <div className='my-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Title</p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input
                                                    type='text'
                                                    
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full'
                                                />
                                            </div>
                                            {errors.organisationHandle && <p className='text-[10px] font-medium text-red-500'>{errors.organisationHandle}</p>}
                                        </div>
                                       <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Add Milestone goals</p>
                                       <div className='bg-white7 rounded-md px-3 py-2'>
                                           <textarea type='text' className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}/>
                                       </div>
                                       <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Milestone budget</p>
                                            <div className='flex items-center gap-2 w-full'>
                                                <div className='bg-[#091044] rounded-md py-2 w-[90px] flex justify-center items-center gap-1'>
                                                    <img src={USDCsvg} alt='usdc' className='size-[14px] rounded-sm'/>
                                                    <p className='text-white88 font-semibold font-inter text-[12px]'>USDC</p>
                                                </div>
                                                <div className='w-full'>
                                                    <div className='bg-white7 rounded-md px-3 py-2'>
                                                        <input type='text' placeholder='1200' className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'/>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                       </div>
                                       <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Set Time</p>
                                            <div className='flex items-center gap-2 w-full mt-2'>
                                                <div className='bg-[#091044] rounded-md py-2 w-[90px] flex justify-center items-center gap-1'>
                                                    <p className='text-white88 font-semibold font-inter text-[12px]'>Weeks</p>
                                                    <ChevronDown size={14} className='text-white88'/>
                                                </div>
                                                <div className='w-full'>
                                                    <div className='bg-white7 rounded-md px-3 py-2'>
                                                        <input type='text' placeholder='1200' className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'/>
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
                    <button className='flex justify-center items-center w-full border border-primaryYellow h-[43px]'>
                        <Plus size={14} className='text-primaryYellow'/>
                        <p className='text-primaryYellow font-gridular text-[14px]'>Add milestone</p>
                    </button>
                </div>                      
            </div>
        </div>

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
                <button onClick={handleSave} className='bg-primaryYellow px-6 py-2 rounded-md text-[14px] font-inter'>Save</button>
            </div>
        </div>
    </div>
  )
}

export default EditProjectPage


const milestones = [
    {
        title: 'Milestone 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget eget.',
        prize: 1000,
        currency: 'USDC',
        deliveryTime: '1 week',
    },
    {
        title: 'Milestone 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget eget.',
        prize: 1000,
        currency: 'USDC',
        deliveryTime: '1 week',
    },
]