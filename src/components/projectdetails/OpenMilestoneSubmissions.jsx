import { createNotification, updOpenMilestoneSubmissions } from "../../service/api";
import CustomModal from "../ui/CustomModal"
import FancyButton from "../ui/FancyButton";
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png'
import btnImg from '../../assets/svg/btn_subtract_semi.png'
import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { useSelector } from "react-redux";
import SeletecUserCheckPng from '../../assets/images/selected_user_check.png'

const OpenMilestoneSubmissions = ({submission,index,submission_count, projectStatus, milestoneStatus, username, refetchProjectDetails, canSelectWinners, selectedWinners, handleAddRemoveSelectedWinner}) => {
  const { user_id } = useSelector((state) => state)
  const [showMilestoneSubmissionModal, setShowOpenMilestoneSubmissionModal] = useState(false);

  const handleOpenMileStoneSponsorAction = async () => {
    const data = {
      status: "accepted"
    }
    
    const res = await updOpenMilestoneSubmissions(submission?._id, data);    

    if(res?._id) {
      const notiObj = {
          msg: `${username} has accepted your milestone submission...`,
          type: 'project_req',
          fromId: user_id,
          project_id: submission?.project_id,
          user_id: submission?.user_id
      }
      const notiRes = await createNotification(notiObj)
      setShowOpenMilestoneSubmissionModal(false);
    }
    refetchProjectDetails()
  }


  return (
    <>
      <div onClick={() => setShowOpenMilestoneSubmissionModal(true)} key={index} className={`grid grid-cols-12 gap-2 py-2 rounded-sm hover:bg-white4 cursor-pointer ${selectedWinners?.find((user) => user?._id == submission?._id) ? "bg-[#0ED0651A]" : ""} ${index === submission_count ? "" : "border-b border-white7"}`}>
        {canSelectWinners && <div onClick={(e) => {handleAddRemoveSelectedWinner(e, submission)}} className='text-[14px] col-span-1 px-2 pl-4 text-white88 font-inter flex items-center'>
          {selectedWinners?.find((user) => user?._id == submission?._id) ? <img src={SeletecUserCheckPng} className="size-[15px]"/> : <div className="border border-white48 size-[15px] rounded-[4px]"/>}
          </div>
        }
        <div className='text-[14px] col-span-1  text-white88 font-inter'>{index + 1}</div>
        <div className='text-[14px] col-span-2 text-start text-white88 font-inter'>{submission?.user?.displayName}</div>
        <div className='text-[14px] col-span-4 text-white88 font-inter'>{submission?.submissionLink}</div>
        <div className={`text-[14px] ${canSelectWinners ? "col-span-4" : "col-span-5"} text-white88 font-inter truncate`}>{submission?.submissionDescription}</div>
      </div>

      <CustomModal isOpen={showMilestoneSubmissionModal} closeModal={() => setShowOpenMilestoneSubmissionModal(false)}>
        <div className='bg-primaryDarkUI border border-white4 rounded-md w-[500px] p-3'>
            <div className='flex justify-end'><X size={20} onClick={() => setShowOpenMilestoneSubmissionModal(false)}  className='text-white88 hover:text-white64 cursor-pointer'/></div>
            <div>
                <p className='text-primaryYellow font-semibold font-gridular'>Submission details</p>
                <div className='h-[1px] bg-primaryYellow w-full mt-2 mb-5'/>
                <div className='flex flex-col'>
                    <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Link</label>
                    <a href={submission?.submissionLink} rel="noopener noreferrer" target='_blank' className='bg-white12 text-white88 py-1 px-2 rounded-md w-full underline'>{submission?.submissionLink} <ExternalLink className="inline size-4" /></a>
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1'>Description</label>
                    <textarea rows={4} value={submission?.submissionDescription} className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' placeholder='Fixed UI Bug'/>
                </div>
            </div>

            <div>
              {
                projectStatus != 'closed' &&
                milestoneStatus != 'completed'
                ? <div className='flex justify-center mt-6 items-center gap-2'>
                    <FancyButton 
                        src_img={btnImg} 
                        hover_src_img={btnHoverImg} 
                        img_size_classes='w-[190px] h-[44px]' 
                        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                        btn_txt='accept'
                        alt_txt='project apply btn' 
                        onClick={() => handleOpenMileStoneSponsorAction('accept')}
                        />
                </div>
                : ""
              }
            </div>
        </div>
      </CustomModal>
    </>
  )
}

export default OpenMilestoneSubmissions