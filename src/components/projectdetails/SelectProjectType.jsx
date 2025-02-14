import { ArrowLeft, CheckCheck } from "lucide-react"
import FancyButton from "../ui/FancyButton"
import { useNavigate } from "react-router-dom"

import greenBtnHoverImg from '../../assets/svg/green_btn_hover_subtract.png';
import greenBtnImg from '../../assets/svg/green_btn_subtract.png';

import talent_signup_img from '../../assets/images/talent_signup.png'
import contributor_signup_img from '../../assets/images/contributor_signup.png'

import loginBtnHoverImg from '../../assets/svg/btn_hover_subtract.png'
import loginBtnImg from '../../assets/svg/btn_subtract_semi.png'

const SelectProjectType = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='absolute top-10 left-20'>
        <div 
          onClick={() => navigate('/')} 
          className='cursor-pointer text-white88 hover:text-white64 flex items-center gap-1 w-fit'
        >
            <ArrowLeft size={14} className=''/>
            <p className='font-inter text-[14px]'>Go back</p>
        </div>
      </div>
      <div className='flex justify-center items-center gap-14 h-[80vh] mt-24'>
      {/* Apply as Talent */}
      <div className='flex flex-col w-[320px]'>
          <p className='font-gridular text-[24px] text-primaryGreen'>Create a Bounty</p>
          <p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>Bounties are listings where everyone completes a given scope of work, and competes for the prize pool </p>

          <div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
              <img className='w-[290px] h-[250px]' src={talent_signup_img} alt="talent_img" />
              <div className='flex flex-col h-[110px]'>
                  <div className="flex flex-row text-white32 w-full items-center">
                      <CheckCheck className='mr-1'/>
                      <p className='font-medium font-inter text-xs w-full'>Great for awareness campaigns where you want to reach the most people possible</p>
                  </div>
                  <div className="flex flex-row text-white32 w-full items-center">
                      <CheckCheck className='mr-1'/>
                      <p className='font-medium font-inter text-xs w-full'>Get multiple options to choose from</p>
                  </div>
                  <div className="flex flex-row text-white32 w-full items-center">
                      <CheckCheck className='mr-1'/>
                      <p className='font-medium font-inter text-xs w-full'>Examples: Twitter threads, Deep-Dives, Memes, Product Feedback, and more</p>
                  </div>
              </div>
              <FancyButton 
                  src_img={greenBtnImg} 
                  hover_src_img={greenBtnHoverImg} 
                  img_size_classes='w-[500px] h-[44px]' 
                  className='font-gridular text-[14px] leading-[8.82px] text-primaryGreen mt-1.5'
                  btn_txt='Create a bounty'  
                  alt_txt='Add project btn' 
                  onClick={() => {navigate('/addproject')}}
              />
          </div>
      </div>

      {/* Apply as a Contributor */}
      <div className='flex flex-col w-[320px]'>
          <p className='font-gridular text-[24px] text-primaryYellow'>Create a Grant</p>
          <p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>Projects are freelance gigs - people apply with their proposals but don't begin work until you pick them</p>

          <div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
              <img className='w-[290px] h-[250px]' src={contributor_signup_img} alt="talent_img" />
              <div className='flex flex-col h-[110px]'>
                  <div className="flex flex-row text-white32 w-full items-center">
                      <CheckCheck className='mr-1'/>
                      <p className='font-medium font-inter text-xs w-full'>Perfect for work that requires collaboration and iteration</p>
                  </div>
                  <div className="flex flex-row text-white32 w-full items-center">
                      <CheckCheck className='mr-1'/>
                      <p className='font-medium font-inter text-xs w-full'>Single output that is specific to your exact needs</p>
                  </div>
                  <div className="flex flex-row text-white32 w-full items-center">
                      <CheckCheck className='mr-1'/>
                      <p className='font-medium font-inter text-xs w-full'>Examples: Full Stack Development, Hype Video Production, Hiring a Community Manager, and more</p>
                  </div>
              </div>
              <FancyButton 
                  src_img={loginBtnImg} 
                  hover_src_img={loginBtnHoverImg} 
                  img_size_classes='w-[500px] h-[44px]' 
                  className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                  btn_txt='Create a grant'  
                  alt_txt='project apply btn' 
                  onClick={() => {navigate('/addproject')}}
              />
          </div>
      </div>
  </div>
  </>
  )
}

export default SelectProjectType