import React, { useEffect, useState } from 'react'

const KeepMoneyCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalBars = 13; // Number of bars
  const animationSpeed = 200; // Animation speed in milliseconds

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalBars); // Cycle through the bars
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [totalBars, animationSpeed]);

  return (
    <div className='bg-[#9CD4EC1A] rounded-md p-4 px-5 flex items-center overflow-hidden w-full relative'>
      <div className='text-white font-gridular text-[14px]'>
        <p className=''>Keep</p>
        <p className='text-[20px] text-primaryYellow'>100% <span className='text-[14px] text-white'>of</span></p>
        <p>your money.</p>
      </div>

      <div className='absolute -right-1'>
        <div className="flex items-center space-x-1 bg-[#010116B2] border border-[#FFFFFF12] rounded-md p-2">
          {Array.from({ length: totalBars }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-[20px] transition-all ${
                index <= activeIndex ? "bg-[#E38070]" : "bg-[#16237F]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default KeepMoneyCard