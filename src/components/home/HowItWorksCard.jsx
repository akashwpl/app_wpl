import { ArrowRight } from 'lucide-react'
import React from 'react'

const HowItWorksCard = () => {
  return (
    <div className='bg-white7 rounded-md p-4'>
      <div className='text-white88 font-gridular'>How it works?</div>
      <div className='rounded-sm mt-4'>
        <div className='flex justify-between items-center bg-white4 p-3 rounded-t-md'>
          <div className='text-white64 text-[13px] font-semibold font-inter flex items-center gap-1'>
            <div className='bg-white4 rounded-[4px] size-5 text-center'>1</div> 
            Create basic profile
          </div>
          <div><ArrowRight className='text-white48'/></div>
        </div>
        <div className='flex justify-between items-center bg-white12 p-3 border-t border-b border-dashed border-white12'>
          <div className='text-white64 text-[13px] font-semibold font-inter flex items-center gap-1'>
            <div className='bg-white4 rounded-[4px] size-5 text-center'>1</div> 
            Create basic profile
          </div>
          <div><ArrowRight className='text-white48'/></div>
        </div>
        <div className='flex justify-between items-center bg-white12 p-3 rounded-b-md'>
          <div className='text-white64 text-[13px] font-semibold font-inter flex items-center gap-1'>
            <div className='bg-white4 rounded-[4px] size-5 text-center'>1</div> 
            Create basic profile
          </div>
          <div><ArrowRight className='text-white48'/></div>
        </div>

      </div>
    </div>
  )
}

export default HowItWorksCard