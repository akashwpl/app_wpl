import { AlignLeft, Info } from 'lucide-react'
import headerPng from '../assets/images/prdetails_header.png'
import wpllogo from '../assets/images/wpl_prdetails.png'
import { useEffect, useState } from 'react';

import checkTick from '../assets/images/check-tick.png'
import { useNavigate } from 'react-router-dom';
import GithubTeamSearchBox from '../components/form/GithubTeamSearchBox';

import akashProfile from '../assets/dummy/akash_profile.png'
import sumeetProfile from '../assets/dummy/sumeet_profile.png'
import rahulProfile from '../assets/dummy/rahul_profile.png'

const whitespaceRegex = /^\s*$/;
const emailIdRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const addressRegex = /^(0x)[0-9a-fA-F]{40}$/;

const githubTeammatesList = [
  {
    img: rahulProfile,
    username: 'Rahul Bhadoriya',
    githubId: 'rahuldesignweb3'
  },
  {
    img: akashProfile,
    username: 'Akash Behera',
    githubId: 'razerghostt'
  },
  {
    img: sumeetProfile,
    username: 'Sumeet Shelar',
    githubId: 'sumeetshelar99'
  }
]

const FormPage = () => {

  const navigate = useNavigate();

  const submittedDetails = () => {
    return(
      <div className='flex flex-col justify-evenly gap-4 h-[230px] items-center'>
        <div className='h-[1px] w-full bg-white7'/>
        <img width={60} src={checkTick} alt="" />
        <div className='flex flex-col items-center gap-1'>
          <p className='font-inter text-[16px] leading-[22px] text-white'>Submitted details</p>
          <p className='text-[13px] leading-[15.6px] font-medium text-white32'>Explore other bounties/projects that you can help.</p>
        </div>
        <button className='w-full text-white48 font-gridular text-[14px] leading-[20px] bg-cardBlueBg h-[43px]'
          onClick={() => {
            navigate('/')
          }}
        >
          Explore Projects
        </button>
      </div>
    )
  }

  const [errors, setErrors] = useState({});
  const [isSubmitDone, setIsSubmitDone] = useState(false);
  const [formData, setFormData] = useState({
    username:'',
    emailId: '',
    appExp: '',
    ercAddress: '',
    gitTeammates: []
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(name == 'gitTeammates') return;
      setFormData((prevdata) => ({...prevdata,[name]: value}))
      console.log(formData);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
    }));
  }

  const handleSubmitForm = () => {
    if(validateForm()) {
      setIsSubmitDone(true)
    } else {
      console.log('Invalid form');
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
      if (key === 'emailId') {
        if (!formData[key]) {
          newErrors[key] = 'Email is required';
          isValid = false;
        } else if (!emailIdRegex.test(formData[key])) {
          newErrors[key] = 'Invalid Email';
          isValid = false;
        }
      } else if (key === 'ercAddress') {
        if (!formData[key]) {
          newErrors[key] = 'Address is required';
          isValid = false;
        } else if (!addressRegex.test(formData[key])) {
          newErrors[key] = 'Invalid Address';
          isValid = false;
        }
      } else if (key === 'appExp') {
        if (!formData[key] || whitespaceRegex.test(formData[key])) {
          newErrors[key] = 'Field is required';
          isValid = false;
        }
      } else if (!formData[key] || whitespaceRegex.test(formData[key])) {
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
      ercAddress: '',
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
              <img src={wpllogo} alt="WPL Logo" className='size-[72px]'/>
            </div>

            <div>
              <p className='font-gridular text-[24px] leading-[28.8px] text-primaryYellow mb-2'>A follow along guide for shipping blinks</p>
              <p className='font-inter text-[14px] leading-[20px] text-white32 mb-3'>@Crediblefi</p>
              <div className='flex flex-row gap-2 font-inter text-[14px] leading-[20px] text-white32'>
                <p><span className='text-white88'>136</span> Interested</p>
                <p><span className='text-white88'>1.99k</span> Submissions</p>
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
                                  className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.username && 'border border-errorMsgRedText'}`} 
                                  placeholder='Jhon Doe'
                                  name='username'
                                  id='username'
                                  onChange={handleChange}
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
                                  className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.emailId && 'border border-errorMsgRedText'}`}
                                  placeholder='Jhon@Doe.com'
                                  name='emailId'
                                  id='emailId'
                                  onChange={handleChange}
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
                              Do you have experience designing application? {errors.username && <span className='text-errorMsgRedText'>*</span>}
                            </label>
                            <textarea 
                              className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.appExp && 'border border-errorMsgRedText'}`}
                              placeholder='I am a preety fuckin cool dev'
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

                        <div className='flex flex-col gap-1 w-full'>
                            <label 
                              htmlFor='ercAddress' 
                              className='text-[13px] leading-[15.6px] font-medium text-white32'
                            >
                              Enter your ERC-20 Address {errors.username && <span className='text-errorMsgRedText'>*</span>}
                            </label>
                            <input 
                              className={`bg-white7 rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 ${errors.ercAddress ? 'border border-errorMsgRedText text-errorMsgRedText' : 'text-white48'}`}
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
                        </div>
                        <GithubTeamSearchBox teamList={githubTeammatesList} />
                        <button 
                          className='w-full text-white48 text-[14px] leading-[20px] bg-cardBlueBg h-[43px] mb-56' 
                          onClick={handleSubmitForm}
                        >
                          Submit
                        </button>

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