import React from 'react'
import { CalendarCheck, Trophy } from 'lucide-react'
import USDCsvg from '../../assets/svg/usdc.svg'

const MilestoneCard = ({ data }) => {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[20px] text-white88 font-semibold leading-[27px]'>{data?.title}</h2>
          <div className='text-[12px] text-white32 font-semibold leading-[14px] flex items-center gap-1 mt-1'>
              <CalendarCheck size={14} className='text-white32'/>
              <p>Delivery time: DUMMY TIME</p>
              <Trophy size={14} className='text-white32 ml-2'/>
              <p>DUMMY METRIC</p>
          </div>
        </div>
        <div className='bg-[#091044] rounded-[6px] flex items-center gap-1 py-3 px-2'>
          <img src={USDCsvg} alt='usdc' className='size-[14px]'/>
          <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter'>{data?.prize} <span className='text-white48'>{data?.currency}</span></p>
        </div>
      </div>
      <div className='mt-3'>
          <p className='text-white64 leading-[21px]'>{data?.description}</p>
          <p className='text-white64 leading-[21px] mt-3'>DUMMY SUB DESCRIPTION</p>
      </div>
    </div>
  )
}

export default MilestoneCard