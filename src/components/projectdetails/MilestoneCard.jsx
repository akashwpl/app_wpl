import React from 'react'
import { CheckCheck } from 'lucide-react'
import USDCimg from '../../assets/svg/usdc.svg'
import STRKimg from '../../assets/images/strk.png'
import { calcDaysUntilDate, convertTimestampToDate } from '../../lib/constants'

import hourglassSVG from '../../assets/icons/pixel-icons/hourglass2.svg'
import warningSVG from '../../assets/icons/pixel-icons/warning.svg'
import clockSVG from '../../assets/icons/pixel-icons/watch.svg'
import calenderSVG from '../../assets/icons/pixel-icons/calender.svg'

const MilestoneCard = ({ data }) => {

  const date = convertTimestampToDate(data?.starts_in)
  const deadline = calcDaysUntilDate(date, data?.deadline)

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='w-full'>
          <div className='flex items-start justify-between'>
            <h2 className='text-[20px] text-white88 font-semibold leading-[27px]'>{data?.title}</h2>
            <div className='flex justify-start items-start gap-1'>
              <div className={`${data?.status === "under_review" ? "bg-cardYellowBg" : "bg-[#091044]"} "min-w-[70px] rounded-[6px] font-inter font-medium flex items-center gap-1 py-3 px-2 ml-8"`}>
                {data?.status == 'idle' ? 
                  <>
                    <img src={hourglassSVG} alt='hourglass' className='size-[14px]'/>
                    <p className='text-white48 text-[12px] leading-[14px]'>Idle</p>
                  </>
                : data?.status == 'ongoing' ?
                  <>
                    <img src={hourglassSVG} alt='hourglass' className='size-[14px]'/>
                    <p className='text-white48 text-[12px] leading-[14px]'>In Progress</p>
                  </>
                : data?.status == 'under_review' ?
                  <>
                    <img src={warningSVG} alt='warning' className='size-[14px]'/>
                    <p className='text-cardYellowText text-[12px] leading-[14px]'>Under Review</p>
                  </>
                :
                  <>
                    <CheckCheck size={14} className='text-primaryGreen'/>
                    <p className='text-primaryGreen text-[12px] leading-[14px]'>Completed</p>
                  </>
                }
              </div>
              <div className='bg-[#091044] rounded-[6px] flex items-center gap-1 py-3 px-2'>
                <img src={data?.currency == 'STRK' ? STRKimg : USDCimg} alt='currency' className='size-[14px]'/>
                <p className='text-[12px] text-white88 leading-[14px] font-medium font-inter'>{data?.prize} <span className='text-white48'>{data?.currency}</span></p>
              </div>
            </div>
          </div>
          <div className='text-[12px] text-white32 font-semibold leading-[14px] flex items-center gap-1 mt-4'>
            <img src={clockSVG} alt='clock' className='size-[16px]'/>
            <p>Start date: {date} </p>
            <img src={calenderSVG} alt='calender' className='size-[16px] ml-2'/>
            <p>Delivery time: {deadline?.deliveryTime} {deadline?.timeUnit}</p>
          </div>
        </div>

      </div>
      <div className='mt-3'>
          <p className='text-white64 leading-[21px]'>{data?.description}</p>
      </div>
    </div>
  )
}

export default MilestoneCard