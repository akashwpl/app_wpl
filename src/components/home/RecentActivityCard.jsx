import samuelProfile from '../../assets/images/user_profiles/samuel.png'
import bryanProfile from '../../assets/images/user_profiles/bryan.png'
import kpProfile from '../../assets/images/user_profiles/KP.png'
import purpProfile from '../../assets/images/user_profiles/purp.png'

const profileData = [
  {
    profileImg: samuelProfile,
    name: 'Samuel Harber',
    tag: 'samharber',
    activityName: 'Submitted a bounty',
    time: '12s ago'
  },
  {
    profileImg: bryanProfile,
    name: 'Bryan Johnson',
    tag: 'samharber',
    activityName: 'Submitted a bounty',
    time: '12s ago'
  },
  {
    profileImg: kpProfile,
    name: 'KP (d/acc)',
    tag: '',
    activityName: 'Add a personal project',
    time: '12s ago'
  },
  {
    profileImg: purpProfile,
    name: 'Purp',
    tag: '',
    activityName: 'Add a personal project',
    time: '12s ago'
  }
]

const RecentActivityCard = () => {
  return (
    <div className='flex flex-col w-full'>
      <p className='text-[13px] text-white48 font-inter leading-[15.6px] font-medium mb-2'>Recent activity</p>
      { profileData?.map((profile, index) => {
        return(
          <div key={index} className='flex flex-row justify-between w-full my-2'>
            <div className='flex flex-row'>
              <img width={32} height={32} src={profile.profileImg} alt="" />
              <div className='flex flex-col justify-around ml-2'>
                <div className='flex flex-row items-center'>
                  <p className='font-inter text-[14px] leading-[19.88px] text-white88 mr-1'>{profile.name}</p>
                  <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48'>@{profile.tag}</p>
                </div>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48'>{profile.activityName}</p>
              </div>
            </div>
            <p className='font-inter font-medium text-[12px] leading-[14.4px] text-white48'>{profile.time}</p>
          </div>
        )
        })
      }


    </div>
  )
}

export default RecentActivityCard