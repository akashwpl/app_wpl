/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, DollarSign, Filter, Search, TimerIcon, Trophy } from 'lucide-react'
import USDCsvg from '../assets/svg/usdc.svg'
import wpl_logo from '../assets/images/wpl_prdetails.png'
import btnPng from '../assets/images/leaderboard_btn.png'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers, getLeaderboardData } from '../service/api'
import { Link, useNavigate } from 'react-router-dom'

import PlatformButtonPng from '../assets/images/platform-btn.png'
import WebsiteButtonPng from '../assets/images/website-btn.png'

const Leaderboard = () => {
   const navigate = useNavigate()

   const {data: leaderboardData, isLoading: isLoadingLeaderboard, refetch} = useQuery({
       queryKey: ["leaderboard"],
       queryFn: () => getLeaderboardData(),
   })

   const {data: usersLeaderboardData, isLoading: isLoadingAllUsers} = useQuery({
        queryKey: ["users"],
        queryFn: () => getAllUsers(),
   })

   const [showfilterModal, setShowFilterModal] = useState(false)
   const [currentData, setCurrentData] = useState([])
   const [sortBy, setSortBy] = useState('')
   const [sortOrder, setSortOrder] = useState('ascending')
   const [searchInput, setSearchInput] = useState()
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 10

   const [learderboardType, setleaderboardType] = useState(localStorage.getItem('leaderboardType') || 'website')
   
   const filteredData = useMemo(() => 
        learderboardType == 'website' ? 
       searchInput
       ? leaderboardData?.data?.filter(data =>
           data?.discordIdentifier?.toLowerCase().includes(searchInput.toLowerCase())
       )
       : sortBy == 'rewards' ? 
           leaderboardData?.data?.sort((a, b) => {
               return sortOrder == 'ascending' ? a.cumulativeLeaderboard - b.cumulativeLeaderboard : b.cumulativeLeaderboard - a.cumulativeLeaderboard;
           })
       : leaderboardData?.data
       : searchInput
       ? usersLeaderboardData?.filter(data =>
           data?.displayName?.toLowerCase().includes(searchInput.toLowerCase())
       )
       : sortBy == 'rewards' ? 
           usersLeaderboardData?.sort((a, b) => {
               return sortOrder == 'ascending' ? a.cumulativeLeaderboard - b.cumulativeLeaderboard : b.cumulativeLeaderboard - a.cumulativeLeaderboard;
           })
       : usersLeaderboardData?.filter(data => data?.role !== 'sponsor')
    
   , [searchInput, leaderboardData, sortBy, sortOrder, learderboardType, usersLeaderboardData])

   const indexOfLastItem = currentPage * itemsPerPage
   const indexOfFirstItem = indexOfLastItem - itemsPerPage

   useEffect(() => {
       if(isLoadingLeaderboard) return
       const updatedData = filteredData?.map((item, index) => {
        return {
          rank: index + 1,
          ...item,
        }
        })
       const data = updatedData?.slice(indexOfFirstItem, indexOfLastItem)
       setCurrentData(data)
   }, [leaderboardData, currentPage, searchInput, sortBy, sortOrder, learderboardType, usersLeaderboardData])

   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const pageNumbers = [];
   for (let i = 1; i <= Math.ceil(filteredData?.length / itemsPerPage); i++) {
     pageNumbers?.push(i);
   }

   const handleSortLeaderboard = (type) => {
       setSortBy(type); 
       setSortOrder((prev) => {
           if(prev == 'ascending') return 'descending'
           else return 'ascending'
       });
       setShowFilterModal(false)   
   }

   const handleChangeLeaderboardType = (type) => {
        setleaderboardType(type)
        localStorage.setItem('leaderboardType', type)
   }
    
   return (
       <div className='flex justify-center items-start min-h-screen pt-24 pb-24 text-white88'>
           <div className='md:w-[840px] max-w-[1200px]'>
                <div className='flex items-center mb-6 justify-end'>
                    <div onClick={() => handleChangeLeaderboardType('platform')} className={`${learderboardType == "platform" ? "bg-[#00000064]" : ""} relative h-[32px] w-[112px] cursor-pointer `}>
                        <img src={PlatformButtonPng} className='h-[32px] w-[120px]'/>
                        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primaryYellow text-[12px] leading-[8.82px] font-gridular uppercase'>Platform</p>
                    </div>
                    <div onClick={() => handleChangeLeaderboardType('website')} className={`${learderboardType == "website" ? "bg-[#00000064]" : ""} relative h-[32px] w-[112px] cursor-pointer`}>
                        <img src={PlatformButtonPng} className='rotate-180 -translate-x-[1px] h-[32px] w-[120px]'/>
                        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primaryYellow text-[12px] leading-[8.82px] font-gridular uppercase'>Website</p>
                    </div>
                </div>

               <div className={`w-full flex justify-center items-start flex-col h-[101px] py-5 px-6 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md`}>
                   <div className='w-full flex flex-col justify-between'>
                       <h2 className='text-[24px] font-gridular text-[#06105D]'>Start contributing Onchain</h2>
                       <p className='text-[#06105D] text-[14px] font-inter mt-1'>Earn in crypto by contributing to your fav projects</p>
                   </div>
               </div>
           
               <div className='border border-white7 h-[56px] rounded-[12px] flex justify-between items-center mt-8'>
                   <div className='flex items-center gap-2 w-full px-6'>
                       <Search className='text-white32' size={16}/>
                       <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-inter font-inter' placeholder='Search for address, name...'/>
                   </div>
                   <div className='border-l border-white7 min-w-[169px] h-full flex justify-center items-center relative'>
                       <div onClick={() => setShowFilterModal((prev) => !prev)} className='flex items-center justify-center gap-2 cursor-pointer hover:bg-white4 px-4'>
                           <Filter className='text-white32' size={15}/>
                           <p className='font-gridular text-[14px] text-white48'>Sort Results</p>
                       </div>

                       {showfilterModal && 
                           <div className="absolute w-[156px] top-12 -left-2 rounded-md bg-white4 backdrop-blur-[52px] py-3 flex flex-col px-4 z-50">
                               <p onClick={() => {setSortBy('tier'); setShowFilterModal(false)} } className="text-[14px] text-white88 hover:bg-white12 flex items-center gap-2 font-inter py-2 cursor-pointer rounded-md px-2"><Trophy size={16}/> Tier</p>
                               <div className="h-[1px] w-full bg-white7 my-1" />
                               <p onClick={() => handleSortLeaderboard('rewards')} className="text-[14px] text-white88 hover:bg-white12 flex items-center gap-2 font-inter py-2 cursor-pointer rounded-md px-2"><DollarSign size={16}/> Rewards</p>
                           </div>
                       }
                   </div>
               </div>

               <div className='mt-4 rounded-[12px] overflow-hidden'>
                   <table className='w-full'>
                       <thead className='bg-[#060E4F]'>
                           <tr className='h-[48px] text-[13px] text-white32 font-normal font-inter border-b border-white7'>
                               <td className='px-4'>Rank</td>
                               <td className={`${learderboardType == 'website' ? "w-[250px]" : "w-[530px]"}`}>Name</td>
                               <td className='w-[180px] text-left pl-6'>Rewards</td>
                               {learderboardType == 'website' && (
                                <>
                                   <td className='w-[180px] text-left pl-6'>Tier</td>
                                    <td className='w-[100px] text-right pr-6'>Total Points</td>
                                </>
                               )}
                           </tr>
                       </thead>
                       <tbody className='bg-[#060F54] font-normal font-inter text-white'>
                           {isLoadingLeaderboard ? <p>loading..</p> : currentData && currentData?.length > 0 ? (
                               currentData?.map((data, index) => (
                                   <tr key={index} className="hover:bg-[#051149] transition-colors duration-200">
                                       <td className="py-4 text-[14px] px-6">#{data?.rank}</td>
                                       <td className={`${learderboardType == 'website' ? "w-[250px]" : "w-[530px]"} py-4 w-[200px] truncate text-ellipsis cursor-pointer`}>
                                           <Link to={`/profile/${learderboardType == 'website' ? data.discordIdentifier + "-discord" : data?._id}`} className='flex items-center gap-2 px-0'>
                                               <img src={wpl_logo} alt="USDC" className="size-4" />
                                               <span className="text-white88 text-[14px]">{learderboardType == 'website' ? data.discordIdentifier : data?.displayName || data?.username}</span>
                                           </Link>
                                       </td>
                                       <td className="py-4 text-[14px] pl-6">
                                           <div className='flex justify-start items-center gap-1'>
                                               <img src={USDCsvg} alt="USDC" className="size-4" />
                                               <span>{learderboardType == 'website' ? data.rewards ? data.rewards : "0" : data?.totalEarned}</span> 
                                               <span className="font-thin" >USDC</span>
                                           </div>
                                       </td>
                                       {learderboardType == 'website' && (
                                        <>
                                            <td className="py-4 text-[14px] font-normal text-left pl-6">{data.newTier == "" ? data?.tier : data?.newTier}</td>
                                            <td className="py-4 text-[14px] font-normal text-right pr-6">{data.cumulativeLeaderboard}</td>
                                        </>
                                       )}
                                   </tr>
                               ))
                           ) : (
                               <tr>
                                   <td colSpan="6" className="py-4 text-center text-white48">
                                       No data available
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
               <div className="flex justify-end items-center gap-2 md:gap-6 mt-3">
                   <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='relative'>
                       <img src={btnPng} alt='' className='w-[34px] h-[23px]'/>
                       <ArrowLeft size={20} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-4 h-4 text-white48'/>
                   </button>
                   <div className='flex gap-4 text-white text-[12px] font-gridular'>
                   {pageNumbers.map((number) => {
                       if (number === 1 || number === pageNumbers.length || (number >= currentPage - 1 && number <= currentPage + 1)) {
                       return (
                           <button
                           key={number}
                           onClick={() => paginate(number)}
                           className={currentPage === number ? 'bg-[#293BBC] w-[20px] h-[18px]' : ''}
                           >
                           {number}
                           </button>
                       );
                       } else if (number === currentPage - 2 || number === currentPage + 2) {
                       return <span key={number}>...</span>;
                       }
                       return null;
                   })}
                   </div>
                   <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} className='relative'>
                       <img src={btnPng} alt='' className='w-[34px] h-[23px]'/>
                       <ArrowRight size={20} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-4 h-4 text-white48'/>
                   </button>
               </div>
           </div>
       </div>
   )
}

export default Leaderboard