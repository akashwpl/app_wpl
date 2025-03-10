import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import SyncPng from '../../assets/images/sync.png'
import USDCPng from '../../assets/images/usdc.png'
import { getUserDetails, sendOpenProjectRewards } from "../../service/api"

import { ArrowLeft } from "lucide-react"
import YellowBtnPng from '../../assets/images/yellow_button.png'
import { displaySnackbar } from "../../store/thunkMiddleware"

const DistributeRewardsPage = ({selectedWinner, projectDetails, setIsDistributingRewards}) => {
  const { user_id } = useSelector((state) => state)
  const dispatch = useDispatch();

  const {data: userDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })

  
  console.log('projectDetails', projectDetails)

  const handleTransferReward = async () => {
    const resp = await sendOpenProjectRewards(projectDetails?._id);

    if(resp?.message === "payed" && resp?.data?.status === 'ok') {
      dispatch(displaySnackbar("Payment Initiated"))
    } else {
      dispatch(displaySnackbar("Payment Failed"))
    }
  }
   
  return (
    <div className=''>
      <div className='flex items-center gap-1 pl-20 py-2'>
        <ArrowLeft size={14} stroke='#ffffff65'/>
        <p 
          className='text-white48 font-inter text-[14px] cursor-pointer' 
          onClick={() => {setIsDistributingRewards(false)}}
        >Go back</p>
      </div>

      <div className="flex justify-center items-end pt-10">
        <div className='size-full flex flex-col justify-center items-center max-w-[1024px]'>
          <div className='w-full'>
            <div className="mb-8">
                <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey {userDetails ? userDetails?.displayName : "User"}, your numbers are looking great!</p>
                  <div className="flex flex-row text-primaryBlue gap-2">
                    <div className="w-full h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                        <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Remaining balance</p>
                        <p className='font-gridular text-[42px] leading-[50.4px]'>{userDetails ? userDetails?.totalProjectsInWPL : '0'}</p>
                    </div>
                    <div className='w-1/2 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg'>
                      <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Rewards Amount</p>
                      <p className='font-gridular text-[42px] leading-[42px]'>
                        {"$0"}
                      </p>
                  </div>
                    <div className='w-1/3 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg'>
                      <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Bounties</p>
                      <p className='font-gridular text-[42px] leading-[42px]'>
                        {userDetails ? userDetails?.totalProjectsInWPL : '0'}
                      </p>
                  </div>
                </div>
            </div>
          </div>

          <div className="flex gap-6 border border-dashed border-[#FFFFFF29] w-full rounded-md py-[12px] px-[12px]">
            <div>
              <img src={projectDetails?.image} alt="" className="size-[72px] rounded-[4px]"/>
            </div>
            <div>
              <div className="text-[20px] text-white88 font-gridular leading-[24px]">{projectDetails?.title}</div>
              <div className="text-[14px] text-white32 font-inter leading-[20px] mt-1">@{projectDetails?.organisation?.organisationHandle}</div>
            </div>
          </div>


          <div className="w-full flex gap-6 mt-6">
            <div className="bg-[#091044] rounded-xl w-full h-fit">
              <div className="grid grid-cols-4 w-full px-4 border-b border-white7 py-3">
                <p className="col-span-1 text-white32 font-semibold text-[13px] font-inter">Rank</p>
                <p className="col-span-1 text-white32 font-semibold text-[13px] font-inter">Name</p>
                <p className="col-span-1 text-white32 font-semibold text-[13px] font-inter text-end">Project Link</p>
                <p  className="col-span-1 text-white32 font-semibold text-[13px] font-inter text-end">Reward</p>
              </div>
              <div>
                {selectedWinner?.map((winner, index) => (
                  <div key={index} className="grid grid-cols-4 w-full px-4 py-3">
                    <p className="col-span-1 text-[14px] text-white88 font-inter">{index + 1}</p>
                    <div className="col-span-1 text-[14px] text-white88 font-inter flex items-center gap-1">
                      <img src={winner?.user?.pfp} alt="user" className="size-[24px] rounded-md"/>
                      {winner?.user?.displayName}
                    </div>
                    <p className="col-span-1 text-[14px] text-white88 font-inter flex justify-end truncate">
                      <a href={winner?.submissionLink}>{winner?.submissionLink}</a>
                    </p>
                    <div className="col-span-1 text-[14px] text-white88 font-inter flex justify-end items-center gap-1">
                      <img src={USDCPng} alt="" className="size-[14px]"/>
                      <p>1000</p>
                      <p className="text-white48">USDC</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="w-full flex justify-end">
                <div className="flex justify-end items-center gap-1 bg-white7 rounded-lg w-fit px-2 py-1 font-gridular border border-white7 text-[14px] text-[#FFFFFFC4]">
                  <img src={SyncPng} alt="" className="size-[20px]"/>
                  <p>Pay in</p>
                  <img src={USDCPng} alt="" className="size-[18px]"/>
                  <p className="font-inter">STRK</p>
                </div>
              </div>

              <div className="w-[380px] bg-[#101C77] p-[6px] rounded-2xl mt-2">
                <div className="bg-[#091044] rounded-2xl flex justify-center items-center gap-2 h-[114px]">
                  <img src={USDCPng} alt="" className="size-[32px]"/>
                  <p className="text-[42px] text-primaryGreen font-gridular">5000</p>
                  <p className="text-white48 font-inter">USDC</p>
                </div>
                <div className="mt-2 flex gap-1">
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">150 USDC</div>
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">500 USDC</div>
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">1000 USDC</div>
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">2000 USDC</div>
                </div>
              </div>

              <div className="w-[380px] bg-[#101C77] p-[6px] rounded-2xl mt-5">
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-t-lg rounded-b-[4px] h-[41px]">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Current balance</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">445.00 USDC</p>
                </div>
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-[4px] h-[41px] my-1">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Current balance</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">445.00 USDC</p>
                </div>
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-t-[4px] rounded-b-lg h-[41px]">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Current balance</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">445.00 USDC</p>
                </div>
              </div>

              <div className="flex justify-end w-full mt-5">
                <div onClick={handleTransferReward} className="w-[160px] h-[40px] relative cursor-pointer">
                  <img src={YellowBtnPng} alt="" className="h-[40px] rounded-md cursor-pointer"/>
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2A3485] text-[14px] font-gridular">Reward</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
)
}

export default DistributeRewardsPage