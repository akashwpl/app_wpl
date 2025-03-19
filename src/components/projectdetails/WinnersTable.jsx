import React from 'react'
import STRKPng from '../../assets/images/strk.png'
import USDCPng from '../../assets/images/usdc.png'
import wpllogo from '../../assets/svg/wolf_logo.svg'
import { useNavigate } from 'react-router-dom'

const WinnersTable = ({projectDetails}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex gap-6 mt-6">
      <div className="bg-[#091044] rounded-xl w-full h-fit">
        <div className="grid grid-cols-4 w-full px-4 border-b border-white7 py-3">
          <p className="col-span-1 text-white32 font-semibold text-[13px] font-inter">Rank</p>
          <p className="col-span-2 text-white32 font-semibold text-[13px] font-inter">Name</p>
          {/* <p className="col-span-2 text-white32 font-semibold text-[13px] font-inter text-end">Project Link</p> */}
          <p  className="col-span-1 text-white32 font-semibold text-[13px] font-inter text-end">Reward</p>
        </div>
        <div>
          {projectDetails?.winners?.map((winner, index) => (
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

    </div>
  )
}

export default WinnersTable