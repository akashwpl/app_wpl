import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, CircleCheck, ExternalLink, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import btnPng from '../assets/images/leaderboard_btn.png'
import Spinner from '../components/ui/spinner'
import { calculateRemainingDaysHoursAndMinutes } from '../lib/constants'
import { getNotifications, getUserDetails, updNotification } from '../service/api'

const Notifications = () => {

  const { user_id } = useSelector((state) => state);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const {data: notificationsDetails, isLoading: isLoadingNotificationsDetails, refetch} = useQuery({
    queryKey: ['notificationsDetailsquery'],
    queryFn: () => handleGetNotifications()
  })

  const { data: userDetail, isLoading: isLoadingUserDetails } = useQuery({
    queryKey: ['userDetails', user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id
  })
  
  const [userName, setUsername] = useState('WPL user');

  useEffect(() => {
    if(!isLoadingUserDetails) setUsername(userDetail?.displayName)
  },[isLoadingUserDetails])

  const handleGetNotifications = async () => {
    const resp = await getNotifications();
    const notis = resp.data
      .filter((notification) => !notification.isHidden)
      .map((notification) => ({
        ...notification,
        time: calculateRemainingDaysHoursAndMinutes(
          notification.created_at,
          new Date()
        ),
      })).reverse();
      return notis
  }

  const updateNotification = async (id, type) => {
    if(type === 'read') {
      const resp = await updNotification(id, {isRead: true});
    } else if (type === "delete") {
      const resp = await updNotification(id,{isHidden: true});
    }
    await handleGetNotifications();
    refetch();
  }

  useEffect(() => {
    if(notificationsDetails?.length == 0) return;

    const readNotification = async () => {
      const unreadNotifications = notificationsDetails?.filter((notification) => !notification.isRead);
      const updatePromises = unreadNotifications?.map((notification) =>
        updateNotification(notification._id, "read")
      );
      updatePromises && await Promise.all(updatePromises);
    }

    readNotification();
  }, [notificationsDetails, isLoadingNotificationsDetails])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = useMemo(() => notificationsDetails?.slice(indexOfFirstItem, indexOfLastItem), [notificationsDetails, indexOfFirstItem, indexOfLastItem, isLoadingNotificationsDetails]) 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(notificationsDetails?.length / itemsPerPage); i++) {
    pageNumbers?.push(i);
  }
  
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 mb-20">
        <div className='flex flex-col justify-center items-center max-w-[890px] gap-2'>
          <p className="font-gridular pt-20 text-primaryYellow text-[20px] leading-[24px] text-start flex w-full">Hey {userName}, See what you've missed.</p>
          <div className="h-[101px] w-full py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
            <p className='font-gridular text-[23px] leading-[27.6px] mb-1'>Start Accepting payments</p>
            <p className='font-inter font-medium text-[13px] leading-[15.6px]'>Complete your KYC on onlydust for smoother expereince.</p>
          </div>
          <div className='flex justify-center items-center mt-4'>
            <div className='size-full flex flex-col justify-center items-center max-w-[890px]'>

              <div className='rounded-[12px] overflow-hidden'>
                <table className='border border-white4'>
                  <thead className='bg-[#050d4e]'>
                    <tr className='h-[48px] text-[13px] text-white32 font-medium font-inter'>
                      <td className='w-[680px] px-6'>Details</td>
                      <td className='w-[140px] px-6'>Action</td>
                      <td className='w-[135px]'>Time</td>
                    </tr>
                  </thead>
                  {isLoadingNotificationsDetails ? <Spinner /> :
                    !currentData?.length == 0 && 
                    <tbody className='bg-[#060e54]'>
                      {currentData?.map((notification, idx) => (
                        <tr key={idx} className='hover:bg-cardBlueBg2'>
                          <td className='py-3 '>
                            <div className='flex items-center gap-1 px-4 py-1'>
                              {/* <img src={notification.icon} alt='wpl' className='size-[24px]' /> */}
                              <p className='text-[14px] font-inter text-white88 leading-[20px]'>
                                {notification?.msg}
                                {/* {notification?.type === 'proj_request' &&
                                  <span onClick={() => {navigate(`/requests/${notification.project_id}`);updateNotification(notification._id, 'read')}} className='ml-1 bg-white12 text-primaryYellow cursor-pointer rounded-md px-2 py-1 text-[12px]'>View request <ExternalLink size={12} className='inline-block'/></span>
                                } */}
                                {notification?.type === 'project_req' &&
                                  <span onClick={() => {navigate(`/projectdetails/${notification.project_id}`);updateNotification(notification._id, 'read')}} className='ml-1 bg-white12 text-primaryYellow cursor-pointer rounded-md px-2 py-1 text-[12px]'>Project details <ExternalLink size={12} className='inline-block'/></span>
                                }
                                {notification?.type === 'grant_req' &&
                                  <span onClick={() => {navigate(`/grantdetails/${notification.project_id}`);updateNotification(notification._id, 'read')}} className='ml-1 bg-white12 text-primaryYellow cursor-pointer rounded-md px-2 py-1 text-[12px]'>Project details <ExternalLink size={12} className='inline-block'/></span>
                                }
                                {notification?.type === 'payment' &&
                                  <span onClick={() => {navigate(`/rewards`);updateNotification(notification._id, 'read')}} className='ml-1 bg-white12 text-primaryYellow cursor-pointer rounded-md px-2 py-1 text-[12px]'>Transaction details <ExternalLink size={12} className='inline-block'/></span>
                                }
                              </p>
                            </div>
                          </td>
                          
                          <td className='w-[90px] px-8'>
                            <Trash2 onClick={() => {updateNotification(notification._id, 'delete')}} className='text-primaryYellow/70 cursor-pointer' size={20} />
                          </td>

                          <td className='text-[14px] text-white32 font-inter'>{`${notification?.time?.days}D ${notification?.time?.hours}H ${notification?.time?.minutes}M ago`}</td>
                        </tr>
                      ))}
                    </tbody>
                  }
                </table>

                {notificationsDetails?.length > itemsPerPage &&
                <div className="flex justify-end items-center gap-2 md:gap-6 mt-6">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='relative'>
                        <img src={btnPng} alt='' className='w-[34px] h-[23px]'/>
                        <ArrowLeft size={20} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-4 h-4 text-white48'/>
                    </button>
                    <div className='flex gap-4 text-white text-[12px] font-gridular'>
                    {pageNumbers.map((number) => {
                        if (number === 1 || number === pageNumbers.length || (number >= currentPage - 1 && number <= currentPage + 1)) {
                        return (
                            <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={currentPage === number ? 'bg-[#293BBC] w-[20px] h-[18px]' : ''}
                            >
                            {number}
                            </button>
                        );
                        } else if (number === currentPage - 2 || number === currentPage + 2) {
                        return <span key={number}>...</span>;
                        }
                        return null;
                    })}
                    </div>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} className='relative -translate-x-[6px]'>
                        <img src={btnPng} alt='' className='w-[34px] h-[23px]'/>
                        <ArrowRight size={20} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-4 h-4 text-white48'/>
                    </button>
                </div>
                }

                {currentData?.length == 0 &&
                  <div className='py-8 w-full flex flex-col justify-center items-center bg-[#060e54]'>
                    <h2 className='text-[20px] text-primaryYellow/80 font-gridular'>Nothing to see here....</h2>
                    <p className='text-white32 text-[13px] font-medium font-inter mt-1'>Start contributing to more projects and earn rewards.</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications
