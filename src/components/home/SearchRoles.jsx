import { ChevronDown, X } from 'lucide-react'
import ethereumIcon from '../../assets/images/ethereum-icon.png'
import { useState } from 'react';

const SearchRoles = ({ tiles, handleRemoveTile }) => {

    return (
        <div className="bg-[#050e52] w-full border border-white/10 rounded-lg mb-8">
            {/* {tiles?.length ==  && <p className="font-gridular text-primaryYellow text-[14px] leading-[16.8px] px-5 my-4">Search for the roles</p>} */}
            <div className="flex flex-row justify-between gap-4 px-4 py-2">
                <div className="w-full rounded-md flex flex-row flex-wrap gap-2">
                    {tiles && tiles?.map((tile, index) => (
                        <div className="bg-cardBlueBg2 flex justify-between items-center px-2 py-2 border-transparent focus:outline-0 rounded-[6px] text-white88 w-[250px] font-gridular text-[14px] leading-[16.8px]">
                            {tile}
                            <X  className='text-white48 w-6 cursor-pointer hover:text-white64 scale-105 transition duration-300' onClick={() => handleRemoveTile(tile)} size={14}/>
                        </div>
                    ))}                   
                </div>

                    {/* <p className="text-white88 font-gridular text-[14px] leading-[16.8px]">Professional</p> */}
                    {/* <ChevronDown className='text-white48' size={14}/> */}
                {/* </div> */}
                <div className="w-[258px] h-[32px] bg-cardBlueBg2 rounded-md p-2 flex flex-row justify-between">
                    <div className='flex flex-row'>
                        <img src={ethereumIcon} alt="Ethereum icon"/>
                        <p className="text-white opacity-[88%] font-gridular text-[14px] leading-[16.8px] ml-2">Ethereum</p>
                    </div>
                    <ChevronDown className='text-white48' size={14}/>
                </div>
            </div>
        </div>
    )
}

export default SearchRoles