import { ChevronDown, Search, X } from 'lucide-react'
import ethereumIcon from '../../assets/images/ethereum-icon.png'
import { useState } from 'react';

const SearchRoles = ({ tiles, handleRemoveTile, handleKeyboardEnter, searchInput, handleSearch }) => {

    return (
        <div className="bg-black/10 w-full border border-white/10 rounded-lg mb-8 p-4">

            <div>
                <h2 className='font-gridular text-[14px] text-primaryYellow'>Search for the roles</h2>
            </div>

            {/* {tiles?.length ==  && <p className="font-gridular text-primaryYellow text-[14px] leading-[16.8px] px-5 my-4">Search for the roles</p>} */}
            <div className="flex flex-row justify-between gap-4 py-2">
                <div className="w-full rounded-md flex flex-row flex-wrap gap-2">
                    {tiles && tiles?.map((tile, index) => (
                        <div className="bg-cardBlueBg2 flex justify-between items-center px-2 py-2 border-transparent focus:outline-0 rounded-[6px] text-white88 w-[250px] font-gridular text-[14px] leading-[16.8px]">
                            {tile}
                            <X className='text-white48 w-6 cursor-pointer hover:text-white64 scale-105 transition duration-300' onClick={() => handleRemoveTile(tile)} size={14}/>
                        </div>
                    ))}   
                    <div className='flex items-center gap-2 w-full border border-white7 rounded-md px-2 h-[32px]'>
                        <input onKeyDown={handleKeyboardEnter} value={searchInput} onChange={handleSearch}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' placeholder='Search for you fav Org, role...'/>
                        <Search className='text-white32' size={16}/>
                    </div>    
                </div>

                <div className="min-w-[280px] h-[32px] bg-cardBlueBg2 rounded-md px-2 flex flex-row justify-between">
                    <select className='bg-transparent h-full outline-none border-none text-white88 font-gridular w-full text-[14px]'>
                        <option className='text-white88 font-gridular text-[14px]'>All</option>
                        <option className='text-white88 font-gridular text-[14px]'>Professional</option>
                    </select>
                </div>

                <div className="min-w-[280px] h-[32px] bg-cardBlueBg2 rounded-md px-2 flex flex-row justify-between">
                    <select className='bg-transparent h-full outline-none border-none text-white88 font-gridular w-full text-[14px]'>
                        <option className='text-white88 font-gridular text-[14px]'>All</option>
                        <option className='text-white88 font-gridular text-[14px]'>Starknet</option>
                        <option className='text-white88 font-gridular text-[14px]'>
                            <div className='flex flex-row'>
                                <img src={ethereumIcon} alt="Ethereum icon"/>
                                <p className="text-white opacity-[88%] font-gridular text-[14px] leading-[16.8px] ml-2">Ethereum</p>
                            </div>
                        </option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SearchRoles