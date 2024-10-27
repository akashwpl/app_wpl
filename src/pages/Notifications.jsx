import React from 'react'

const Notifications = () => {
  return (
    <div className="flex flex-col items-center mt-36 text-primaryBlue w-full">
      <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey Rahul, Se what you've missed.</p>
      <div className="h-[101px] w-1/2 py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
        <p className='font-gridular text-[23px] leading-[27.6px] mb-1'>Start Accepting payments</p>
        <p className='font-inter font-medium text-[13px] leading-[15.6px]'>Complete your KYC on onlydust for smoother expereince.</p>
      </div>
      
    </div>
  )
}

export default Notifications