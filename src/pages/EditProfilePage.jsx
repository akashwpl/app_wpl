import { ArrowLeft, CheckCheck, EyeIcon, Info, Pen, Plus, Search, Upload, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import CustomModal from '../components/ui/CustomModal'
import PoWCard from '../components/profile/PoWCard'
import { useNavigate } from 'react-router-dom';
import { getUserDetails, updateCopperXPatToken } from '../service/api';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL, SKILLS } from '../lib/constants';

import Spinner from '../components/ui/spinner';
import discordSVG from '../assets/svg/discord.svg'
import telegramSVG from '../assets/svg/telegram.svg'
import FancyButton from '../components/ui/FancyButton';
import updateBtn from '../assets/svg/btn_subtract_semi.png'
import updateBtnHoverImg from '../assets/svg/btn_hover_subtract.png'
import saveBtnImg from '../assets/svg/menu_btn_subtract.png'
import saveBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png'
import closeProjBtnImg from '../assets/svg/close_proj_btn_subtract.png'
import closeProjBtnHoverImg from '../assets/svg/close_proj_btn_hover_subtract.png'
import { storage } from '../lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { displaySnackbar } from '../store/thunkMiddleware';
import DropdownSearchList from '../components/form/DropdownSearchList';

const urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:notion\.so|docs\.google\.com|github\.com)\/.+$/;

const EditProfilePage = () => {

    const fileInputRef = useRef(null);
    const { user_id } = useSelector((state) => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    const [dummyProjects, setDummyProjects] = useState([])
    const [showAddProjectModal, setShowAddProjectModal] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [copperxPAT, setCopperxPAT] = useState('')
    const [bio, setBio] = useState('')
    const [discord, setDiscord] = useState('')
    const [telegram, setTelegram] = useState('')
    const [pfpPreview, setPfpPreview] = useState('')
    const [pfp, setPfp] = useState('')

    const [isUpdating, setIsUpdating] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [imgUploadHover, setImgUploadHover] = useState(false)

    const [skills, setSkills] = useState([])
    
    const [projectDetails, setProjectDetails] = useState({
        title: '',
        desc: '',
        skills: [],
        img: null,
        link: '',
        imgPreview: null,
    })
    const [errors, setErrors] = useState({});

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // if (name === 'skills') {
            // const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
            // setProjectDetails(prevState => ({
            //     ...prevState,
            //     [name]: skillsArray,
            // }));
        // } else 
        if (name == 'img') {
        const file = e.target.files[0];
        setProjectDetails(prevState => ({
            ...prevState,
            img: file,
        }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
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
        fileInputRef.current.click()
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

    const handleAddProject = () => {
        if (validateForm()) {
            setDummyProjects([...dummyProjects, projectDetails])
            handleCloseAddProjectModal()
        } else {
          console.log('Form is invalid');
        }
    }

    const handleRemoveImg = () => {
       setPfp(null)
        setPfpPreview('')
    }

    const handleRemoveProjectimg = (idx) => {
        setProjectDetails(prevState => ({
            ...prevState,
            img: '',
            imgPreview: null,
        }))
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
              newErrors[key] = 'Reference link is required';
              isValid = false;
            } else if (!urlRegex.test(projectDetails[key])) {
              newErrors[key] = 'Link should be Notion, Google doc or Github';
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
          } else if (!name?.length) {
            newErrors['displayName'] = 'Name is required';
            isValid = false;
          } else if (!email) {
            newErrors['email'] = 'Email is required';
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

    const handleUploadProject = async () => {
        setIsUpdating(true)
        const transformedProjects = await Promise.all(
            dummyProjects.map(async (project) => {
                // Create a new imageRef for each project
                const imageRef = ref(storage, `images/${project.img?.name}`);
                // Upload the image and get the URL
                await uploadBytes(imageRef, project?.img);
                const imageUrl = await getDownloadURL(imageRef);
        
                // Return the transformed project with the uploaded image URL
                return {
                    project: {
                        title: project.title,
                        organisationHandle: "",
                        description: project.desc,
                        discordLink: project.link,
                        image: imageUrl, // Set the uploaded image URL
                        status: "idle",
                        type: "sample",
                        about: project.desc,
                        skills: project.skills,
                    },
                    milestones: [],
                };
            })
        );
                
        const response = await fetch(`${BASE_URL}/projects/create/multiple`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token_app_wpl')}`
            },
            body: JSON.stringify({projects: transformedProjects})
        }).then(res => res.json())
        .then((data) => {
            console.log('res add project', data)
        }).finally(() => {
            setIsUpdating(false)
        })
    }

    useEffect(() => {
        if(!userDetails) return
        setName(userDetails?.displayName)
        setEmail(userDetails?.email)
        setBio(userDetails?.bio)
        setDiscord(userDetails?.socials?.discord)
        setTelegram(userDetails?.socials?.telegram)
        setUsername(userDetails?.username)
        setCopperxPAT(userDetails?.copperxPatHidden)
    }, [userDetails])

    const handleSubmitEditProfile = async () => {
        
        if(name?.length === 0) {
            setErrors({displayName: 'Name is required'})
            return
        } else if(!email?.length) {
            setErrors({email: 'Email is required'})
            return
        } else if(!bio?.length) {
            setErrors({bio: 'Bio is required'})
            return
        } else if(!discord?.length) {
            setErrors({discord: 'Discord is required'})
            return
        } else if(!telegram?.length) {
            setErrors({telegram: 'Telegram is required'})
            return
        } else if (!username?.length) {
            setErrors({username: 'Username is required'})
            return
        } else if (!copperxPAT?.length) {
            setErrors({copperxPAT: 'CopperX PAT token is required'})
            return
        }

        setErrors({})
        setIsUpdating(true)


        // let imageUrl = userDetails?.pfp

        // if(!pfp) {
        //     const imageRef = ref(storage, `images/${pfp.name}`);
        //     await uploadBytes(imageRef, pfp);
        //     imageUrl = await getDownloadURL(imageRef);
        // }


        const data = {
            "displayName": document.querySelector('input[name="displayName"]').value,
            "bio": document.querySelector('textarea[name="bio"]').value,
            "socials": {
                "discord": document.querySelector('input[name="discordUsername"]').value,
                "telegram": document.querySelector('input[name="telegramUsername"]').value,
            },
            "username": username
        }

        if(pfp) {
            const imageRef = ref(storage, `images/${pfp.name}`);
            await uploadBytes(imageRef, pfp);
            const imageUrl = await getDownloadURL(imageRef);
    
            data.pfp = imageUrl
        } else {
            data.pfp = userDetails?.pfp
        }

        const response = await fetch(`${BASE_URL}/users/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token_app_wpl')}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(() => {
            if(dummyProjects?.length) {
                handleUploadProject()
            }
            if(copperxPAT != userDetails?.copperxPatHidden) {
                handleCopperXPatApi()
            }
        })
        .finally(() => {
            setIsUpdating(false)
            setErrors({})
            dispatch(displaySnackbar('Profile updated successfully'))
        })
    }

    useEffect(() => {
        setProjectDetails(prevState => ({
            ...prevState,
            skills: skills,
        }));
    },[skills])

    const handleCopperXPatApi = async () => {
        const body = {
            pat: copperxPAT
        }
        const res = await updateCopperXPatToken(body)

        if(res?.pat) {
            setCopperxPAT(res?.pat)
        } else {
            dispatch(displaySnackbar('Something went wrong while updating CopperX PAT token'))
        }
    }

  return (
    <div className='flex flex-col justify-center items-center'>
        <div onClick={() => navigate(-1)} className='w-full text-left text-white32 text-[13px] font-medium cursor-pointer border-t border-b border-white7 flex items-center gap-1 py-2 px-20 mt-[1px]'><ArrowLeft size={14} className='text-white32'/> Back to your Profile</div>
        
        <div className='w-[340px] md:w-[480px] mt-10 mb-20'>
            <div className='flex items-center gap-4'>
                {/* <div className='relative'>
                    <img src={userDetails?.pfp} alt='dummy' className='size-[72px] aspect-square'/>
                    <div onClick={handleUploadClick} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><Pen size={14} className='text-black/60'/></div>
                </div> */}

                {pfpPreview ? 
                    <div className='relative'>
                        <img src={pfpPreview} alt='dummy' className='size-[72px] aspect-square'/>
                        <div onClick={handleRemoveImg} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                    </div>
                : <>
                    <div className='bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'>
                        <div className='relative'>
                            <img src={userDetails?.pfp} alt='dummy' className='size-[72px] aspect-square'/>
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

            <div className='h-[1px] w-full bg-white7 my-4'/>

            <div className='mb-4'>
                <div className='flex flex-col gap-4'>
                    <div>
                        <p className="text-[14px] font-inter text-white88">Edit Basic Details</p>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Your Name</label>
                            <input name='displayName' value={name} onChange={(e) => setName(e.target.value)} className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] outline-none ${errors.displayName ? 'border border-cardRedText' : 'border-none'}`}
                                placeholder='John Doe'
                            />
                            {errors.displayName && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.displayName}</div>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Your Email</label>
                            <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] outline-none ${errors.email ? 'border border-cardRedText' : 'border-none'}`} 
                                placeholder='John@Doe.com'
                            />
                            {errors.email && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.email}</div>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-[13px] font-medium text-white32'>Username</label>
                        <input name='email' value={username} onChange={(e) => setUsername(e.target.value)} className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] outline-none ${errors.username ? 'border border-cardRedText' : 'border-none'}`} 
                            placeholder='Johndoe'
                        />
                        {errors.username && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.username}</div>}
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-[13px] font-medium text-white32'>Write your Bio</label>
                        <textarea name='bio' value={bio} onChange={(e) => setBio(e.target.value)} className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] outline-none ${errors.bio ? 'border border-cardRedText' : 'border-none'}`} 
                            placeholder='I am a preety good dev'
                            rows={3}
                        />
                        {errors.bio && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.bio}</div>}
                    </div>

                    {/* For copperX accesstoken */}
                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-[13px] font-medium text-white32'>CopperX Access Token</label>
                        <input name='copperxPAT' value={copperxPAT} type='text' onChange={(e) => setCopperxPAT(e.target.value)} className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] outline-none ${errors.copperxPAT ? 'border border-cardRedText' : 'border-none'}`} 
                            placeholder='super secret stuff here'
                        />
                        {errors.copperxPAT && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.copperxPAT}</div>}
                    </div>
                    {/* <div className='flex items-center justify-between mt-2 bg-white4 rounded-md py-2 px-2'>
                        <input type={isPass ? 'password' : 'text'} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent text-[14px] leading-[19.88px] w-full outline-none border-none text-white88 placeholder:text-white32'/>
                        {isPass ? <EyeIcon className='cursor-pointer mr-3' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> : <EyeOffIcon className='cursor-pointer mr-3' onClick={() => setIsPass(!isPass)} stroke='#FFFFFF52'/> }
                    </div> */}
                </div>

                <div className='h-[1px] w-full bg-white7 my-6'/>

                <div className='flex flex-col gap-4'>
                    <div>
                        <p className="text-[14px] font-inter text-white88">Add social Links</p>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Discord Username</label>
                            <div className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] flex items-center ${errors.discord ? 'border border-cardRedText' : 'border-none'}`}>
                                <img src={discordSVG} alt='discord' className='size-[16px] mr-2'/>
                                <input name='discordUsername' value={discord} onChange={(e) => setDiscord(e.target.value)} className='bg-transparent outline-none w-full text-white placeholder:text-white32' 
                                    placeholder='John Wick'
                                />
                            </div>
                            {errors.discord && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.discord}</div>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='text-[13px] font-medium text-white32'>Telegram Username</label>
                            <div className={`bg-white7 rounded-[6px] text-white placeholder:text-white32 px-3 py-2 text-[14px] flex items-center ${errors.telegram ? 'border border-cardRedText' : 'border-none'}`}>
                                <img src={telegramSVG} alt='telegram' className='size-[16px] mr-2'/>
                                <input name='telegramUsername' value={telegram} onChange={(e) => setTelegram(e.target.value)} className='bg-transparent outline-none w-full text-white placeholder:text-white32 text-[14px]' 
                                    placeholder='John Wick'
                                />
                            </div>
                            {errors.telegram && <div className="mt-[2px] error text-[#FF7373] text-[13px] font-inter">{errors.telegram}</div>}
                        </div>
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

            <div className='flex justify-center items-center w-full overflow-hidden' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <FancyButton 
                    src_img={updateBtn} 
                    hover_src_img={updateBtnHoverImg} 
                    img_size_classes='w-[482px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                    btn_txt={
                        isUpdating ? 
                        <div className='flex justify-center items-center size-full -translate-y-3'>
                            <Spinner /> 
                        </div> :
                        <>
                            <span
                            className={`absolute left-0 -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ${
                                hovered ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
                            }`}
                            >
                            Update profile
                            </span>
                            <span
                            className={`absolute left-full -top-1 w-full h-full flex items-center justify-center transition-transform duration-500 ease-out ${
                                hovered
                                ? "-translate-x-full opacity-100 scale-110"
                                : "translate-x-0 opacity-0"
                            }`}
                            >
                            WAGMI
                            </span>
                        </>
                    }  
                    alt_txt='update profile btn'
                    onClick={handleSubmitEditProfile}
                  />
            </div>
            
        </div>

        {showAddProjectModal &&  
            <CustomModal isOpen={showAddProjectModal} closeModal={handleCloseAddProjectModal}>
                <div className='w-[320px] md:w-[420px] bg-primaryDarkUI rounded-[6px] pb-4 overflow-hidden'>
                    <div className='border-b border-white7 px-4 py-2 flex justify-between items-center'>
                        <p className='text-[14px] text-white/65 font-medium'>Add Project</p>
                        <X onClick={handleCloseAddProjectModal} size={14} className='text-white/65 cursor-pointer'/>
                    </div>

                    <div className='px-4 mt-4'>
                        <div className='flex items-center gap-4'>
                            {projectDetails.imgPreview ? 
                                <div className='relative'>
                                    <img src={projectDetails.imgPreview} alt='dummy' className='size-[72px] aspect-square'/>
                                    <div onClick={handleRemoveProjectimg} className='absolute -top-1 -right-1 bg-white32 rounded-full size-4 flex justify-center items-center cursor-pointer hover:bg-white48'><X size={14} className='text-black/60'/></div>
                                </div>
                            : <>
                                <div 
                                    onClick={handleUploadClick} 
                                    onMouseEnter={() => setImgUploadHover(true)} 
                                    onMouseLeave={() => setImgUploadHover(false)} 
                                    className='relative bg-[#091044] size-[72px] rounded-[8px] border-[3px] border-[#16237F] flex justify-center items-center cursor-pointer'
                                >
                                    <Upload size={16} className={`text-white32 absolute ${imgUploadHover ? "animate-hovered" : ""}`}/>
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
                                <label className='text-[13px] font-medium text-white32'>Add a short description</label>
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
                                <DropdownSearchList dropdownList={SKILLS} setterFunction={setSkills} placeholderText='Add your Skills Eg. Frontend, UI/UX' />
                                {/* <div className={`bg-white7 flex items-center rounded-md px-4 ${errors.skills && 'border-[1px] border-[#FF7373]'}`}>
                                    <Search size={16} className='text-white32'/>
                                    <input className={`bg-transparent outline-none rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] w-full text-white88`} 
                                        placeholder='Frontend, Backend, Fullstack'
                                        name='skills'
                                        onChange={handleChange}
                                    />
                                </div> */}
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
                                <FancyButton 
                                    src_img={closeProjBtnImg} 
                                    hover_src_img={closeProjBtnHoverImg} 
                                    img_size_classes='w-[108px] h-[34px]' 
                                    className='font-gridular text-[14px] leading-[8.82px] text-primaryRed normal-case'
                                    btn_txt={<span className='flex items-center justify-center gap-1'><X size={12}/><span>Cancel</span></span>}  
                                    alt_txt='project apply btn' 
                                    onClick={handleCloseAddProjectModal}
                                />
                                <FancyButton 
                                    src_img={saveBtnImg} 
                                    hover_src_img={saveBtnHoverImg} 
                                    img_size_classes='w-[108px] h-[34px]' 
                                    className='font-gridular text-[12px] leading-[16.8px] text-primaryYellow normal-case'
                                    btn_txt={<span className='flex items-center justify-center gap-1'><CheckCheck size={12}/><span>Add project</span></span>} 
                                    alt_txt='Add personal project btn' 
                                    onClick={handleAddProject}
                                />
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