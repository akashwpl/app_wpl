import headerPng from '../assets/images/prdetails_header.png'
import dummyPng from '../assets/dummy/akash_profile.png'
import YellowBtnPng from '../assets/images/yellow_button.png'



const SendPayPage = () => {
  return (
    <div className='overflow-x-hidden'>
      <div>
        <img src={headerPng} alt='header' className='h-[140px] w-full'/>
      </div>

      <div className='flex flex-col justify-center items-center pb-20 pt-6'>
        <div className='w-[525px] flex flex-col gap-6'>
          <div className='bg-[#FCBF041A] border border-dashed border-[#FBF1B83D] rounded-md p-3 flex gap-6'>
            <img src={dummyPng} alt='send-pay' className='size-[72px] rounded-[4px]' />
            <div>
              <p className='font-gridular text-[20px] text-white88'>Send Pay</p>
              <p className='font-inter text-[14px] text-white32'>@Send money to your friends and family</p>
            </div>
          </div>

          <div className='bg-[#101C77] rounded-md p-4 flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <img src={dummyPng} alt='send-pay' className='size-[24px] rounded-[6px]' />
              <p className='text-white88 font-inter text-[14px]'>Akash</p>
            </div>
            <div>
              <p className='text-[14px] font-inter text-white32'>0xvw..c4L1</p>
            </div>
          </div>

          <div className='bg-[#0ED0651A] rounded-md h-[158px] flex justify-center items-center flex-col'>
            <p className='text-white32 text-[14px] font-inter'>0xa32..gk20</p>
            <p className='text-primaryGreen text-[42px] font-gridular'>5000 USDC</p>
            <p className='text-white32 text-[14px] font-inter'>$5042.12</p>
          </div>

          <div className='bg-[#091044] rounded-lg p-4'>
            <div className='flex justify-between items-center py-2'>
              <p className='text-[#FFFFFFA8] font-semibold text-[14px] font-inter'>Current Balance</p>
              <p className='text-primaryYellow text-[14px] font-gridular'>445.00 USDC</p>
            </div>
            <div className='flex justify-between items-center py-4'>
              <p className='text-[#FFFFFFA8] font-semibold text-[14px] font-inter'>Allocated</p>
              <p className='text-primaryYellow text-[14px] font-gridular'>445.00 USDC</p>
            </div>
            <div className='flex justify-between items-center py-2'>
              <p className='text-[#FFFFFFA8] font-semibold text-[14px] font-inter'>Final Balance</p>
              <p className='text-primaryYellow text-[14px] font-gridular'>445.00 USDC</p>
            </div>
          </div>

          <div className="flex justify-end w-full">
            <div className="w-[160px] h-[40px] relative">
              <img src={YellowBtnPng} alt="" className="h-[40px] rounded-md cursor-pointer"/>
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2A3485] text-[14px] font-gridular cursor-pointer">Reward</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SendPayPage