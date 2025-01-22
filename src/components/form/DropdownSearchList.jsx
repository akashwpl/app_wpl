import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import arrow from '../../assets/images/arrow.png';

const DropdownSearchList = ({ dropdownList, setterFunction = () => {}, placeholderText='Search for roles eg. Frontend', prefilledTiles=[] }) => {

  const [selectedMembers, setSelectedMembers] = useState(prefilledTiles);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [slideUserMenu, setSlideUserMenu] = useState(false)

  useEffect(() => {
    setterFunction(selectedMembers)
  }, [selectedMembers]);

  const handleInputChange = (event) => {
		const inputBoxValue = event.target.value;
    setInputValue(inputBoxValue);
    if (inputBoxValue.length > 0) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  const handleKeyPress = (event) => {
    if (
      event.key === 'Enter' && 
      filteredMembers.length > 0
    ) {
      if(selectedMembers.some((m) => m === filteredMembers[0])) {
        setInputValue('');
        return
      }
      setSelectedMembers([...selectedMembers, filteredMembers[0]]);
      // Clear the input field (optional)
      setIsDropdownVisible(false);
      setInputValue(''); 
    }
  };

  const handleMemberClick = (member) => {
    if (!selectedMembers.some((m) => m === member)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setIsDropdownVisible(false);
    setInputValue('');
  };

  const handleRemoveMember = (member) => {
    setSelectedMembers(selectedMembers?.filter((m) => m !== member));
  };

  const filteredMembers = dropdownList.filter((member) => {
    const searchTerm = inputValue?.toLowerCase();
    // Filter even for empty searchTerm
		// if(searchTerm=='') return;
    return member.toLowerCase().includes(searchTerm);
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setSlideUserMenu(false);
        setTimeout(() => {
          setIsDropdownVisible(false)
        }, 300);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[dropdownRef])

  const handleMenuToggle = () => {
    setSlideUserMenu(!slideUserMenu);
    setTimeout(() => {
      setIsDropdownVisible(!isDropdownVisible)
    }, 300);
  }

  return (
    <>
      {selectedMembers?.length > 0 &&
        <div className='flex flex-wrap gap-2 h-fit mb-2'>
        {selectedMembers?.map((member,i) => (
          <div 
          key={i}
          className='bg-cardGithubBlueBg rounded-[6px] px-2 py-2 flex gap-1 items-center w-fit'
					>
            <p className='text-white88 text-[14px] leading-[20px]'>{member}</p>
						<X onClick={() => handleRemoveMember(member)} size={14} className='text-white32 cursor-pointer' />
          </div>
        ))}
			</div>
      }
      <div 
        ref={dropdownRef}
        onClick={() => {handleMenuToggle()}}
        className='flex flex-col gap-1 w-full relative h-full'
        >
        {/* <label htmlFor='gitTeammates' className='text-[13px] leading-[15.6px] font-medium text-white32'>Search for Roles</label> */}
        <input
          ref={inputRef}
          className="bg-white7 rounded-[6px] text-white48 placeholder:text-white32 my-1 px-3 pl-8 py-2 text-[14px] focus:outline-0 focus:bg-white7"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholderText}
          />
        <Search size={16} className='text-white32 absolute left-2 top-4' />
        <img
          src={arrow}
          width={18}
          alt="down arrow"
          className={`${isDropdownVisible ? "animate-step-rotate" : "animate-step-rotate-back"} transition-all absolute top-4 right-3`}
        />
        {isDropdownVisible  && (
          <div 
          className={`bg-cardGithubBlueBg w-full bg-cover absolute top-11 right-1 z-10 overflow-y-auto ${slideUserMenu ? 'animate-menu-slide-in' : 'animate-menu-slide-out'} ${filteredMembers.length > 4 ? 'overflow-y-scroll h-40' : 'overflow-hidden h-fit'} `}>
            {filteredMembers?.map((member,i) => (
              <div 
              onClick={() => handleMemberClick(member)}
              key={i}
              className={`flex gap-2 rounded-lg items-center font-inter p-2 cursor-pointer hover:bg-white12 ${(i != filteredMembers.length-1) && 'border border-dotted border-transparent border-b-white12'}`}
              >
                <p className='text-white88 text-[14px] leading-[20px]'>{member}</p>
              </div>
            ))}
          </div>
        )}
        {isDropdownVisible && filteredMembers?.length === 0 && inputValue?.length > 0 && (
          <div className='flex justify-center items-center font-inter py-3 bg-cardGithubBlueBg rounded-[6px] px-3 w-full absolute top-[54px] left-0 z-50'>
            <p className='text-white32 font-medium text-[12px] leading-[14.4px]'>No Role found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownSearchList;