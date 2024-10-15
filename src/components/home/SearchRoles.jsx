import { ChevronDown, X } from 'lucide-react'
import ethereumIcon from '../../assets/images/ethereum-icon.png'
import { useState } from 'react';



import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../../components/ui/select"

const SearchRoles = () => {

    const [roleName, setRoleName] = useState('');


  return (
    <div className="bg-[#050e52] w-full h-[97px] border border-white/10 rounded-lg mb-8">
        <p className="font-gridular text-primaryYellow text-[14px] leading-[16.8px] px-5 my-4">Search for the roles</p>
        <div className="flex flex-row justify-between gap-4 px-4">
            <div className="w-full h-[32px] bg-cardBlueBg2 rounded-md p-2 flex flex-row justify-between">
                <input 
                    className="bg-transparent border-transparent focus:outline-0 rounded-[6px] text-white88 placeholder:text-white48 w-full font-gridular text-[14px] leading-[16.8px]"
                    type="text" 
                    name="" 
                    id=""
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder='Product Designer'
                />
                <X className='text-white48 w-6 cursor-pointer' onClick={() => setRoleName('')} size={14}/>
            </div>
            {/* <div className="w-full h-[32px] bg-cardBlueBg2 rounded-md flex flex-row justify-between"> */}
            <div className="w-full h-[32px] bg-cardBlueBg2 rounded-md p-2 flex flex-row justify-between">
                <input 
                    className="bg-transparent border-transparent focus:outline-0 rounded-[6px] text-white88 placeholder:text-white48 w-full font-gridular text-[14px] leading-[16.8px]"
                    type="text" 
                    name="" 
                    id=""
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder='Product Designer'
                />
                <X className='text-white48 w-6 cursor-pointer' onClick={() => setRoleName('')} size={14}/>
            </div>

                {/* <p className="text-white88 font-gridular text-[14px] leading-[16.8px]">Professional</p> */}
                {/* <ChevronDown className='text-white48' size={14}/> */}
            {/* </div> */}
            <div className="w-full h-[32px] bg-cardBlueBg2 rounded-md p-2 flex flex-row justify-between">
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