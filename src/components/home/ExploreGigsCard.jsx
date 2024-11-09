import { useNavigate } from 'react-router-dom';
import usdc from '../../assets/images/usdc.png'
import { CalendarCheck, Clock, Dot, Trophy, Zap } from 'lucide-react';

const ExploreGigsCard = ({data, type, projectsGridView}) => {
    const navigate = useNavigate()


    const navigateToProjectDetails = () => {
        navigate(`/projectdetails/${data?._id}`)
    }

  return (
    <div onClick={navigateToProjectDetails} className={`cursor-pointer py-2 flex items-center w-full ml-2 ${projectsGridView ? "hover:bg-white4 bg-[#050E52] rounded-md p-2" : ""} relative`}>
        <div className={`flex flex-row justify-between ${projectsGridView ? "items-start" : "items-center"} w-full`}>
            <div className={`${projectsGridView ? "flex-col pl-4 py-4" : "flex-row"} flex `}>
                <img className='size-16 mr-2 rounded-2xl mb-2' src={data?.image} alt="Gig Profile Picture"/>
                <div className='flex flex-col w-full'>
                    <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48 mb-1'>{data?.organisationHandle}</p>
                    <p className='font-gridular text-[16px] leading-[19.2px] text-white88 mb-3'>{data?.title}</p>     
                    <div className={`flex flex-row ${projectsGridView ? 'flex-col' : "flex-row"} gap-2 text-white32 w-full mt-1`}>
                        <div className={`flex items-center gap-1 ${projectsGridView ? "mt-2" : ""}`}>
                            <Clock size={14} />
                            <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Due in <span className='text-white64'>{data?.deadline}</span></p>
                            <Dot size={14} />
                            <CalendarCheck size={14} />
                            <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Delivery time: <span className='text-white64'>2 weeks</span></p>
                            {!projectsGridView && <Dot size={14} />}
                        </div>
                        <div className={`flex items-center gap-1 ${projectsGridView ? "mt-2" : ""}`}>
                            <CalendarCheck size={14} />
                            <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Role: <span className='text-white64'>Frontend</span></p>
                            <Dot size={14} />
                            <Zap size={14} color='#FCBF04' />
                            <p className='font-inter font-medium text-cardYellowText text-[12px] leading-[14.4px] capitalize'>{data?.type}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`absolute ${projectsGridView ? "right-5 top-4" : "right-0"} flex flex-row justify-evenly items-center font-gridular leading-[19.2px] bg-[#091044] py-2 mr-4 px-3 gap-[6px] rounded-md`}>
                <img className='h-[15px]' src={usdc} alt="" />
                <p className='text-[14px] font-inter text-white88'>{data?.totalPrize}</p>
                <p className='text-[14px] font-semibold text-white48'>USDC</p>
            </div>
        </div>
    </div>
  )
}

export default ExploreGigsCard