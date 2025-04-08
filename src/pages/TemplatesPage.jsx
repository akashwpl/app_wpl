import scratch_btn from '../assets/svg/start_from_scratch_template_btn.png'
import scratch_hover_btn from '../assets/svg/start_from_scratch_template_hover_btn.png'
import FancyButton from '../components/ui/FancyButton'

import deep_dive_img from '../assets/svg/template_images/bounty/deep_dive.png'
import ui_ux_review_img from '../assets/svg/template_images/bounty/ui_ux_review.png'
import product_feedback_img from '../assets/svg/template_images/bounty/product_feedback.png'
import twitter_thread_img from '../assets/svg/template_images/bounty/twitter_thread.png'

import frontend_img from '../assets/svg/template_images/projects/frontend.png'
import fullstack_img from '../assets/svg/template_images/projects/fullstack.png'
import backend_img from '../assets/svg/template_images/projects/backend.png'
import hype_video_img from '../assets/svg/template_images/projects/hype_video.png'
import TemplateCard from '../components/ui/TemplateCard'


const template_card_data = {
  bounty: [
    {
      image: deep_dive_img,
      title: "Deep Dive",
      id: "deep_dive"

    },
    {
      image: ui_ux_review_img,
      title: "UI/UX Review",
      id: "ui_ux_review"
    },
    {
      image: product_feedback_img,
      title: "Product Feedback",
      id: "product_feedback"
    },
    {
      image: twitter_thread_img,
      title: "Twitter Thread",
      id: "twitter_thread"
    },
  ],
  project: [
    {
      image: frontend_img,
      title: "Frontend Dev",
      id: "frontend_dev"
    },
    {
      image: fullstack_img,
      title: "Blockchain Full stack Dev",
      id: "blockchain_full_stack"
    },
    {
      image: backend_img,
      title: "Android App Dev",
      id: "android_app_dev"
    },
    {
      image: hype_video_img,
      title: "Hype Video",
      id: "hype_video"
    },
  ],
}

const TemplatesPage = ({isOpenBounty,handleTemplateProjectStates,setIsSelectingTemplate}) => {
  return (
    <div className='w-[710px] h-[687px] flex flex-col justify-center items-center mx-auto bg-[#101C77] py-9 px-12 rounded-md gap-7'>
      <div className='w-full flex flex-col justify-center gap-1.5'>
        <p className='font-gridular text-[24px] text-primaryYellow'>Start with a template</p>
        <p className='font-inter font-medium text-[12px] text-white48'>Save your time and personalize pre-existing templates.</p>
      </div>
      {/* Start from scratch button  */}
      <FancyButton
        src_img={scratch_btn}  
        hover_src_img={scratch_hover_btn}  
        alt_txt='Image alt text'  
        onClick={() => setIsSelectingTemplate(false)} 
        transitionDuration={300}    
      />
      <div className='flex flex-row w-full flex-wrap gap-7'>
        {template_card_data?.[isOpenBounty ? "bounty" : "project"]?.map((cardData) => {
          return <TemplateCard key={cardData?.id} cardData={cardData} handleTemplateProjectStates={handleTemplateProjectStates} />
        })}
      </div>
    </div>
  )
}

export default TemplatesPage