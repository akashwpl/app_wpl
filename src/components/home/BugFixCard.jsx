import { Clock, Hourglass, Zap } from 'lucide-react'
import wpl_pr_details from '../../assets/images/wpl_prdetails.png'

const BugFixCard = () => {
  return (
    <div className='flex flex-col justify-between w-full h-[226px] bg-cardBlueBg rounded-md mb-6'>
      <div className='flex flex-row justify-between px-4 mt-3'>
            <img width={40} src={wpl_pr_details} alt="WPL PR details" />
            <div className='flex flex-row justify-evenly text-cardBlueText bg-[#233579] w-32 h-[20px] items-center rounded-md'>
                <Zap size={12} />
                <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Currently doing</p>
            </div>
        </div>
        <p className='text-[16px] text-cardBlueText font-gridular leading-[19.2px] px-4'>Fixing bugs in WPL code</p>
        <p className='text-[13px] text-white48 font-inter leading-[15.6px] font-medium px-4'>We're looking for a full-time Frontend Engineer to supercharge our presence</p>
        <div className='border border-white12 border-dashed w-full'></div>
        <div className='flex flex-row justify-between text-white32 px-4'>
          <div className='flex flex-row'>
            <Clock size={14}/>
            <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Progress</p>
          </div>
          <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>Milestone 2 in progress</p>
        </div>
        <div className=' w-full'></div>
        <div className='flex flex-row justify-between items-center px-4  text-white32 bg-white4 w-full h-[42px] border border-white12 border-dashed'>
          <div className='flex flex-row'>
            <Hourglass size={14}/>
            <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Deadline</p>
          </div>
          <p className='text-[13px] text-white font-inter leading-[15.6px] font-medium'>2d 12h</p>
        </div>
    </div>
  )
}

export default BugFixCard