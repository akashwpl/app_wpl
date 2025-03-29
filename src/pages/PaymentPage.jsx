import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import SyncPng from '../assets/images/sync.png'
import USDCPng from '../assets/images/usdc.png'
import STRKPng from '../assets/images/strk.png'
import trophySVG from '../assets/icons/pixel-icons/trophy-yellow.svg'
import trophyPNG from '../assets/icons/trophy-fill.png'
import { getAllUsers, getUserAcctBalance, getUserDetails, sendOpenProjectRewards } from "../service/api"

import { ArrowLeft, CheckCheck, Menu, X } from "lucide-react"
import YellowBtnPng from '../assets/images/yellow_button.png'
import { displaySnackbar } from "../store/thunkMiddleware"
import { useEffect, useState } from "react"
import FancyButton from "../components/ui/FancyButton"
import btnHoverImg from '../assets/svg/btn_hover_subtract.png';
import btnImg from '../assets/svg/btn_subtract_semi.png';
import CustomModal from "../components/ui/CustomModal"
import wpllogo from '../assets/svg/wolf_logo.svg'
import { useNavigate } from "react-router-dom"
import redBtnHoverImg from '../assets/svg/close_proj_btn_hover_subtract.png';
import redBtnImg from '../assets/svg/close_proj_btn_subtract.png';
import greenBtnHoverImg from '../assets/svg/green_btn_hover_subtract.png';
import greenBtnImg from '../assets/svg/green_btn_subtract.png';

const PaymentPage = () => {
  const { user_id } = useSelector((state) => state)
  const navigate = useNavigate()

  const {data: userDetails} = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })

  const [currency, setCurrency] = useState('USDC')
  const [payAmt, setPayAmt] = useState(1)

  const [acctBalance, setAcctBalance] = useState({});
  const [finalBalance, setFinalBalance] = useState(0)

  const [otpInput, setOtpInput] = useState('');
  const [userEmail, setUserEmail] = useState(userDetails?.email || '')
  const [otpSid, setOtpSid] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [paymentChoice, setPaymentChoice] = useState('email')

  const [allUserData, setAllUserData] = useState([])

  const dispatch = useDispatch();

  const {data: userAcctBalance, isLoading: isLoadingUserAcctBalance, refetch: refetchUserAcctBalance} = useQuery({
    queryKey: ["userAcctBalance", user_id],
    queryFn: () => getUserAcctBalance(),
    enabled: !!user_id,
  })

  const {data: allUsers, isLoading: isLoadingAllUsers} = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  })

  useEffect(() => {
    if(!isLoadingAllUsers) {
      const usersData = allUsers?.map(({displayName,email,username,_id}) => {
        return {
          displayName,
          email,
          username,
          _id
        }
      })
      setAllUserData(usersData)
    }
  },[isLoadingAllUsers])

  console.log('all user',allUserData);

  useEffect(() => {
    if(!isLoadingUserAcctBalance) {
      if(userAcctBalance.err) {
        alert("Please enter your CopperX access token in WPL profile section to proceed with payments");
        navigate(`/profile/${user_id}`)
      } else {
        const starkWalletData = userAcctBalance?.filter((wallet) => wallet?.network === '23434')[0]?.balances?.filter((type) => type?.symbol === currency?.toUpperCase())
        const data = starkWalletData ? starkWalletData[0] : {}
        setAcctBalance(data);
        const balance = parseFloat(data?.balance) - parseFloat(payAmt);
        if(isNaN(balance)) setFinalBalance(data?.balance)
        else setFinalBalance(balance); 
      }
    }
  }, [isLoadingUserAcctBalance,payAmt,currency])

  const handleGetCopperXOtp = async () => {
    // if(projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus) return
    const otpUrl = 'https://income-api.copperx.io/api/auth/email-otp/request';
    const userEmail = userDetails?.email || "";
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
    // const data = {
    //   email: userEmail,
    //   otp: otpInput,
    //   sid: otpSid
    // }

    // const resp = await sendOpenProjectRewards(projectDetails?._id,data);
    // console.log('otp res',resp);

    // if(resp?.message === "payed" && resp?.data?.status === 'ok') {
    //   dispatch(displaySnackbar("Payment Initiated"))
    //   refetchUserAcctBalance();
    //   setShowOtpModal(false);
    // } else if (resp?.err === 'OTP verification failed') {
    //     dispatch(displaySnackbar("Invalid OTP. Please enter correct OTP"))
    // } else {
    //     dispatch(displaySnackbar("Payment Failed"))
    // }
  }

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpInput('');
  }

  const toggleCurrency = () => {
    if(currency === 'USDC') setCurrency('STRK');
    else setCurrency('USDC')
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

      <div className="flex justify-center items-end pt-10 mb-40">
        <div className='size-full flex flex-col justify-center items-center max-w-[1024px]'>
          <div className='w-full'>
            <div className="mb-8">
                <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey {userDetails ? userDetails?.displayName : "User"}, your numbers are looking great!</p>
                  <div className="flex flex-row text-primaryBlue gap-2">
                    <div className="w-full h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                        <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Remaining balance</p>
                        <div className="flex">
                          <p className='font-gridular text-[42px] leading-[50.4px]'>{finalBalance}</p>
                        </div>
                    </div>
                    <div className='w-1/2 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg'>
                      <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Rewarded Amount</p>
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

          <div className="w-full flex gap-6 mt-6">

            {/* Left side payment box */}
            <div className="bg-[#101C77] rounded-xl w-full h-fit py-6 px-5">
              <div className="flex flex-col items-center justify-center gap-1.5 mb-6">
                <img src={trophyPNG} className="size-11" alt="Trophy" />
                <p className="text-primaryYellow font-gridular text-[24px]">Reward a Contributor</p>
                <p className="text-white32 font-inter text-[14px] w-72 text-center">Support those who added value, even if they didn't win</p>
              </div>

              {/* Payment input box */}
              <div className="bg-[#091044] flex flex-col gap-2 w-full h-fit py-6 px-3">
                <div className='flex items-center gap-1'>
                  <Menu size={14} className='text-primaryYellow'/>
                  <p className='text-primaryYellow font-inter text-[14px]'>Pay the Contributor</p>
                </div>
                <div className="border border-b-primaryYellow my-3.5"></div>
                <div className="flex flex-col gap-1.5 font-inter text-[14px]">
                  <label className="text-[13px] font-medium text-white32" htmlFor="payment_mtd">Payment Method</label>
                  <select onChange={(e) => setPaymentChoice(e.target.value)} value={paymentChoice} className="h-10 bg-[#1A2151] text-white88 cursor-pointer px-3 outline-none" name="payment_mtd" id="payment_mtd">
                    {/* <option value="wallet_address">Wallet Address</option> */}
                    <option value="email">Email Id</option>
                    <option value="username">WPL username</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 font-inter text-[14px] mt-3">
                  <label className="text-[13px] font-medium text-white32" htmlFor="user_payment_details">Enter {paymentChoice === 'email' ? 'Email address' : 'WPL username'}</label>
                  <input className="w-full h-10 bg-[#1A2151] text-white88 outline-none px-3" placeholder={paymentChoice === 'email' ? 'janedoe@wpl.com' : 'Jane Doe'} type="text" id="user_payment_details" name="user_payment_details" />
                </div>
                <div className='mt-3'>
                  <p className='text-[13px] font-semibold text-white32 font-inter mb-[6px]'>Amount <span className='text-[#F03D3D]'>*</span></p>
                  <div className='flex items-center gap-2 w-full'>
                    <div className='bg-[#091044] rounded-md py-2 w-[110px] flex justify-evenly items-center gap-1'>
                      <img src={currency === 'STRK' ? STRKPng : USDCPng} alt='usdc' className='size-[16px] rounded-sm'/>
                      <p className='text-white88 font-semibold font-inter text-[12px]'>{currency}</p>
                    </div>
                    <div className='w-full'>
                      <div className='bg-white7 rounded-md px-3 py-2'>
                        <input 
                          type='number' 
                          placeholder='1200' 
                          className='bg-transparent text-white88 placeholder:text-white32 outline-none border-none w-full'
                          value={payAmt} 
                          onChange={(e) => setPayAmt(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                  {/* {errors.prizeApproved && <p className='text-red-500 font-medium text-[12px]'>{errors.prizeApproved}</p>} */}
                </div>
              </div>

              <div className='flex items-center justify-around gap-4 mt-3'>
                  <>
                    <FancyButton 
                      src_img={redBtnImg} 
                      hover_src_img={redBtnHoverImg} 
                      img_size_classes='w-[250px] h-[44px]' 
                      className='font-gridular text-[14px] leading-[16.8px] text-primaryRed mt-0.5'
                      btn_txt={<span className='flex items-center justify-center gap-2'><X size={14}/><span>Go Back</span></span>} 
                      alt_txt='submission reject btn' 
                      onClick={() => navigate('/')}
                    />
                    <FancyButton 
                      src_img={greenBtnImg} 
                      hover_src_img={greenBtnHoverImg} 
                      img_size_classes='w-[250px] h-[44px]' 
                      className='font-gridular text-[14px] leading-[16.8px] text-primaryGreen mt-0.5'
                      btn_txt={<span className='flex items-center justify-center gap-2'><CheckCheck size={14}/><span>Confirm</span></span>}  
                      alt_txt='submission accept btn' 
                      onClick={handleGetCopperXOtp}
                    />
                  </>
                </div> 
            </div>

            {/* Right side reward data box */}
            <div>
              <div className="w-full flex justify-end">
                <div onClick={toggleCurrency} className="flex justify-end items-center gap-1.5 bg-white7 rounded-lg w-fit px-2 py-1 font-gridular cursor-pointer border border-white7 text-[14px] text-[#FFFFFFC4]">
                  <img src={SyncPng} alt="" className="size-[20px]"/>
                  <p>Pay in </p>
                  <img src={currency === 'STRK' ? STRKPng : USDCPng} alt="" className="size-[18px]"/>
                  <p className="font-inter">{currency}</p>
                </div>
              </div>

              <div className="w-[380px] bg-[#101C77] p-[6px] rounded-2xl mt-2">
                <div className="bg-[#091044] rounded-2xl flex justify-center items-center gap-2 h-[114px]">
                  <img src={currency === 'STRK' ? STRKPng : USDCPng} alt="" className="size-[32px]"/>
                  <p className="text-[42px] text-primaryGreen font-gridular">{acctBalance?.balance || '--'}</p>
                  <p className="text-white48 font-inter">{currency}</p>
                </div>
                {/* <div className="mt-2 flex gap-1">
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">150 USDC</div>
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">500 USDC</div>
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">1000 USDC</div>
                  <div className="bg-[#FFFFFF12] border border-[#FFFFFF12] rounded-md w-[89px] h-[32px] flex justify-center items-center text-[13px] text-white font-gridular">2000 USDC</div>
                </div> */}
              </div>

              <div className="w-[380px] bg-[#101C77] p-[6px] rounded-2xl mt-5">
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-t-lg rounded-b-[4px] h-[41px]">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Current balance</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">{acctBalance?.balance || '--'} {currency}</p>
                </div>
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-[4px] h-[41px] my-1">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Allocated</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">{payAmt} {currency}</p>
                </div>
                <div className="bg-[#06105D] flex justify-between items-center px-4 rounded-t-[4px] rounded-b-lg h-[41px]">
                  <p className="text-[13px] font-semibold font-inter text-[#FFFFFFA8]">Final balance</p>
                  <p className="text-[14px] font-gridular text-primaryYellow">{finalBalance} {currency}</p>
                </div>
              </div>

              {/* <div className="flex justify-end w-full mt-5">
                <div onClick={handleGetCopperXOtp} className={`w-[160px] h-[40px] relative ${projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <img src={YellowBtnPng} alt="" className={`h-[40px] rounded-md ${projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus ? 'cursor-not-allowed' : 'cursor-pointer'}`}/>
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2A3485] text-[14px] font-gridular">{projectDetails?.paymentStatus != 'ready' && projectDetails?.paymentStatus != 'failed' ? 'Rewarded' : 'Reward'}</p>
                </div>
              </div> */}

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

export default PaymentPage