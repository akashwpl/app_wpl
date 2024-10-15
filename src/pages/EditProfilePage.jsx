import { ArrowLeft, CheckCheck, Info, Plus, Search, Upload, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import CustomModal from '../components/ui/CustomModal'
import PoWCard from '../components/profile/PoWCard'
import { Link } from 'react-router-dom';

const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

const EditProfilePage = () => {

    const fileInputRef = useRef(null);

    const [dummyProjects, setDummyProjects] = useState([])
    const [showAddProjectModal, setShowAddProjectModal] = useState(false)

    const [projectDetails, setProjectDetails] = useState({
        img: '',
        title: '',
        desc: '',
        skills: [],
        link: '',
        imgPreview: null,
    })
    const [errors, setErrors] = useState({});

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'skills') {
            const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
            setProjectDetails(prevState => ({
                ...prevState,
                [name]: skillsArray,
            }));
        } else if (name === 'img') {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProjectDetails(prevState => ({
                    ...prevState,
                    [name]: file,
                }));
                setProjectDetails(prevState => ({
                    ...prevState,
                    imgPreview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
        } else {
            setProjectDetails(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    }

    const handleAddProject = () => {
        if (validateForm()) {
            setDummyProjects([...dummyProjects, projectDetails])
            handleCloseAddProjectModal()
        } else {
          console.log('Form is invalid');
        }
    }

    const handleRemoveImg = () => {
        setProjectDetails(prevState => ({
            ...prevState,
            img: '',
            imgPreview: null,
        }));
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
      
        Object.keys(projectDetails).forEach(key => {
          if (key === 'imgPreview') {
            // Skip validation for imgPreview
            return;
          }
          if (key === 'skills') {
            if (projectDetails[key].length === 0) {
              newErrors[key] = 'Skills are required';
              isValid = false;
            }
          } else if (key === 'link') {
            if (!projectDetails[key]) {
              newErrors[key] = 'Link is required';
              isValid = false;
            } else if (!urlRegex.test(projectDetails[key])) {
              newErrors[key] = 'Invalid Link';
              isValid = false;
            }
          } else if (key === 'img') {
            if (!projectDetails[key] && !projectDetails.imgPreview) {
              newErrors[key] = 'Image is required';
              isValid = false;
            }
          } else if (!projectDetails[key]) {
            newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            isValid = false;
          }
        });
      
        setErrors(newErrors);
        return isValid;
    };

    const handleRemoveProject = (idx) => {
        let newProjects = [...dummyProjects];
        newProjects.splice(idx, 1);
        setDummyProjects(newProjects);
    }

    const handleCloseAddProjectModal = () => {
        setShowAddProjectModal(false)
        setProjectDetails({
            img: '',
            title: '',
            desc: '',
            skills: [],
            link: '',
            imgPreview: null,
        })
        setErrors({})
    }

  return (
    <div className='flex flex-col justify-center items-center'>
        <Link to={'/profile'} className='w-full text-left text-white32 text-[13px] font-medium border-t border-b border-white7 flex items-center gap-1 py-2 px-20 mt-[1px]'><ArrowLeft size={14} className='text-white32'/> Back to your Profile</Link>
        
        <div className='w-[340px] md:w-[480px] mt-2'>
            <div className='flex items-center gap-4'>
                {projectDetails.imgPreview ? 
                    <div className='relative'>
                        <img src={projectDetails.imgPreview} alt='dummy' className='size-[72px] aspect-square'/>
                        <div onClick={handleRemoveImg} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                    </div>
                :   <>
                        <div onClick={handleUploadClick} className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
                            <Upload size={16} className='text-white32'/>
                            <input
                                name='img'
                                type="file"
                                ref={fileInputRef}
                                onChange={handleChange}
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

            <div className='h-[1px] w-full bg-white7 my-4'/>

            <div>
                <div className='flex flex-col gap-4'>
                    <div>
                        <p className="text-[14px] font-inter text-white88">Edit Basic Details</p>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Your Name</label>
                            <input className='bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px]' 
                                placeholder='Jhon Doe'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Your Email</label>
                            <input className='bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px]' 
                                placeholder='Jhon@Doe.com'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-[13px] font-medium text-white32'>Write your Bio (max 240 characters)</label>
                        <textarea className='bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px]' 
                            placeholder='I am a preety fuckin cool dev'
                            rows={3}
                        />
                    </div>
                </div>

                <div className='h-[1px] w-full bg-white7 my-6'/>

                <div className='flex flex-col gap-4'>
                    <div>
                        <p className="text-[14px] font-inter text-white88">Add social Links</p>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Discord Username</label>
                            <input className='bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px]' 
                                placeholder='Jhon Wick'
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Telegram Username</label>
                            <input className='bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px]' 
                                placeholder='Jhon Wick'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-[13px] font-medium text-white32'>Email</label>
                        <input className='bg-white7 rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px]'
                            placeholder='Jhon@Doe.com'
                        />
                    </div>
                </div>

                <div className='h-[1px] w-full bg-white7 my-6'/>

                <div className=''>
                    <p className="text-[14px] font-inter text-white88">Add a Project</p>
                    {dummyProjects?.length ?
                        <div className='mt-3'> 
                            {dummyProjects?.map((project, idx) => (
                                <div key={idx} className='relative'>
                                    <PoWCard data={project} key={idx} />
                                    <div onClick={handleRemoveProject} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                </div>
                            ))}
                        </div> 
                        : 
                        <div className='mt-4'>
                            <p className='text-[#FAF1B1E0] font-gridular leading-5'>Add something you’re proud of!</p>
                            <p className='text-[12px] text-white32 font-medium font-inter'>Adding PoW increases your chances of landing the gig!</p>
                        </div>
                    }
                    <button onClick={() => {setShowAddProjectModal(true)}} className='bg-white7 text-white88 rounded-[6px] h-[42px] flex justify-center items-center mt-4 w-full'>
                        <p className='flex items-center gap-1 text-[12px] font-medium font-inter'>Add {dummyProjects ? 'another' : 'a'} Project <Plus size={16} className='text-white32'/></p>
                    </button>
                </div>
            </div>
        </div>

        {showAddProjectModal &&  
            <CustomModal isOpen={showAddProjectModal} closeModal={handleCloseAddProjectModal}>
                <div className='w-[320px] md:w-[420px] bg-primaryDarkUI rounded-[6px] pb-4'>
                    <div className='border-b border-white7 px-4 py-2 flex justify-between items-center'>
                        <p className='text-[14px] text-white/65 font-medium'>Add Project</p>
                        <X onClick={handleCloseAddProjectModal} size={14} className='text-white/65'/>
                    </div>

                    <div className='px-4 mt-4'>
                        <div className='flex items-center gap-4'>
                            {projectDetails.imgPreview ? 
                                <div className='relative'>
                                    <img src={projectDetails.imgPreview} alt='dummy' className='size-[72px] aspect-square'/>
                                    <div onClick={handleRemoveImg} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                </div>
                            : <>
                                <div onClick={handleUploadClick} className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
                                    <Upload size={16} className='text-white32'/>
                                    <input
                                        name='img'
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleChange}
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
                        {errors.img && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.img}</div>}

                        <div className='mt-4'>
                            <p className='text-[14px] text-white88 font-inter'>Add details</p>
                            <div className='flex flex-col gap-1 w-full mt-3'>
                                <label className='text-[13px] font-medium text-white32'>Project title</label>
                                <input className={`bg-white7 text-white88 outline-none  rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] ${errors.title && 'border-[1px] border-[#FF7373]'}`} 
                                    placeholder='WPL'
                                    name='title'
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.title && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.title}</div>}
                            <div className='flex flex-col gap-1 w-full mt-3'>
                                <label className='text-[13px] font-medium text-white32'>Add a short description (Max 120 characters)</label>
                                <textarea className={`bg-white7 text-white88 outline-none rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] ${errors.desc && 'border-[1px] border-[#FF7373]'}`}
                                    placeholder='I did some shiii, ykwim'
                                    rows={3}
                                    name='desc'
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.desc && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">Description is required</div>}
                            <div className='flex flex-col gap-1 w-full mt-3'>
                                <label className='text-[13px] font-medium text-white32'>Add skills</label>
                                <div className={`bg-white7 flex items-center rounded-md px-4 ${errors.skills && 'border-[1px] border-[#FF7373]'}`}>
                                    <Search size={16} className='text-white32'/>
                                    <input className={`bg-transparent outline-none rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] w-full text-white88`} 
                                        placeholder='Frontend, Backend, Fullstack'
                                        name='skills'
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {errors.skills && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.skills}</div>}

                            <div className='flex flex-col gap-1 w-full mt-3'>
                                <label className='text-[13px] font-medium text-white32'>Add Link</label>
                                <input className={`bg-white7 text-white88 outline-none rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] ${errors.link && 'border-[1px] border-[#FF7373]'}`} 
                                    placeholder='https://example.com'
                                    name='link'
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.link && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter flex items-center gap-1">{errors.link == 'Invalid Link' && <Info fill='#FF7373' size={16} className='text-primaryDarkUI'/>} {errors.link}</div>}
                            <div className='flex justify-end items-center gap-4 w-full mt-8'>
                                <button onClick={handleCloseAddProjectModal} className='bg-white7 rounded-md px-3 py-2 text-[12px] text-white48 font-medium font-inter flex items-center gap-1'>Cancel <X size={14} className='text-white32'/></button>
                                <button 
                                    onClick={handleAddProject} 
                                    className={`
                                        rounded-md px-3 py-2 text-[12px] font-medium font-inter 
                                        flex items-center gap-1 transition-opacity duration-300
                                        bg-[#FAF1B11C] text-[#FAF1B1E0]
                                    `}
                                    >
                                    Add Project <CheckCheck size={14} className=''/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomModal>
        }
    </div>
  )
}

export default EditProfilePage



// validation for btn add project
// ${Object.keys(errors).map((i, idx) => {
//     if (errors[i] !== '') {
//         return false
//     } else {
//         return true
//     }
// }) > 0 
// ? "bg-[#FAF1B11C] text-[#FAF1B1E0] opacity-50" 
// : "bg-[#FAF1B11C] text-[#FAF1B1E0]"
// }  