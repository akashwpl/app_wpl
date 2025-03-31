import { CheckCheck, Clock, Hourglass, MoveDownLeft, MoveUpRight } from 'lucide-react'
import wplPng from '../assets/images/wpl_prdetails.png'
import USDCpng from '../assets/images/usdc.png'
import STRKpng from '../assets/images/strk.png'
import Statistics from '../components/home/Statistics'
import { useEffect, useState } from 'react'
import Tabs from '../components/ui/Tabs'
import { getPaymentTransactions, getUserDetails } from '../service/api'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { calculateRemainingDaysHoursAndMinutes } from '../lib/constants'
import { useNavigate } from 'react-router-dom'

const initialTabs = [
    {id: 'gigPayments', name: 'Gig Payments', isActive: true},
    {id: 'paymentHistory', name: 'Payment History', isActive: false},
]

const RewardsPage = () => {
    const navigate = useNavigate();
    const { user_id } = useSelector((state) => state)
    const [tabs, setTabs] = useState(initialTabs)
    const [selectedTab, setSelectedTab] = useState('gigPayments')

    const selection = selectedTab === 'gigPayments' ? 'project' : 'p2p'

    const [filteredTransactions, setFilteredTransactions] = useState({})

    const handleTabClick = (id) => {
        const newTabs = tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === id
        }));
        setTabs(newTabs)
        setSelectedTab(id)
    }
    const { data: userDetail } = useQuery({
      queryKey: ['userDetails', user_id],
      queryFn: () => getUserDetails(user_id),
      enabled: !!user_id
    })

    const { data: userPaymentTransactions, isLoading: isLoadingUserPaymentTransactions, refetch: refetchUserPaymentTransactions } = useQuery({
      queryKey: ['userPaymentTransactions'],
      queryFn: () => getPaymentTransactions(),
      enabled: !!user_id
    })

    useEffect(() => {
        if(!isLoadingUserPaymentTransactions) {
            const result = filterTransactionsByType();
            setFilteredTransactions(result)
        }
    },[isLoadingUserPaymentTransactions])

    const filterTransactionsByType = () => {
        const result = {
            project: [],
            p2p: []
        };
        
        userPaymentTransactions?.forEach(obj => {
            obj.time = calculateRemainingDaysHoursAndMinutes(obj?.updated_at,new Date())
            console.log('ob tim',obj.time);
            
            if (obj?.type === 'project') {
                result.project.push(obj);
            } else if (obj?.type === 'p2p') {
                result.p2p.push(obj);
            }
        });

        // result.project = result.project.reverse();
        // result.project = result.project.reverse();
    
        return result;
    }

    console.log('frt',filteredTransactions[selection]?.map((data) => {
        console.log(data);
    }));
    

    return (
        <div className='flex justify-center items-end pt-20'>
            <div className='size-full flex flex-col justify-center items-center max-w-[1100px]'>

                <div className='w-full'>
                    <Statistics userDetails={userDetail}/>
                </div>

                <div className='flex justify-start w-full mb-10 border-b border-white4'>
                    <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab}/>
                </div>

                <div className='rounded-[12px] overflow-hidden'>
                    <table className='border border-white4'>
                        <thead className='bg-[#060E4F] stroke-bottom'>
                            <tr className='h-[48px] text-[13px] text-white32 border-b border-white4 font-normal font-inter'>
                                {selection === 'p2p' && <td className='w-[120px] px-4'>Type</td>}
                                <td className='w-[720px] px-4'>{selection === 'p2p' ? 'Payee Remarks' : 'Gig Details'}</td>
                                {filteredTransactions[selection]?.length != 0 && <td className='w-[80px] text-right px-4'>Amount</td>}
                                <td className='w-[154px] px-4 text-right'>Status</td>
                                <td className='w-[140px] px-4 text-right'>Time</td>
                            </tr>
                            
                        </thead>
                            {!filteredTransactions[selection]?.length == 0 && <tbody className='bg-[#060e54]'>
                                {filteredTransactions[selection]?.map((data, idx) => (
                                    <tr key={idx} className='hover:bg-white7 cursor-pointer'>
                                        {selection === 'p2p' && 
                                        <td className='px-4'>
                                            <div className='flex items-center gap-1 text-[14px] text-white88 font-inter'>
                                                {data?.payment_direction === 'send' ?
                                                    <MoveUpRight className='size-[16px] mr-1'/>
                                                :
                                                    <MoveDownLeft className='size-[16px] mr-1' />
                                                }
                                                <p className=''>{data?.payment_direction}</p> 
                                            </div>
                                        </td>
                                        }
                                        <td className='py-3'>
                                            <div className='flex items-center gap-2 px-4 py-1'>
                                                {data?.project_image && <img src={data?.project_image} alt='project_img' className='size-[24px]' />}
                                                <p className='text-[14px] font-inter font-normal text-white88 leading-[20px]'>{selection === 'p2p' ? data?.remarks : data?.project_name}</p>
                                                {data?.milestone_name &&
                                                    <div className='text-[12px] font-medium text-[#9FE7C7FA] flex items-center gap-1 bg-[#9FE7C71A] rounded-[4px] px-2 py-1 font-inter'>
                                                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M2.02695 4.18955L4.90495 1.93343C5.72392 1.29142 6.13341 0.970419 6.41375 1.00214C6.65641 1.0296 6.86993 1.18499 6.98224 1.41584C7.11199 1.68255 6.98041 2.20579 6.71727 3.25229L6.49679 4.12911C6.39144 4.54807 6.33877 4.75756 6.37504 4.93943C6.40696 5.0994 6.48557 5.24451 6.59963 5.35394C6.7293 5.47836 6.92589 5.53449 7.31905 5.64675L7.57415 5.71958C8.33023 5.93547 8.70827 6.04341 8.85941 6.26315C8.99082 6.45422 9.03295 6.69886 8.97375 6.9272C8.90567 7.1898 8.58821 7.43374 7.95332 7.92159L5.12744 10.093C4.31353 10.7184 3.90657 11.0311 3.62762 10.9976C3.38611 10.9685 3.17422 10.8127 3.06299 10.5825C2.9345 10.3165 3.06436 9.80005 3.32407 8.7672L3.52118 7.9833C3.62653 7.56434 3.67921 7.35486 3.64293 7.17299C3.61102 7.01301 3.5324 6.86791 3.41834 6.75847C3.28867 6.63406 3.09209 6.57793 2.69892 6.46567L2.41507 6.38462C1.66693 6.171 1.29285 6.06419 1.14182 5.84591C1.01047 5.65608 0.967457 5.41281 1.02497 5.18506C1.09111 4.92318 1.40306 4.67863 2.02695 4.18955Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                        <p className='hidden md:block truncate'>{data?.milestone_name}</p>
                                                    </div>
                                                }
                                            </div>
                                        </td>
                                        <td className='justify-items-end px-4'>
                                            <div className='flex items-center gap-1 text-[14px] text-white88 font-inter'>
                                                <img src={data?.currency === 'STRK' ? STRKpng : USDCpng} alt='currency' className='size-[16px] mr-1'/>
                                                {data?.amount} 
                                            </div>
                                        </td>
                                        <td className='justify-items-end px-4'>{paymentStatusType(data?.status)}</td>
                                        <td className='text-[14px] text-white32 font-inter font-light text-right px-4'>{`${data?.time?.days}D ${data?.time?.hours}H ${data?.time?.minutes}M ago`}</td>
                                    </tr>
                                ))}
                            </tbody>
                            }
                    </table>
                    {   filteredTransactions[selection]?.length == 0 &&
                        <div className='py-8 w-full flex flex-col justify-center items-center bg-[#060e54]'>
                            <h2 className='text-[20px] text-primaryYellow/80 font-gridular'>Nothing to see here....</h2>
                            <p className='text-white32 text-[13px] font-medium font-inter mt-1'>Start contributing to more Gigs and earn rewards.</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RewardsPage

const paymentStatusType = (type) => {
    switch (type) {
        case "success":
            return <div className='text-[14px] text-[#0ED065] font-medium font-inter flex items-center justify-center max-w-fit gap-1 bg-[#0ED065]/10 px-2 py-1 rounded-[6px]'>
                <CheckCheck size={14} />
                <p className='hidden md:block'>Completed</p>
            </div>
        case "pending":
        case "initiated":
            return <div className='text-[14px] text-[#FFB800] font-medium font-inter flex items-center justify-center max-w-fit gap-1 bg-[#FFB800]/10 px-2 py-1 rounded-[6px]'>
                <Clock size={14} />
                <p className='hidden md:block'>Pending</p>
            </div>
        case "processing":
            return <div className='text-[14px] text-white48 font-medium font-inter flex items-center justify-center max-w-fit gap-1 bg-white7 px-2 py-1 rounded-[6px]'>
                <Hourglass size={14} />
                <p className='hidden md:block'>In Progress</p>
            </div>
        default:
            break;
    }
}