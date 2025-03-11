import { ArrowLeft, CheckCheck, Menu, Plus, Trash, Trophy, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';

import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import STRKimg from '../assets/images/strk.png';
import btnHoverImg from '../assets/svg/btn_hover_subtract.png';
import btnImg from '../assets/svg/btn_subtract_semi.png';
import saveBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png';
import saveBtnImg from '../assets/svg/menu_btn_subtract.png';
import USDCimg from '../assets/svg/usdc.svg';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";
import FancyButton from '../components/ui/FancyButton';
import { ROLES, website_regex } from '../lib/constants';
import { storage } from '../lib/firebase';
import { createGrant, createNotification, getAdmins, getUserOrgs } from '../service/api';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Spinner from '../components/ui/spinner';

import tickFilledImg from '../assets/icons/pixel-icons/tick-filled.png';
import { displaySnackbar } from '../store/thunkMiddleware';
// import DropdownSearchList from '../components/form/DropdownSearchList';

const AddGrantPage = () => {

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {user_id, user_role} = useSelector((state) => state)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [aboutProject, setAboutProject] = useState('');
    const [grantLink, setGrantLink] = useState('');
    // const [role, setRole] = useState([]);
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [projCurrency, setProjCurrency] = useState('USDC');
    const [errors, setErrors] = useState({}); // State for validation errors

    const [avgGrantSize, setAvgGrantSize] = useState(1);
    const [prizeApproved, setPrizeApproved] = useState(1);
    const [avgResponseTime, setAvgResponseTime] = useState(1);
    const [responseTimeUnit, setResponseTimeUnit] = useState('hours');

    const [submitted, setSubmitted] = useState(false);
    const [createdGrantId, setCreatedGrantId] = useState(null);

    const [isCreatingProject, setIsCreatingProject] = useState(false);

    const [imgUploadHover, setImgUploadHover] = useState(false)

    const [userOrg, setUserOrg] = useState({})

    const {data: userOrganisations, isLoading: isLoadingUserOrgs} = useQuery({
      queryKey: ['userOrganisations', user_id],
      queryFn: () => getUserOrgs(user_id),
      enabled: !!user_id
    })

    useEffect(() => {
      if(!user_id) return
      if(!isLoadingUserOrgs) {
        if(userOrganisations?.length >= 0 && user_role == 'user') {
          dispatch(displaySnackbar('Your Organisation is not yet approved by Admin. Please try again later.'))
          navigate('/')
        } else {
          const approvedOrg = userOrganisations?.filter(org => org.status === 'approved');
          setUserOrg(approvedOrg[0]);
          setLogoPreview(approvedOrg[0]?.img)
        }
      }
    },[isLoadingUserOrgs])

    const validateFields = () => {
        const newErrors = {};
        if (!title) newErrors.title = 'Grant title is required';
        if (title.length > 100) newErrors.title = 'Title cannot exceed 100 characters.';

        if (!userOrg?.organisationHandle) newErrors.organisationHandle = 'Organisation handle is required';
        if (!description) newErrors.description = 'About oganisation is required';
        if (description.length > 1000) newErrors.description = 'About oganisation field cannot exceed 1000 characters.';
 
        if (!logoPreview) newErrors.logo = 'Logo is required';
        // if (!role.length > 0) newErrors.role = 'Role/s is/are required';
        if (!projCurrency) newErrors.projCurrency = 'Prize currency is required';

        if (!avgGrantSize) {
          newErrors.avgGrantSize = 'Field is required';
        } else if(parseInt(avgGrantSize) < 1) {
          newErrors.avgGrantSize = 'Value should be greater than 0'
        }

        if (!prizeApproved) {
          newErrors.prizeApproved = 'Field is required';
        } else if(parseInt(prizeApproved) < 1) {
          newErrors.prizeApproved = 'Value should be greater than 0'
        } else if(parseInt(prizeApproved) > parseInt(avgGrantSize)) {
          newErrors.prizeApproved = 'Value should not be greater than Averge grant size field'
        }

        if (!avgResponseTime) {
          newErrors.avgResponseTime = 'Field is required';
        } else if(parseInt(avgResponseTime) < 1) {
          newErrors.avgResponseTime = 'Value should be greater than 0'
        }

        if (!aboutProject) newErrors.aboutProject = 'Grant description is required';
        if (aboutProject.length > 1000) newErrors.aboutProject = 'Grant description field cannot exceed 1000 characters.';


        if (!grantLink) {
          newErrors.grantLink = 'Grant form link is required';
        } else if(!website_regex.test(grantLink)) {
          newErrors.grantLink = 'Invalid Grant form link provided'
        }

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

    // Firebase image upload code
    const handleFirebaseImgUpload = async () => {
        let imageUrl = '';
        if(logo) {
            const imageRef = ref(storage, `images/${logo.name}`);
            await uploadBytes(imageRef, logo);
            imageUrl = await getDownloadURL(imageRef);
        }
        return imageUrl;
    }

    const handleSubmit = async () => {
      if (validateFields()) {

        setIsCreatingProject(true);

        // Firebase image upload code
        const imageUrl = await handleFirebaseImgUpload();

        const data = {
          "title": title,
          // "organisationHandle": userOrg?.organisationHandle,
          "organisationId": userOrg?._id,
          "description": description,
          "about": aboutProject,
          // "roles": role,
          "image" : imageUrl || userOrg?.img,
          "currency": projCurrency,    // project currency strk or usdc
          "avgGrantSize": parseFloat(avgGrantSize),
          "prizeApproved": parseFloat(prizeApproved),
          "avgResponseTime": parseFloat(avgResponseTime),
          "responseTimeUnit": responseTimeUnit,
          'grantLink': grantLink
        }

        const resp = await createGrant(data);
        console.log('grant Resp',resp);

        if(resp?.grant._id) {
          const notification = {
            msg: `Grant: ${title} is posted on the platform`,
            type: 'grant_req',
            fromId: `${user_id}`,
            project_id: resp?.grant._id
          }

          const adminList = await getAdmins();
          adminList?.data.map(async(admin) => {
            const notiRes = await createNotification({...notification, user_id: admin._id});
          });

          setCreatedGrantId(resp?.grant?._id);
          setIsCreatingProject(false);
          setSubmitted(true);
        } else {
          dispatch(displaySnackbar('Something went wrong. Please try again later.'))
          setIsCreatingProject(false);
        }
      }
    };

    const handleNavigateToGrantsDetails = () => {
      navigate(`/grantdetails/${createdGrantId}`);
    }

  return (
    <div className='pb-40'>
        <div className='flex items-center gap-1 pl-20 py-2'>
            <div onClick={() => navigate('/selectprojecttype')} className='cursor-pointer text-white32 hover:text-white64 flex items-center gap-1 w-fit'>
                <ArrowLeft size={14} className=''/>
                <p className='font-inter text-[14px]'>Go back</p>
            </div>
        </div>

        {!submitted
            ?  <div className='flex justify-center items-center mt-4'>
                    <div className='max-w-[530px] w-full bg-white7 rounded-md px-6 py-2'>
                        
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
                                                            {errors.logo && <p className='text-red-500 font-medium text-[12px]'>{errors.logo}</p>} {/* Error message for logo */}
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            {logoPreview &&
                                                <div onClick={() => {setLogoPreview(null)}} className='flex items-center gap-1 cursor-pointer'><Trash stroke='#E38070' size={15}/> <span className='text-[#E38070] text-[14px] font-inter'>Delete</span></div>
                                            }
                                        </div>

                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Grant title <span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={title} 
                                                    onChange={(e) => setTitle(e.target.value)} 
                                                />
                                            </div>
                                            {errors.title && <p className='text-red-500 font-medium text-[12px]'>{errors.title}</p>} {/* Error message */}
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Organisation handle <span className='text-[#F03D3D]'>*</span></p>
                                            <div className='cursor-not-allowed bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                    type='text' 
                                                    className='cursor-not-allowed bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    value={userOrg?.organisationHandle} 
                                                    disabled
                                                />
                                            </div>
                                            {errors.organisationHandle && <p className='text-red-500 font-medium text-[12px]'>{errors.organisationHandle}</p>} {/* Error message */}
                                        </div>
                                        <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>About the Organisation<span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2'>
                                                <textarea 
                                                    type='text' 
                                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                                    rows={4} 
                                                    value={description} 
                                                    onChange={(e) => setDescription(e.target.value)} 
                                                />
                                            </div>
                                            {errors.description && <p className='text-red-500 font-medium text-[12px]'>{errors.description}</p>} {/* Error message */}
                                        </div>

                                        {/* <div className='mt-3'>
                                            <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Skills needed <span className='text-[#F03D3D]'>*</span></p>
                                            <div className='bg-white7 rounded-md px-3 py-2 cursor-pointer'>
                                            <DropdownSearchList dropdownList={ROLES} setterFunction={setRole} />
                                            </div>
                                            {errors.role && <p className='text-red-500 font-medium text-[12px]'>{errors.role}</p>}
                                        </div> */}

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
                                            {errors.projCurrency && <p className='text-red-500 font-medium text-[12px]'>{errors.projCurrency}</p>}
                                        </div>

                                        {/* Avg Grant size */}
                                        <div className='mt-3'>
                                          <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Average Grant size</p>
                                          <div className='flex items-center gap-2 w-full'>
                                            <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                                              <img src={projCurrency === 'STRK' ? STRKimg : USDCimg} alt='usdc' className='size-[16px] rounded-sm'/>
                                              <p className='text-white88 font-semibold font-inter text-[12px]'>{projCurrency}</p>
                                            </div>
                                            <div className='w-full'>
                                              <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                  type='number' 
                                                  placeholder='1200' 
                                                  className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                  value={avgGrantSize} 
                                                  onChange={(e) => setAvgGrantSize(e.target.value)} 
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {errors.avgGrantSize && <p className='text-red-500 font-medium text-[12px]'>{errors.avgGrantSize}</p>}
                                        </div>

                                        {/* Amount approved so far */}
                                        <div className='mt-3'>
                                          <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Prize approved so far</p>
                                          <div className='flex items-center gap-2 w-full'>
                                            <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                                              <img src={projCurrency === 'STRK' ? STRKimg : USDCimg} alt='usdc' className='size-[16px] rounded-sm'/>
                                              <p className='text-white88 font-semibold font-inter text-[12px]'>{projCurrency}</p>
                                            </div>
                                            <div className='w-full'>
                                              <div className='bg-white7 rounded-md px-3 py-2'>
                                                <input 
                                                  type='number' 
                                                  placeholder='1200' 
                                                  className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                  value={prizeApproved} 
                                                  onChange={(e) => setPrizeApproved(e.target.value)} 
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {errors.prizeApproved && <p className='text-red-500 font-medium text-[12px]'>{errors.prizeApproved}</p>}
                                        </div>

                                        {/* Avg Response time */}
                                        <div className='mt-3'>
                                          <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Average response time</p>
                                          <div className='flex items-center gap-2 w-full mt-2'>
                                            <div className='bg-[#091044] rounded-md p-2 w-[110px] flex justify-center items-center gap-1'>
                                              <select 
                                                className='bg-[#091044] text-white88 outline-none border-none w-full cursor-pointer'
                                                value={responseTimeUnit}
                                                onChange={(e) => setResponseTimeUnit(e.target.value)}
                                              >
                                                <option value="Hours">Hours</option>
                                                <option value="Days">Days</option>
                                              </select>
                                            </div>
                                              <div className='w-full'>
                                                <div className='bg-white7 rounded-md px-3 py-2'>
                                                  <input 
                                                    type='number' 
                                                    placeholder='Enter response time' 
                                                    className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                                                    value={avgResponseTime} 
                                                    onChange={(e) => setAvgResponseTime(e.target.value)} 
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            {errors.avgResponseTime && <p className='text-red-500 font-medium text-[12px]'>{errors.avgResponseTime}</p>}
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
                                <div className='text-primaryYellow font-inter text-[14px]'>Grant Details</div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="py-2">
                              <div>
                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Grant Description <span className='text-[#F03D3D]'>*</span> </p>
                                <div className='bg-white7 rounded-md px-3 py-2'>
                                  <textarea value={aboutProject} onChange={(e) => setAboutProject(e.target.value)} type='text' className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' rows={4}/>
                                </div>
                                {errors?.aboutProject && <p className='text-red-500 font-medium text-[12px]'>{errors?.aboutProject}</p>}
                              </div>

                              <div className='mt-3'>
                                <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Grant form link <span className='text-[#F03D3D]'>*</span></p>
                                <div className='bg-white7 rounded-md px-3 py-2'>
                                  <input 
                                    type='text' 
                                    className='bg-transparent text-white88 placeholder:text-white64 outline-none border-none w-full' 
                                    value={grantLink} 
                                    onChange={(e) => setGrantLink(e.target.value)} 
                                  />
                                </div>
                                {errors.grantLink && <p className='text-red-500 font-medium text-[12px]'>{errors.grantLink}</p>} {/* Error message */}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>                      
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
                                <p className='text-white88 font-semibold text-[13px] font-inter underline'><a href={userOrg?.websiteLink} target='_blank' rel="noopener noreferrer" >@{userOrg?.organisationHandle}</a></p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center items-center mt-8'>
                            <img src={tickFilledImg} alt='tick-filled' className='size-[54px] mb-4'/>
                            <div className='text-white font-inter'>Added Grant</div>
                            <p className='text-white32 text-[13px] text-center font-semibold font-inter'>Congratulations! The Grant is created successfully and will be visible to all users on the platform once approved by Admin.</p>
                        </div>

                        <div className='mt-6'>
                            <FancyButton 
                                src_img={btnImg} 
                                hover_src_img={btnHoverImg} 
                                img_size_classes='w-[490px] h-[44px]' 
                                className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                                btn_txt='view grant' 
                                alt_txt='view grants btn' 
                                onClick={handleNavigateToGrantsDetails}
                            />
                        </div>
                    </div>
                </div>
        }

            <div className='bg-[#091044] px-20 py-4 fixed bottom-0 left-0 w-full flex justify-between items-center z-20'>
                    
                    <div className='flex items-center gap-2'>
                        <p className='text-white88 font-semibold font-inter text-[13px]'>Grant Prize Pool</p>
                        <div className='bg-white4 rounded-md flex items-center gap-1 h-8 px-3'>
                            <img src={projCurrency === 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px]'/>
                            <p className='text-white88 text-[12px] font-semibold font-inter'>{prizeApproved}</p>
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

export default AddGrantPage