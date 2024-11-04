import { useNavigate } from 'react-router-dom';
import usdc from '../../assets/images/usdc.png'
import { CalendarCheck, Clock, Dot, Trophy, Zap } from 'lucide-react';

const ExploreGigsCard = ({data, type}) => {
    const navigate = useNavigate()

    const navigateToProjectDetails = () => {
        navigate(`/projectdetails/${data?._id}`)
    }

  return (
    <div onClick={navigateToProjectDetails} className='cursor-pointer py-2 flex items-center w-full'>
        <div className='flex flex-row justify-between items-center w-full'>
            <div className='flex flex-row'>
                <img className='size-16 mr-2 rounded-2xl' src={data?.image} alt="Gig Profile Picture"/>
                <div className='flex flex-col'>
                    <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48 mb-1'>{data?.organisationHandle}</p>
                    <p className='font-gridular text-[16px] leading-[19.2px] text-white88 mb-3'>{data?.title}</p>
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

            <div className='w-[120px] flex flex-row justify-evenly items-center font-gridular leading-[19.2px] bg-[#091044] py-2 rounded-md'>
                <img className='h-[16px]' src={usdc} alt="" />
                <p className='text-[14px] font-inter text-white88'>1200</p>
                <p className='text-[14px] font-semibold text-white48'> USDC</p>
            </div>
        </div>
    </div>
  )
}

export default ExploreGigsCard