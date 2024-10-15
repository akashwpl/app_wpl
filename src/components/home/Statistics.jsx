const Statistics = () => {
  return (
    <div className="mb-8">
        <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey Rahul, Here's your Earnings!</p>
        <div className="flex flex-row text-primaryBlue">
            <div className="mr-3 w-2/4 h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                <p className='font-inter font-bold text-[12px] leading-[14.4px] mb-1'>Total Earned</p>
                <p className='font-gridular text-[42px] leading-[50.4px]'>$120.23</p>
            </div>
            <div className='w-1/6 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg mr-3'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Participate</p>
                <p className='font-gridular text-[42px] leading-[42px]'>69</p>
            </div>
            <div className='w-1/6 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg mr-3'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Completed</p>
                <p className='font-gridular text-[42px] leading-[42px]'>04</p>
            </div>
            <div className='w-1/6 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Ongoing</p>
                <p className='font-gridular text-[42px] leading-[42px]'>02</p>
            </div>
        </div>
    </div>
  )
}

export default Statistics