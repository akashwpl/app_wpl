import { ArrowRight, Zap } from 'lucide-react'
import kyc_profile from '../../assets/images/kyc-profile.png'


const KYC_Card = () => {
  return (
    <div className='flex flex-col justify-evenly w-full h-[195px] bg-[#04072D] rounded-md px-4'>
        <div className='flex flex-row justify-between'>
            <img width={32} src={kyc_profile} alt="KYC profile image" />
            <div className='flex flex-row justify-evenly text-cardPurpleText bg-[#131742] w-32 h-[20px] items-center rounded-md'>
                <Zap size={12} />
                <p className='font-inter font-medium text-[12px] leading-[14.4px]'>Recommended</p>
            </div>
        </div>
        <p className='text-[16px] text-cardPurpleText font-gridular leading-[19.2px]'>You just got paid from WPL Technologies</p>
        <p className='text-[13px] text-white32 font-inter leading-[15.6px] font-medium'>Complete your KYC or some shit to claim your money.</p>
        <div className='border border-white12 border-dashed w-full'></div>
        <div className='flex flex-row justify-between text-cardPurpleText'>
            <p className='font-inter text-[13px] leading-[15.6px] font-medium'>Claim Payment</p>
            <ArrowRight size={16} />
        </div>
    </div>
  )
}

export default KYC_Card