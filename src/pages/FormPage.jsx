import { AlignLeft, Hourglass, Info } from 'lucide-react'
import headerPng from '../assets/images/prdetails_header.png'
import wpllogo from '../assets/images/wpl_prdetails.png'
import wplwolfLogo from '../assets/svg/wolf_logo.svg'

import { useEffect, useState } from 'react';

import checkTick from '../assets/images/check-tick.png'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { applyForProject, createNotification, getProjectDetails, getProjectSubmissions, getUserDetails } from '../service/api';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import FancyButton from '../components/ui/FancyButton'
import btnImg from '../assets/svg/btn_subtract_semi.png'
import btnHoverImg from '../assets/svg/btn_hover_subtract.png'
import { isValidStarkNetAddress } from '../lib/constants';

const whitespaceRegex = /^\s*$/;
const emailIdRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const addressRegex = /^(0x)[0-9a-fA-F]{40}$/;

const FormPage = () => {

  const { id } = useParams();
  const navigate = useNavigate()

  const { user_id } = useSelector((state) => state)

  const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })
  
  const {data: projectDetails, isLoading: isLoadingProjectDetails} = useQuery({
    queryKey: ['projectDetails', id],
    queryFn: () => getProjectDetails(id),
    enabled: !!id
  })

  const {data: projectSubmissions, isLoading: isLoadinProjectSubmissions} = useQuery({
    queryKey: ['projectSubmissions', id],
    queryFn: () => getProjectSubmissions(id),
    enabled: !!id
  })

  const submittedDetails = () => {
    return(
      <div className='flex flex-col justify-evenly gap-4 h-[230px] items-center'>
        <div className='h-[1px] w-full bg-white7'/>
        <img width={60} src={checkTick} alt="" />
        <div className='flex flex-col items-center gap-1'>
          <p className='font-inter text-[16px] leading-[22px] text-white'>Submitted details</p>
          <p className='text-[13px] leading-[15.6px] font-medium text-white32'>Explore other bounties/projects that you can help.</p>
        </div>
        <FancyButton 
          src_img={btnImg}
          hover_src_img={btnHoverImg}
          img_size_classes='w-[496px] h-[44px]'
          btn_txt='Explore Projects'
          alt_txt='explore projects button'
          className='font-gridular text-[14px] leading-[20px] text-primaryYellow'
          onClick={() => navigate('/allprojects')}
          transitionDuration={500}
        />
        {/* <button className='w-full text-white48 font-gridular text-[14px] leading-[20px] bg-cardBlueBg h-[43px]'
          onClick={() => {
            
          }}
        >
          Explore Projects
        </button> */}
      </div>
    )
  }

  const [errors, setErrors] = useState({});
  const [isSubmitDone, setIsSubmitDone] = useState(false);
  const [formData, setFormData] = useState({
    username:'',
    emailId: '',
    appExp: '',
    // ercAddress: '',
    gitTeammates: []
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(name == 'gitTeammates') return;
      setFormData((prevdata) => ({...prevdata,[name]: value}))
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
    }));
  }

  const handleSubmitForm = async () => {
    if(validateForm()) {

      const data = {
        name: userDetails?.displayName,
        email: userDetails?.email,
        userId: user_id,
        projectId: id,
        teammates: formData.gitTeammates,
        portfolioLink: formData.portfolioLink,
        experienceDescription: formData.appExp,
        // walletAddress: formData.ercAddress,
        status: 'submitted'
      }

      const res = await applyForProject(projectDetails._id, data);
      if(res?.err === "user has already submitted a proposal") {
        alert(res.err);
        navigate(-1); 
      }
      
      if(res?._id) {
        const notiObj = {
          msg: `${userDetails.displayName} has applied for a project.`,
          type: 'project_req',
          fromId: user_id,
          user_id: projectDetails.owner_id,
          project_id: projectDetails._id
        }
        const notiRes = await createNotification(notiObj);
        setIsSubmitDone(true)
      }
    }
  }

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
  
    Object.keys(formData).forEach(key => {
      if (key === 'gitTeammates') {
        // skip validation for Github teammates
        return;
      }
      const value = formData[key] || document.getElementById(key)?.value || '';
      if (key === 'emailId') {
        if (!value) {
          newErrors[key] = 'Email is required';
          isValid = false;
        } else if (!emailIdRegex.test(value)) {
          newErrors[key] = 'Invalid Email';
          isValid = false;
        }
      // } else if (key === 'ercAddress') {
      //   if (!value) {
      //     newErrors[key] = 'Address is required';
      //     isValid = false;
      //   } else if (!isValidStarkNetAddress(value)) {
      //     newErrors[key] = 'Invalid Starknet wallet address';
      //     isValid = false;
      //   }
      } else if (key === 'appExp') {
        if (!value || whitespaceRegex.test(value)) {
          newErrors[key] = 'Field is required';
          isValid = false;
        }
      } else if (!value || whitespaceRegex.test(value)) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    setIsSubmitDone(false); 
    setFormData({
      username:'',
      emailId: '',
      appExp: '',
      // ercAddress: '',
      gitTeammates: []
    })
    setErrors({})
  }, []);

  return (
    <div className='overflow-x-hidden flex flex-col'>
      <div>
        <img src={headerPng} alt='header' className='h-[200px] w-full'/>
      </div>

        <div className='flex flex-col justify-center items-center'>
          <div className='w-[360px] md:w-[496px]'>
            
            <div className='-translate-y-8'>
              <img src={projectDetails?.image} alt="WPL Logo" className='size-[72px] rounded-[8px]'/>
            </div>

            <div>
              <p className='font-gridular text-[24px] leading-[28.8px] text-primaryYellow mb-2'>
                {projectDetails?.title}
              </p>
              <p className='font-inter text-[14px] leading-[20px] text-white32 mb-3'>
                { projectDetails?.organisationHandle}
              </p>
              <div className='flex flex-row gap-2 font-inter text-[14px] leading-[20px] text-white32'>
                <p><span className='text-white88'>136</span> Interested</p>
                {isLoadinProjectSubmissions ? <Hourglass size={12} /> : <span className='text-white88'>{projectSubmissions?.length}</span>} Submissions
              </div>
            </div>  

            {
              isSubmitDone ?
              submittedDetails() :
              <div className='mt-2'>
                <div>
                    <div className='flex flex-col gap-4 font-inter'>
                        <div className='mt-8 flex flex-row items-center gap-1 text-primaryYellow'>
                          <AlignLeft size={16} />
                          <p className="text-[14px] leading-[20px]">Fill the Information</p>
                        </div>
                        <div className='h-[1px] w-full bg-primaryYellow'/>
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col gap-1 w-40 md:w-full'>
                                <label 
                                  htmlFor='username'
                                  className='text-[13px] leading-[15.6px] font-medium text-white32'
                                >
                                  Your Name {errors.username && <span className='text-errorMsgRedText'>*</span>}
                                </label>
                                <input 
                                  defaultValue={userDetails?.displayName}
                                  className={`bg-white7 rounded-[6px] cursor-not-allowed text-white88 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.username && 'border border-errorMsgRedText'}`} 
                                  placeholder='Jhon Doe'
                                  name='username'
                                  id='username'
                                  onChange={handleChange}
                                  readOnly
                                />
                                {errors.username && 
                                  <div className='flex gap-1 items-center'>
                                    <Info fill='#FF7373' size={16}  className='' />
                                    <p className='font-inter font-medium text-errorMsgRedText text-[12px] leading-[14.4px]'>{errors.username}</p>
                                  </div>
                                }
                            </div>
                            <div className='flex flex-col gap-1 w-44 md:w-full'>
                                <label 
                                  htmlFor='emailId' 
                                  className='text-[13px] leading-[15.6px] font-medium text-white32'
                                >
                                  Your Email {errors.emailId && <span className='text-errorMsgRedText'>*</span>}
                                </label>
                                <input 
                                  defaultValue={userDetails?.email}
                                  className={`bg-white7 rounded-[6px] cursor-not-allowed text-white88 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.emailId && 'border border-errorMsgRedText'}`}
                                  placeholder='Jhon@Doe.com'
                                  name='emailId'
                                  id='emailId'
                                  onChange={handleChange}
                                  readOnly
                                />
                                {errors.emailId && 
                                  <div className='flex gap-1 items-center'>
                                    <Info fill='#FF7373' size={16}  className='' />
                                    <p className='font-inter font-medium text-errorMsgRedText text-[12px] leading-[14.4px]'>{errors.emailId}</p>
                                  </div>
                                }
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label 
                              htmlFor='appExp' 
                              className='text-[13px] leading-[15.6px] font-medium text-white32'
                            >
                              Elaborate how would you approach completing this bounty {errors.username && <span className='text-errorMsgRedText'>*</span>}
                            </label>
                            <textarea 
                              className={`bg-white7 rounded-[6px] text-white88 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.appExp && 'border border-errorMsgRedText'}`}
                              placeholder='I am a preety good dev'
                              rows={3}
                              name='appExp'
                              id='appExp'
                              onChange={handleChange}
                            />
                            {errors.appExp && 
                              <div className='flex gap-1 items-center'>
                                <Info fill='#FF7373' size={16}  className='' />
                                <p className='font-inter font-medium text-errorMsgRedText text-[12px] leading-[14.4px]'>{errors.appExp}</p>
                              </div>
                            }
                        </div>

                        <div className='flex flex-col gap-1 w-44 md:w-full'>
                          <label 
                            htmlFor='emailId' 
                            className='text-[13px] leading-[15.6px] font-medium text-white32'
                          >
                            Portfolio link
                          </label>
                          <input 
                            className={`bg-white7 rounded-[6px] text-white88 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}
                            placeholder='https://www.johndoe.com'
                            name='portfolioLink'
                            id='portfolioLinkid'
                            onChange={handleChange}
                          />
                        </div>

                        {/* <div className='flex flex-col gap-1 w-full'>
                            <label 
                              htmlFor='ercAddress' 
                              className='text-[13px] leading-[15.6px] font-medium text-white32'
                            >
                              Enter your Starknet wallet address {errors.username && <span className='text-errorMsgRedText'>*</span>}
                            </label>
                            <input 
                              defaultValue={userDetails?.walletAddress}
                              className={`bg-white7 rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.ercAddress ? 'border border-errorMsgRedText text-errorMsgRedText' : 'text-white88'}`}
                              placeholder='0xabc1234....'
                              name='ercAddress'
                              id='ercAddress'
                              onChange={handleChange}
                            />
                            {errors.ercAddress && 
                              <div className='flex gap-1 items-center'>
                                <Info fill='#FF7373' size={16}  className='' />
                                <p className='font-inter font-medium text-errorMsgRedText text-[12px] leading-[14.4px]'>{errors.ercAddress}</p>
                              </div>
                            }
                        </div> */}
                        
                        <div className="mb-56">
                          <FancyButton 
                            src_img={btnImg}
                            hover_src_img={btnHoverImg}
                            img_size_classes='w-[496px] h-[44px]'
                            btn_txt='Submit'
                            alt_txt='apply project form submit button'
                            className='font-gridular text-[14px] leading-[20px] text-primaryYellow'
                            onClick={handleSubmitForm}
                            transitionDuration={500}
                          />
                        </div>
                    </div>

                </div>
              </div>
            }
          </div>
        </div>

    </div>
  )
}

export default FormPage