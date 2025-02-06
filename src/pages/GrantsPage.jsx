import React from 'react'
import GrantCard from '../components/grants/GrantCard'


const GrantsPage = () => {
  return (
    <div className='size-full flex flex-col justify-center items-center gap-3 px-4 md:px-0'>
      <div className='w-full max-w-[1220px] mt-[100px]'>
        <div className='flex flex-col items-center gap-3'>
          <h1 className='text-primaryYellow font-gridular text-[24px] leading-6 text-center'>Have a solid idea but no funds to build it out?</h1>
          <p className='text-white64 font-gridular text-[14px] leading-4 text-center'>Apply to these open grants and receive a grant to build your next big thing! <br /> There’s no tomorrow, only yesterday. Apply now!</p>
        </div>

        <div className='flex flex-wrap gap-4 justify-center items-center mt-3'>
          <GrantCard />
          <GrantCard />
          <GrantCard />
          <GrantCard />
          <GrantCard />
          <GrantCard />
        </div>
      </div>
    </div>  
  )
}

export default GrantsPage