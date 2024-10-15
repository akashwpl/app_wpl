import { CheckCheck, Clock, Hourglass } from 'lucide-react'
import wplPng from '../assets/images/wpl_prdetails.png'
import USDCsvg from '../assets/svg/usdc.svg'
import Statistics from '../components/home/Statistics'
import { useState } from 'react'
import Tabs from '../components/ui/Tabs'

const initialTabs = [
    {id: 'upcomingpayments', name: 'Upcoming Payments', isActive: true},
    {id: 'rewardhistory', name: 'Reward History', isActive: false},
]

const RewardsPage = () => {

    const [tabs, setTabs] = useState(initialTabs)
    const [selectedTab, setSelectedTab] = useState('upcomingpayments')

    const handleTabClick = (id) => {
        const newTabs = tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === id
        }));
        setTabs(newTabs)
        setSelectedTab(id)
    }

    return (
        <div className='flex justify-center items-center pt-20'>
            <div className='size-full flex flex-col justify-center items-center max-w-[840px]'>

                <div className=''>
                    <Statistics />
                </div>

                <div className='flex justify-start w-full mb-10'>
                    <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab}/>
                </div>

                <div className='rounded-[12px] overflow-hidden'>
                    <table className='border border-white4'>
                        <thead className='bg-[#050d4e]'>
                            <tr className='h-[48px] text-[13px] text-white32 font-medium font-inter'>
                                <td className='w-[483px] px-6'>Project</td>
                                {dummyData.length && <td className='w-[140px]'>Amount</td>}
                                <td className='w-[131px]'>Status</td>
                                <td className='w-[86px]'>Time</td>
                            </tr>
                        </thead>
                            {!dummyData.length == 0 && <tbody className='bg-[#060e54]'>
                                    {dummyData.map((data, idx) => (
                                            <tr key={idx} className=''>
                                                <td className='py-3'>
                                                    <div className='flex items-center gap-1 px-4 py-1'>
                                                        <img src={data.icon} alt='wpl' className='size-[24px]' />
                                                        <p className='text-[14px] font-inter text-white88 leading-[20px]'>{data?.description}</p>
                                                        <div className='text-[12px] font-medium text-[#9FE7C7FA] flex items-center gap-1 bg-[#9FE7C71A] rounded-[4px] px-2 py-1 font-inter'>
                                                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.02695 4.18955L4.90495 1.93343C5.72392 1.29142 6.13341 0.970419 6.41375 1.00214C6.65641 1.0296 6.86993 1.18499 6.98224 1.41584C7.11199 1.68255 6.98041 2.20579 6.71727 3.25229L6.49679 4.12911C6.39144 4.54807 6.33877 4.75756 6.37504 4.93943C6.40696 5.0994 6.48557 5.24451 6.59963 5.35394C6.7293 5.47836 6.92589 5.53449 7.31905 5.64675L7.57415 5.71958C8.33023 5.93547 8.70827 6.04341 8.85941 6.26315C8.99082 6.45422 9.03295 6.69886 8.97375 6.9272C8.90567 7.1898 8.58821 7.43374 7.95332 7.92159L5.12744 10.093C4.31353 10.7184 3.90657 11.0311 3.62762 10.9976C3.38611 10.9685 3.17422 10.8127 3.06299 10.5825C2.9345 10.3165 3.06436 9.80005 3.32407 8.7672L3.52118 7.9833C3.62653 7.56434 3.67921 7.35486 3.64293 7.17299C3.61102 7.01301 3.5324 6.86791 3.41834 6.75847C3.28867 6.63406 3.09209 6.57793 2.69892 6.46567L2.41507 6.38462C1.66693 6.171 1.29285 6.06419 1.14182 5.84591C1.01047 5.65608 0.967457 5.41281 1.02497 5.18506C1.09111 4.92318 1.40306 4.67863 2.02695 4.18955Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            <p className='hidden md:block'>{data?.milestone_num}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='flex items-center gap-1 text-[14px] text-white88 font-inter'>
                                                        <img src={USDCsvg} alt='usdc' className='size-[14px]'/>
                                                        {data?.amount} 
                                                        <span className='text-white48 hidden md:block'>{data.currency}</span>
                                                    </div>
                                                </td>
                                                <td className=''>{milestoneStatusType(data?.status)}</td>
                                                <td className='text-[14px] text-white32 font-inter'>{data?.time}</td>
                                            </tr>
                                    ))}
                                </tbody>
                            }
                    </table>
                    {dummyData.length == 0 &&
                        <div className='py-8 w-full flex flex-col justify-center items-center bg-[#060e54]'>
                            <h2 className='text-[20px] text-primaryYellow/80 font-gridular'>Nothing to see here....</h2>
                            <p className='text-white32 text-[13px] font-medium font-inter mt-1'>Start contributing to more projects and earn rewards.</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RewardsPage

const milestoneStatusType = (type) => {
    switch (type) {
        case "Completed":
            return <div className='text-[14px] text-[#0ED065] font-medium font-inter flex items-center justify-center max-w-fit gap-1 bg-[#0ED065]/10 px-2 py-1 rounded-[6px]'>
                <CheckCheck size={14} />
                <p className='hidden md:block'>Completed</p>
            </div>
        case "Pending":
            return <div className='text-[14px] text-[#FFB800] font-medium font-inter flex items-center justify-center max-w-fit gap-1 bg-[#FFB800]/10 px-2 py-1 rounded-[6px]'>
                <Clock size={14} />
                <p className='hidden md:block'>Pending</p>
            </div>
        case "Inprogress":
            return <div className='text-[14px] text-white48 font-medium font-inter flex items-center justify-center max-w-fit gap-1 bg-white7 px-2 py-1 rounded-[6px]'>
                <Hourglass size={14} />
                <p className='hidden md:block'>In Progress</p>
            </div>
        default:
            break;
    }
}


const dummyData = [
    {icon: wplPng, description: "A follow along guide for shipping blinks", milestone_num: "Milestone 1", amount: "1200", status: "Completed", time: "2d ago", currency: "USDC"},
    {icon: wplPng, description: "A follow along guide for shipping blinks", milestone_num: "Milestone 1", amount: "1345", status: "Pending", time: "2d ago", currency: "USDC"},
    {icon: wplPng, description: "A follow along guide for shipping blinks", milestone_num: "Milestone 1", amount: "6969", status: "Inprogress", time: "2d ago", currency: "USDC"},
]