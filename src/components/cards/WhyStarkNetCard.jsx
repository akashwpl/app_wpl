import React from 'react'
import checkPNG from '../../assets/icons/green-check.png'

const WhyStarkNetCard = () => {
  return (
    <div>
      <p className='text-white48 text-[13px] font-semibold font-inter mb-3'>Why Starknet?</p>
      <div className='bg-[#9CD4EC1A] rounded-md mb-4 py-4'>
        <div className='flex items-center gap-[6px] px-3'>
          <p className='text-[14px] font-gridular text-white88'>Get Paid on </p>
          <p className='text-[20px] font-gridular text-primaryYellow -translate-y-[2px]'>time.</p>
        </div>

        <div>
            <div className='flex justify-end mt-8 relative'>
              <div className='bg-[#010116] flex items-center h-[46px] px-1 pr-3 gap-2 rounded-l-md border-l border-t border-b border-[#2e2e38b4] absolute -top-4 blur-[4px]'>
                <img src={checkPNG} alt='check' className='w-[20px] h-[20px] ml-3'/>
                <p className='text-[#9FE7C7] text-[14px] font-gridular leading-[14px]'>GG! $1250 creadtied to yo</p>
              </div>
              <div className='bg-[#010116ee] flex items-center h-[46px] px-1 pr-3 gap-3 rounded-l-md z-10 blur-[0.5px] border-l border-t border-b border-[#2e2e38b4]'>
                <img src={checkPNG} alt='check' className='w-[20px] h-[20px] ml-3'/>
                <p className='text-[#9FE7C7] text-[14px] font-gridular leading-[14px]'>GG! $1250 creadtied to your</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default WhyStarkNetCard