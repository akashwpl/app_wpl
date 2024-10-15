import gigProfile from '../../assets/images/gig-profile.png'
import usdc from '../../assets/images/usdc.png'
import { CalendarCheck, Clock, Dot, Trophy, Zap } from 'lucide-react';

const ExploreGigsCard = () => {
  return (
    <div>
        <div className='flex flex-row justify-between items-center my-4'>
            <div className='flex flex-row'>
                <img className='size-14 mr-2' src={gigProfile} alt="Gig Profile Picture" />
                <div className='flex flex-col'>
                    <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48 mb-1'>Credible Finance</p>
                    <p className='font-gridular text-[16px] leading-[19.2px] text-white88 mb-3'>Regional finance ambassador USA 🇺🇸</p>
                    <div className='flex flex-row text-white32 justify-between w-[450px]'>
                        <Clock size={14} />
                        <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Due in 12h</p>
                        <Dot size={14} />
                        <Trophy size={14} />
                        <p className='font-inter font-medium text-[12px] leading-[14.4px]'>2 Comment</p>
                        <Dot size={14} />
                        <CalendarCheck size={14} />
                        <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Delivery time: 2 weeks</p>
                        <Dot size={14} />
                        <Zap size={14} color='#FCBF04' />
                        <p className='font-inter font-medium text-cardYellowText text-[12px] leading-[14.4px]'>Bounty</p>
                    </div>
                </div>
            </div>

            <div className='w-[130px] h-[19px] flex flex-row justify-evenly items-center font-gridular font-[16px] leading-[19.2px]'>
                <img className='h-[16px]' src={usdc} alt="" />
                <p className='text-white88'>1200</p>
                <p className='text-white48'> USDC</p>
            </div>
        </div>
        <div className=' border border-x-0 border-t-0 border-b-white7'></div>
    </div>
  )
}

export default ExploreGigsCard