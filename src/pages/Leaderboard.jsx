import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, DollarSign, Filter, Search, TimerIcon, Trophy } from 'lucide-react'
import USDCsvg from '../assets/svg/usdc.svg'
import wpl_logo from '../assets/images/wpl_prdetails.png'
import btnPng from '../assets/images/leaderboard_btn.png'
import { useQuery } from '@tanstack/react-query'
import { getLeaderboardData } from '../service/api'


const Leaderboard = () => {


    const {data: leaderboardData, isLoading: isLoadingLeaderboard, refetch} = useQuery({
        queryKey: ["leaderboard"],
        queryFn: () => getLeaderboardData(),
    })

    const [showfilterModal, setShowFilterModal] = useState(false)
    const [currentData, setCurrentData] = useState([])

    const [sortBy, setSortBy] = useState('')
    const [sortOrder, setSortOrder] = useState('ascending')

    const [searchInput, setSearchInput] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredData = useMemo(() => 
        searchInput
        ? leaderboardData?.data?.filter(data =>
            data?.discordIdentifier?.toLowerCase().includes(searchInput.toLowerCase())
        )
        : sortBy == 'rewards' ? 
            leaderboardData?.data?.sort((a, b) => {
                return sortOrder == 'ascending' ? a.cumulativeLeaderboard - b.cumulativeLeaderboard : b.cumulativeLeaderboard - a.cumulativeLeaderboard;
            })
        : leaderboardData?.data
    , [searchInput, leaderboardData, sortBy, sortOrder])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage

    useEffect(() => {
        if(isLoadingLeaderboard) return
        const data = filteredData?.slice(indexOfFirstItem, indexOfLastItem)
        setCurrentData(data)
    }, [leaderboardData, currentPage, searchInput, sortBy, sortOrder])

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
     
  return (
    <div className='flex justify-center items-center'>
        <div className='md:w-[800px] max-w-[1200px] mt-6'>
            <div className={`mr-3 w-full flex justify-center items-start flex-col h-[101px] py-5 px-4 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md `}>
                    <div className='w-full flex flex-col justify-between'>
                    <h2 className='text-[18px] font-gridular text-[#06105D]'>Start contributing Onchain</h2>
                    <p className='text-[#06105D] text-[13px] font-inter'>Earn in crypto by contributing to your fav projects</p>
                </div> 
            </div>
        
            <div className='border border-white7 h-[56px] rounded-md flex justify-between items-center mt-4'>
                <div className='flex items-center gap-2 w-full ml-3'>
                    <Search className='text-white32' size={16}/>
                    <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' placeholder='Search for address, name...'/>
                </div>
                <div className='border border-white7 min-w-[169px] h-full flex justify-center items-center relative'>
                    <div onClick={() => setShowFilterModal((prev) => !prev)} className='flex items-center justify-center border border-white7 rounded-md px-2 py-[6px] gap-1 cursor-pointer hover:bg-white4'>
                        <Filter className='text-white32' size={15}/>
                        <p className='font-gridular text-[14px] text-white48'>Sort Results</p>
                    </div>

                    {showfilterModal && 
                        <div className="absolute w-[150px] top-12 left-4 bg-primaryBlue rounded-md">
                            <p onClick={() => {setSortBy('tier'); setShowFilterModal(false)} } className="text-[14px] text-white88 font-semibold hover:bg-white12 pl-4 flex items-center gap-1 font-inter py-2 cursor-pointer"><Trophy size={16}/> Tier</p>
                            <div className="h-[1px] w-full bg-white12 my-1" />
                            <p onClick={() => handleSortLeaderboard('rewards')} className="text-[14px] text-white88 font-semibold hover:bg-white12 pl-4 flex items-center gap-1 font-inter py-2 cursor-pointer"><DollarSign size={16}/> Rewards</p>
                        </div>
                    }
                </div>
            </div>

            <div className='mt-8'>
                <div>
                    <table className='w-full bg-[#060e54] rounded-md h-[340px]'>
                        <thead>
                            <tr className='text-[14px] bg-black7 text-white48 font-inter rounded-md'>
                                <th className='py-4 text-white32 font-inter font-semibold'>Rank</th>
                                <th className='py-4 text-white32 font-inter font-semibold text-start w-[200px]'>Name</th>
                                <th className='py-4 text-white32 font-inter font-semibold text-end pr-2'>Rewards</th>
                                <th className='py-4 text-white32 font-inter font-semibold text-end pr-2'>Tier</th>
                                <th className='py-4 text-white32 font-inter font-semibold text-end pr-2'>Total Points</th>
                            </tr>
                        </thead>
                        <tbody className='h-full'>
                            {isLoadingLeaderboard ? <p>loading..</p> : currentData && currentData?.length > 0 ? (
                                currentData?.map((data, index) => (
                                    <tr key={index} className="text-[14px] text-white48 font-inter border-b border-white7 h-fit">
                                        <td className="py-4 text-[14px] text-end pr-3">#{index + 1}</td>
                                        <td className="py-4 w-[200px] truncate text-ellipsis">
                                            <p className="flex items-center gap-1 text-white88 text-[14px]">
                                                <img src={wpl_logo} alt="USDC" className="size-4" />
                                                {data.discordIdentifier}
                                            </p>
                                        </td>
                                        <td className="py-4 text-[14px] text-end text-white88">
                                            <p className='flex justify-end items-center gap-1'>
                                                <img src={USDCsvg} alt="USDC" className="size-4" />
                                                {data.rewards ? data.rewards : "--"}
                                            </p>
                                        </td>
                                        <td className="py-4 text-[14px] text-end pr-2">{data.newTier == "" ? data?.tier : data?.newTier}</td>
                                        <td className="py-4 text-[14px] text-end pr-2">{data.cumulativeLeaderboard}</td>
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


const dummyData = [
    {name: "John Doe", rewards: "1000", wplPoints: "1000", bountyPoints: "1000", totalPoints: "12345"},
    {name: "Jane Doe", rewards: "1000", wplPoints: "1000", bountyPoints: "1000", totalPoints: "12345"},
    {name: "John Wick", rewards: "100", wplPoints: "10000", bountyPoints: "10000", totalPoints: "1901"},
    {name: "Rahul Subramanium", rewards: "9000", wplPoints: "9000", bountyPoints: "109000", totalPoints: "193485"},
    {name: "Subaru", rewards: "105000", wplPoints: "100500", bountyPoints: "105000", totalPoints: "140005"},
    {name: "Derek Dow", rewards: "9000", wplPoints: "19000", bountyPoints: "101200", totalPoints: "129075"},
]