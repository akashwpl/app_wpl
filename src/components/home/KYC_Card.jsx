import { ArrowRight } from 'lucide-react'
import kyc_profile from '../../assets/images/kyc-profile.png'

import zapSVG from '../../assets/icons/pixel-icons/zap.svg'
import tickOutlineSVG from '../../assets/icons/pixel-icons/tick-outline.svg'

const KYC_Card = () => {
  return (
    <div className='flex flex-col justify-evenly w-full h-[195px] bg-[#04072D] hover:bg-[#04072de0] rounded-md px-4 cursor-pointer'>
      <div className='flex flex-row justify-between'>
        <img width={32} src={kyc_profile} alt="KYC profile image" />
        <div className='flex flex-row justify-evenly text-cardPurpleText bg-[#131742] w-32 h-[20px] items-center rounded-md'>
          <img src={zapSVG} alt='zap' className='w-[18px] h-[18px]'/>
          <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Recommended</p>
        </div>
      </div>
      <p className='text-[16px] text-cardPurpleText font-gridular leading-[19.2px]'>You just got paid from WPL Technologies</p>
      <p className='text-[13px] text-white32 font-inter leading-[15.6px] font-medium'>Complete your KYC or some shit to claim your money.</p>
      <div className='border border-white12 border-dashed w-full'></div>
      <div className='flex flex-row justify-between items-center text-cardPurpleText'>
        <div className="flex flex-row items-center gap-1">
          <img src={tickOutlineSVG} alt='tick-filled' className='w-[18px] h-[18px]'/>
          <p className='font-inter text-[13px] leading-[15.6px] font-medium'>Complete KYC</p>
        </div>
        <ArrowRight size={16} />
      </div>
    </div>
  )
}

export default KYC_Card