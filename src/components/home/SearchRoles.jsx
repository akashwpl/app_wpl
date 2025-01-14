import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getAllOrganisations } from '../../service/api';
import Spinner from '../ui/spinner';
import arrow from '../../assets/images/arrow.png';


const SearchRoles = ({ tiles, handleRemoveTile, handleKeyboardEnter, searchInput, handleSearch, handleFoundationFilterChange }) => {

    const [selectedOrd, setSelectedOrg] = useState("All");

    const {data: organisationsDetails, isLoading: isLoadingOrganisationDetails} = useQuery({
        queryKey: ["allOrganisations"],
        queryFn: () => getAllOrganisations(),
    })


  const menuRef = useRef(null);

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [slideUserMenu, setSlideUserMenu] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target)
      ) {
        setSlideUserMenu(false);
        setTimeout(() => {
          setShowUserMenu(false);
        }, 300);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[menuRef])

  const handleMenuToggle = () => {
    setSlideUserMenu(!slideUserMenu);
    setTimeout(() => {
      setShowUserMenu(!showUserMenu);
    }, 300);
  }

    return (
        <div className="bg-black/10 w-full border border-white/10 rounded-lg mb-8 p-4 gap-3 flex">

          <div className='w-full'>
            <div>
              <h2 className='font-gridular text-[14px] text-primaryYellow mb-1'>Search for roles</h2>
            </div>
            <div className="w-full flex bg-cardBlueBg2 border border-white7 p-1 rounded-md flex-wrap gap-1">
                    {tiles && tiles?.map((tile, index) => (
                        <div className="flex justify-between items-center px-2 py-2 border-transparent focus:outline-0 rounded-[6px] text-white w-fit min-w-[100px] font-gridular text-[14px] leading-[16.8px] bg-white/5">
                            {tile}
                            <X className='text-white48 w-6 cursor-pointer hover:text-white64 scale-105 transition duration-300' onClick={() => handleRemoveTile(tile)} size={14}/>
                        </div>
                    ))}   
                    <div className='flex items-center gap-2 w-full px-2 h-[32px]'>
                        {tiles?.length === 0 && <Search className='text-white32' size={16}/>}
                        <input 
                            onKeyDown={handleKeyboardEnter} 
                            value={searchInput} 
                            onChange={handleSearch}  
                            className='bg-transparent w-full outline-none border-none text-white88 font-gridular text-[14px] placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' 
                            placeholder={tiles?.length === 0 ? 'Search for your fav org, role...' : ''}
                        />
                    </div>
            </div>
          </div>

          <div>
            <p className='font-gridular text-[14px] text-primaryYellow mb-1'>Organisations</p>
            <div
                ref={menuRef}
                onClick={() => {handleMenuToggle()}}
                className="relative cursor-pointer flex flex-row items-center z-50 w-[250px] h-[42px] bg-white7 border border-white7 rounded-md p-2 text-primaryYellow font-gridular text-[14px]"
                >
                  <div className='flex justify-between items-center w-full'>
                    <p>{selectedOrd}</p>
                      <img
                        src={arrow}
                        width={18}
                        alt="down arrow"
                        className={`${showUserMenu ? "animate-step-rotate" : "animate-step-rotate-back"} transition-all`}
                      />
                  </div>
                    {showUserMenu && (
                        <>
                            <div
                                className={`z-50 rounded-lg backdrop-blur-2xl bg-black/20  bg-cover w-full absolute top-12 right-0 text-primaryYellow text-[14px] font-gridular uppercase h-auto max-h-[400px] overflow-y-auto ${
                                slideUserMenu ? 'animate-menu-slide-in' : 'animate-menu-slide-out'
                                }`}
                            >
                                {isLoadingOrganisationDetails ? <Spinner /> : [{name: "All"}, ...organisationsDetails]?.map((org, idx) => (
                                    <div key={idx} onClick={() => {handleFoundationFilterChange(org?.name); setSelectedOrg(org.name)}} className='p-2 hover:bg-white12 cursor-pointer rounded-md'>
                                        {org.name}
                                    </div>
                                ))}  
                            </div>
                        </>
                    )}
            </div>
          </div>

        </div>
    )
}

export default SearchRoles

// TODO :: SPONOSR PROFILE CHNAGES 
//  BIO NAME IMG SLINKs