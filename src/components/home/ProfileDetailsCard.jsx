import { ArrowRight, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import profileSVG from '../../assets/icons/pixel-icons/profile.svg'
import listSVG from '../../assets/icons/pixel-icons/search-list.svg'
import twitterSVG from '../../assets/icons/pixel-icons/twitter.svg'
import docSVG from '../../assets/icons/pixel-icons/document2.svg'
import { useMemo } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

import 'react-circular-progressbar/dist/styles.css';

const profileCheckList = [
  "bio",
  "displayName",
  "pfp",
  "email",
  "socials",
  "experienceDescription",
  "username",
  "walletAddress"
]

const ProfileDetailsCard = ({userDetails}) => {

  const navigate = useNavigate();

  const navigateToEditProfile = () => {
    navigate('/editprofile')
  }

  const profileProgress = useMemo(() => {
    let progress = 0;
    for (const checkItem of profileCheckList) {
      if (userDetails?.hasOwnProperty(checkItem)) {
        progress += 10; 
      }
    }
    return progress;
  },[userDetails])

  return (
    <div onClick={navigateToEditProfile} className='flex flex-col w-full h-[200px] bg-white4 rounded-md my-6 cursor-pointer hover:bg-white7'>
      <div className='flex flex-row justify-between items-center px-4 bg-white7 rounded-t-md h-[65px]'>
        <div className='flex flex-col'>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] text-white48 mb-1'>Your Profile is </p>
          <p className='font-gridular text-[16px] text-white88 leading-[19.2px]'>{profileProgress}% completed</p>
        </div>
        <div className="size-[36px]">
          <CircularProgressbar 
            value={profileProgress} 
            styles={buildStyles({
              pathColor: '#fff',
              trailColor: '#16237F'
            })}
          />
        </div>
      </div>
      <div className='border border-white12 stroke-2 border-dashed w-full'></div>
      <div className='flex flex-row justify-between my-3 text-white32 mx-4'>
        <div className='flex flex-row items-center'>
          <img src={profileSVG} alt='profile' className='size-[16px]'/>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Create basic profile</p>
        </div>
        <CheckCheck size={16} />
      </div>
      {/* <div className='border border-white12 border-dashed w-full'></div> */}
      {/* <div className='flex flex-row justify-between py-3 text-white64 px-4'>
        <div className='flex flex-row items-center'>
          <img src={listSVG} alt='search-list' className='size-[18px]'/>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Set Job preferences</p>
        </div>
        <ArrowRight size={16} onClick={navigateToEditProfile}/>
      </div> */}
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between py-3 text-white64 px-4'>
        <div className='flex flex-row items-center'>
          <img src={twitterSVG} alt="twitter icon" className='size-[16px]' />
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Social Links</p>
        </div>
        <ArrowRight size={16} onClick={navigateToEditProfile}/>
      </div>
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between py-3 text-white64 px-4'>
        <div className='flex flex-row items-center'>
          <img src={docSVG} alt="Doc icon" className='size-[18px]' />
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Add work / Samples</p>
        </div>
        <ArrowRight size={16} onClick={navigateToEditProfile}/>
      </div>
    </div>
  )
}

export default ProfileDetailsCard