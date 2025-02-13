import React from 'react'
import grantPlaceholderPng from '../../assets/images/grant_placeholder.png'
import USDCPng from '../../assets/images/usdc.png'
import StarkPng from '../../assets/images/strk.png'
import UserPng from '../../assets/images/user-default.png'
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png';
import btnImg from '../../assets/svg/btn_subtract_semi.png';
import FancyButton from '../ui/FancyButton';
import { useNavigate } from 'react-router-dom';

const GrantCard = ({data}) => {
  const navigate = useNavigate()

  const navigateToGrantDetails = () => {
    navigate('/grantsdetail')
  }

  return (
    <div className='bg-[#050E52] p-6 rounded-[8px] flex flex-col gap-4 w-[390px] mt-1'>
      <img src={data?.image || grantPlaceholderPng} alt='grant image' className='w-[346px] h-[170px]'/>
      <div className='flex gap-3'>
        <div className='bg-[#091044] flex items-center gap-[6px] rounded-md p-2'>
          <p className='text-white48 text-[14px] font-semibold font-inter'>Upto</p>
          <img src={currencyImage(data?.currency) || USDCPng} alt='usdc' className='w-[16px] h-[16px]'/>
          <p className='text-white88 text-[14px] font-semibold font-inter'>{formatCurrency(data?.totalPrize)} {currencyName(data?.currency)}</p>
        </div>
        <div className='bg-[#091044] flex items-center gap-[6px] rounded-md p-2'>
          <img src={UserPng} alt='user' className='w-[16px] h-[16px]'/>
          <p className='text-white88 text-[14px] font-semibold font-inter'>120+ applications</p>
        </div>
      </div>

      <div>
        <p className='text-white48 text-[12px] leading-[14px] font-semibold font-inter'>{data?.organisationHandle || "Stark"}</p>
        <p className='text-white88 text-[16px] font-gridular'>{data?.title || "Stark"}</p>
      </div>

      <FancyButton 
        src_img={btnImg} 
        hover_src_img={btnHoverImg} 
        img_size_classes='w-[500px] h-[44px]' 
        className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
        btn_txt='Apply'  
        alt_txt='project apply btn' 
        onClick={() => {navigateToGrantDetails()}}
      />
    </div>
  )
}

export default GrantCard

const currencyImage = (curr) => {
  switch (curr) {
    case 'USDC':
      return USDCPng
    case 'STARK':
      return StarkPng
    default:
      return USDCPng
  }
}

const currencyName = (curr) => {
  switch (curr) {
    case 'USDC':
      return 'USDC'
    case 'STARK':
      return 'STARK'
    default:
      return 'USDC'
  }
}

// format amount in k, m, b, t
const formatCurrency = (amount) => {
  if(!amount) return 0
  if (amount < 1000) {
    return amount
  } else if (amount < 1000000) {
    return `${(amount/1000).toFixed(1)}k`
  } else if (amount < 1000000000) {
    return `${(amount/1000000).toFixed(1)}m`
  } else if (amount < 1000000000000) {
    return `${(amount/1000000000).toFixed(1)}b`
  } else {
    return `${(amount/1000000000000).toFixed(1)}t`
  }
}
