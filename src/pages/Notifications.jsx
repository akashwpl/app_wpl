import { useQuery } from '@tanstack/react-query'
import { CircleCheck, ExternalLink, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { calculateRemainingDaysHoursAndMinutes } from '../lib/constants'
import { getNotifications, getUserDetails, updNotification } from '../service/api'

const Notifications = () => {

  const { user_id } = useSelector((state) => state);
  const navigate = useNavigate();

  const {data: notificationsDetails, isLoading: isLoadingNotificationsDetails, refetch} = useQuery({
    queryKey: ['notificationsDetails'],
    queryFn: () => getNotifications()
  })

  const { data: userDetail, isLoading: isLoadingUserDetails } = useQuery({
    queryKey: ['userDetails', user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id
  })
  
  const [userName, setUsername] = useState('WPL user');
  const [notifications, setNotifications] = useState(notificationsDetails || []);

  useEffect(() => {
    if(!isLoadingUserDetails) setUsername(userDetail?.displayName)
  },[isLoadingUserDetails])

  useEffect(() => {
    const fetchData = async () => {
      await handleGetNotifications();
    }
    fetchData();
  },[isLoadingNotificationsDetails])

  const handleGetNotifications = async () => {
    const resp = await getNotifications();
    const notis = resp.data
      .filter((notification) => !notification.isHidden) // Filter out hidden notifications
      .map((notification) => ({
        ...notification, // Spread existing properties
        time: calculateRemainingDaysHoursAndMinutes(
          notification.created_at,
          new Date()
        ), // Calculate remaining time
      }));

      setNotifications(notis);
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
  
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 mb-20">
        <div className='flex flex-col justify-center items-center max-w-[840px] gap-2'>
          <p className="font-gridular pt-20 text-primaryYellow text-[20px] leading-[24px] text-start flex w-full">Hey {userName}, See what you've missed.</p>
          <div className="h-[101px] w-full py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
            <p className='font-gridular text-[23px] leading-[27.6px] mb-1'>Start Accepting payments</p>
            <p className='font-inter font-medium text-[13px] leading-[15.6px]'>Complete your KYC on onlydust for smoother expereince.</p>
          </div>
          <div className='flex justify-center items-center mt-4'>
            <div className='size-full flex flex-col justify-center items-center max-w-[840px]'>

              <div className='rounded-[12px] overflow-hidden'>
                <table className='border border-white4'>
                  <thead className='bg-[#050d4e]'>
                    <tr className='h-[48px] text-[13px] text-white32 font-medium font-inter'>
                      <td className='w-[680px] px-6'>Details</td>
                      <td className='w-[140px] px-6'>Action</td>
                      <td className='w-[135px]'>Time</td>
                    </tr>
                  </thead>
                  {!notifications?.length == 0 && 
                    <tbody className='bg-[#060e54]'>
                      {notifications.map((notification, idx) => (
                        <tr key={idx} className='hover:bg-cardBlueBg2'>
                          <td className='py-3 '>
                            <div className='flex items-center gap-1 px-4 py-1'>
                              {/* <img src={notification.icon} alt='wpl' className='size-[24px]' /> */}
                              <p className='text-[14px] font-inter text-white88 leading-[20px]'>
                                {notification?.msg}
                                {notification?.type === 'org_request' &&
                                  <span onClick={() => {navigate(`/requests/${notification.project_id}`);updateNotification(notification._id, 'read')}} className='ml-1 bg-white12 text-primaryYellow cursor-pointer rounded-md px-2 py-1 text-[12px]'>View request <ExternalLink size={12} className='inline-block'/></span>
                                }
                                {notification?.type === 'project_req' &&
                                  <span onClick={() => {navigate(`/projectdetails/${notification.project_id}`);updateNotification(notification._id, 'read')}} className='ml-1 bg-white12 text-primaryYellow cursor-pointer rounded-md px-2 py-1 text-[12px]'>Project details <ExternalLink size={12} className='inline-block'/></span>
                                }
                              </p>
                              {/* <div className='text-[12px] font-medium text-[#9FE7C7FA] flex items-center gap-1 bg-[#9FE7C71A] rounded-[4px] px-2 py-1 font-inter'> */}
                                {/* <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2.02695 4.18955L4.90495 1.93343C5.72392 1.29142 6.13341 0.970419 6.41375 1.00214C6.65641 1.0296 6.86993 1.18499 6.98224 1.41584C7.11199 1.68255 6.98041 2.20579 6.71727 3.25229L6.49679 4.12911C6.39144 4.54807 6.33877 4.75756 6.37504 4.93943C6.40696 5.0994 6.48557 5.24451 6.59963 5.35394C6.7293 5.47836 6.92589 5.53449 7.31905 5.64675L7.57415 5.71958C8.33023 5.93547 8.70827 6.04341 8.85941 6.26315C8.99082 6.45422 9.03295 6.69886 8.97375 6.9272C8.90567 7.1898 8.58821 7.43374 7.95332 7.92159L5.12744 10.093C4.31353 10.7184 3.90657 11.0311 3.62762 10.9976C3.38611 10.9685 3.17422 10.8127 3.06299 10.5825C2.9345 10.3165 3.06436 9.80005 3.32407 8.7672L3.52118 7.9833C3.62653 7.56434 3.67921 7.35486 3.64293 7.17299C3.61102 7.01301 3.5324 6.86791 3.41834 6.75847C3.28867 6.63406 3.09209 6.57793 2.69892 6.46567L2.41507 6.38462C1.66693 6.171 1.29285 6.06419 1.14182 5.84591C1.01047 5.65608 0.967457 5.41281 1.02497 5.18506C1.09111 4.92318 1.40306 4.67863 2.02695 4.18955Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg> */}
                                {/* <p className='hidden md:block'>{notification?.projectId}</p> */}
                              {/* </div> */}
                            </div>
                          </td>
                          
                          <td className='flex justify-center items-center gap-2 pt-2.5 w-[90px]'>
                            <CircleCheck onClick={() => {updateNotification(notification._id, 'read')}} className={`${notification.isRead ? "text-primaryYellow/20 cursor-not-allowed" : "text-primaryYellow/70 cursor-pointer"}`} size={20} />
                            <Trash2 onClick={() => {updateNotification(notification._id, 'delete')}} className='text-primaryYellow/70 cursor-pointer' size={20} />
                          </td>

                          <td className='text-[14px] text-white32 font-inter'>{`${notification?.time?.days}D ${notification?.time?.hours}H ${notification?.time?.minutes}M ago`}</td>
                        </tr>
                      )).reverse()}
                    </tbody>
                  }
                </table>
                {notifications.length == 0 &&
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
