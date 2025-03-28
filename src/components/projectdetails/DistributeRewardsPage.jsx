import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import SyncPng from '../../assets/images/sync.png'
import USDCPng from '../../assets/images/usdc.png'
import STRKPng from '../../assets/images/strk.png'
import { getUserAcctBalance, getUserDetails, sendOpenProjectRewards } from "../../service/api"

import { ArrowLeft, X } from "lucide-react"
import YellowBtnPng from '../../assets/images/yellow_button.png'
import { displaySnackbar } from "../../store/thunkMiddleware"
import { useEffect, useState } from "react"
import FancyButton from "../ui/FancyButton"
import btnHoverImg from '../../assets/svg/btn_hover_subtract.png';
import btnImg from '../../assets/svg/btn_subtract_semi.png';
import CustomModal from "../ui/CustomModal"
import wpllogo from '../../assets/svg/wolf_logo.svg'
import { useNavigate } from "react-router-dom"

const DistributeRewardsPage = ({selectedWinner, projectDetails, setIsDistributingRewards}) => {
  const { user_id } = useSelector((state) => state)
  const navigate = useNavigate()

  const {data: userDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })

  const [acctBalance, setAcctBalance] = useState({});
  const [finalBalance, setFinalBalance] = useState(0)

  const [otpInput, setOtpInput] = useState('');
  const [userEmail, setUserEmail] = useState(userDetails?.email || '')
  const [otpSid, setOtpSid] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const dispatch = useDispatch();

  const {data: userAcctBalance, isLoading: isLoadingUserAcctBalance, refetch: refetchUserAcctBalance} = useQuery({
    queryKey: ["userAcctBalance", user_id],
    queryFn: () => getUserAcctBalance(),
    enabled: !!user_id,
  })

  useEffect(() => {
    if(!isLoadingUserAcctBalance) {
      const starkWalletData = userAcctBalance?.filter((wallet) => wallet?.network === '23434')[0]?.balances?.filter((type) => type?.symbol === projectDetails?.currency?.toUpperCase())
      setAcctBalance(starkWalletData[0]);
      const balance = parseFloat(starkWalletData[0]?.balance) - parseFloat(projectDetails?.totalPrize);
      setFinalBalance(balance); 
    }
  }, [isLoadingUserAcctBalance,acctBalance,finalBalance])

  const handleGetCopperXOtp = async () => {
    if(projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus) return
    const otpUrl = 'https://income-api.copperx.io/api/auth/email-otp/request';
    const userEmail = userDetails?._id === projectDetails?.owner_id ? userDetails?.email : "";
    const otpBody = {
      email: userEmail
    }
    const otpRes = await fetch(otpUrl,{
      method: 'POST',
      body: JSON.stringify(otpBody),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())

    if(otpRes?.sid) {
      setUserEmail(userEmail);
      setOtpSid(otpRes?.sid);
      dispatch(displaySnackbar("Please enter CopperX OTP"))
      setShowOtpModal(true);
    } else {
      dispatch(displaySnackbar("Something went wrong!!"))
    }
  }

  const handleTransferReward = async () => {
    const data = {
      email: userEmail,
      otp: otpInput,
      sid: otpSid
    }

    const resp = await sendOpenProjectRewards(projectDetails?._id,data);
    console.log('otp res',resp);

    if(resp?.message === "payed" && resp?.data?.status === 'ok') {
      dispatch(displaySnackbar("Payment Initiated"))
      refetchUserAcctBalance();
      setShowOtpModal(false);
    } else if (resp?.err === 'OTP verification failed') {
        dispatch(displaySnackbar("Invalid OTP. Please enter correct OTP"))
    } else {
        dispatch(displaySnackbar("Payment Failed"))
    }
  }

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpInput('');
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
                <p className="col-span-2 text-white32 font-semibold text-[13px] font-inter">Name</p>
                {/* <p className="col-span-2 text-white32 font-semibold text-[13px] font-inter text-end">Project Link</p> */}
                <p  className="col-span-1 text-white32 font-semibold text-[13px] font-inter text-end">Reward</p>
              </div>
              <div>
                {selectedWinner?.map((winner, index) => (
                  <div key={index} className="grid grid-cols-4 w-full px-4 py-3 hover:bg-white12 cursor-pointer" onClick={() => navigate(`/profile/${winner.user}`)}>
                    <p className="col-span-1 text-[14px] text-white88 font-inter">{index + 1}</p>
                    <div className="col-span-2 text-[14px] text-white88 font-inter flex items-center gap-1">
                      <img src={winner?.user?.pfp || wpllogo} alt="user" className="size-[24px] rounded-md"/>
                      {winner?.user}
                    </div>
                    {/* <p className="col-span-2 text-[14px] text-white88 font-inter flex justify-end truncate">
                      <a href={winner?.submissionLink}>{winner?.submissionLink}</a>
                    </p> */}
                    <div className="col-span-1 text-[14px] text-white88 font-inter flex justify-end items-center gap-1">
                      <img src={projectDetails?.currency === 'STRK' ? STRKPng : USDCPng} alt="" className="size-[14px]"/>
                      <p>{winner?.prize}</p>
                      <p className="text-white48">{projectDetails?.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="w-full flex justify-end">
                <div className="flex justify-end items-center gap-1.5 bg-white7 rounded-lg w-fit px-2 py-1 font-gridular border border-white7 text-[14px] text-[#FFFFFFC4]">
                  <img src={SyncPng} alt="" className="size-[20px]"/>
                  <p>Pay in </p>
                  <img src={projectDetails?.currency === 'STRK' ? STRKPng : USDCPng} alt="" className="size-[18px]"/>
                  <p className="font-inter">{projectDetails?.currency}</p>
                </div>
              </div>

              <div className="w-[380px] bg-[#101C77] p-[6px] rounded-2xl mt-2">
                <div className="bg-[#091044] rounded-2xl flex justify-center items-center gap-2 h-[114px]">
                  <img src={projectDetails?.currency === 'STRK' ? STRKPng : USDCPng} alt="" className="size-[32px]"/>
                  <p className="text-[42px] text-primaryGreen font-gridular">{acctBalance?.balance || '--'}</p>
                  <p className="text-white48 font-inter">{projectDetails?.currency}</p>
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
                  <p className="text-[14px] font-gridular text-primaryYellow">{acctBalance?.balance || '--'} {projectDetails?.currency}</p>
                </div>
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-[4px] h-[41px] my-1">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Allocated</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">{projectDetails?.totalPrize} {projectDetails?.currency}</p>
                </div>
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-t-[4px] rounded-b-lg h-[41px]">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Final balance</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">{finalBalance} {projectDetails?.currency}</p>
                </div>
              </div>

              <div className="flex justify-end w-full mt-5">
                <div onClick={handleGetCopperXOtp} className={`w-[160px] h-[40px] relative ${projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <img src={YellowBtnPng} alt="" className={`h-[40px] rounded-md ${projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus ? 'cursor-not-allowed' : 'cursor-pointer'}`}/>
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2A3485] text-[14px] font-gridular">{projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus != 'failed' ? 'Rewarded' : 'Reward'}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <CustomModal isOpen={showOtpModal} closeModal={handleCloseOtpModal}>
        <div className='bg-primaryDarkUI border border-white4 rounded-md w-[500px] p-3'>
          <div className='flex justify-end'><X size={20} onClick={handleCloseOtpModal}  className='text-white88 hover:text-white64 cursor-pointer'/></div>
            <div>
              <p className='text-primaryYellow font-semibold font-gridular'>Enter CopperX OTP</p>
              <div className='h-[1px] bg-primaryYellow w-full mt-2 mb-5'/>
              <div className='flex flex-col mt-4 mb-4'>
                <label className='text-[13px] leading-[15.6px] font-medium text-white32 mb-1' htmlFor='otp'>OTP</label>
                <input 
                  type="text" 
                  value={otpInput} 
                  onChange={(e) => setOtpInput(e.target.value)} 
                  name="otp" 
                  id="otp"
                  placeholder='112233'
                  className='bg-white12 text-[14px] rounded-md py-2 px-2 text-white88 placeholder:text-white12 outline-none' 
                />
              </div>
              <FancyButton 
                src_img={btnImg} 
                hover_src_img={btnHoverImg} 
                img_size_classes='w-[500px] h-[44px]' 
                className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
                btn_txt='submit'  
                alt_txt='payment btn' 
                onClick={handleTransferReward}
              />
            </div>
        </div>
      </CustomModal>
    </div>
)
}

export default DistributeRewardsPage