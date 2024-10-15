import { ArrowRight, CheckCheck, FileText, LoaderCircle, TextSearch, Users } from 'lucide-react'
import twitterIcon from '../../assets/images/twitter.png'

const ProfileDetailsCard = () => {
  return (
    <div className='flex flex-col w-full h-[233px] bg-white4 rounded-md my-6'>
      <div className='flex flex-row justify-between items-center px-4 bg-white7 h-[65px]'>
        <div className='flex flex-col'>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] text-white48 mb-1'>Your Profile is </p>
          <p className='font-gridular text-[16px] text-white88 leading-[19.2px]'>25% completed</p>
        </div>
        <LoaderCircle color='white' size={36}/>
      </div>
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between my-3 text-white32 mx-4'>
        <div className='flex flex-row'>
          <Users size={16}/>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Create basic profile</p>
        </div>
        <CheckCheck size={16} />
      </div>
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between my-3  text-white64 mx-4'>
        <div className='flex flex-row'>
          <TextSearch size={16}/>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Set Job preferences</p>
        </div>
        <ArrowRight size={16} />
      </div>
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between my-3 text-white64 mx-4'>
        <div className='flex flex-row'>
          <img src={twitterIcon} width={16} alt="twitter icon" />
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Social Links</p>
        </div>
        <ArrowRight size={16} />
      </div>
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between my-3 text-white64 mx-4'>
        <div className='flex flex-row'>
          <FileText size={16}/>
          <p className='font-inter font-medium text-[13px] leading-[15.6px] ml-2'>Add work / Samples</p>
        </div>
        <ArrowRight size={16} />
      </div>
    </div>
  )
}

export default ProfileDetailsCard