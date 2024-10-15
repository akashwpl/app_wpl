import { Search, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const GithubSearchBox = ({ teamList }) => {

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  const handleInputChange = (event) => {
		const inputBoxValue = event.target.value;
    setInputValue(inputBoxValue);
    if (inputBoxValue.length > 0) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  const handleMemberClick = (member) => {
    if (!selectedMembers.some((m) => m.githubId === member.githubId)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setIsDropdownVisible(false);
    setInputValue('');
  };

  const handleRemoveMember = (member) => {
    setSelectedMembers(selectedMembers.filter((m) => m.githubId !== member.githubId));
  };

  const filteredMembers = teamList.filter((member) => {
    const searchTerm = inputValue.toLowerCase();
    // Filter even for empty searchTerm
		if(searchTerm=='') return;
    return member.username.toLowerCase().includes(searchTerm) || member.githubId.toLowerCase().includes(searchTerm);
  });

	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

  return (
    <div 
			ref={dropdownRef}
			className='flex flex-col gap-1 w-full relative'
		>
      <label htmlFor='gitTeammates' className='text-[13px] leading-[15.6px] font-medium text-white32'>Add your teammates from Github</label>
      <input
        ref={inputRef}
        className="bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
				onFocus={() => setIsDropdownVisible(true)}
        placeholder="@username"
      />
			<Search size={16} className='text-white32 absolute right-3 top-[30px]' />
      {isDropdownVisible && filteredMembers.length > 0 && (
        <div 
					className='bg-cardGithubBlueBg rounded-[6px] px-3 w-full absolute top-[62px] left-0 z-50'>
          {filteredMembers.map((member,i) => (
						<div 
							onClick={() => handleMemberClick(member)}
							key={member.githubId}
							className={`flex gap-2 items-center font-inter py-2 cursor-pointer ${(i != filteredMembers.length-1) && 'border border-dotted border-transparent border-b-white12'}`}
						>
							<img src={member.img} alt="Profile pic" width={24} height={24} className='rounded'/>
							<p className='text-white88 text-[14px] leading-[20px]'>{member.username}</p>
							<p className='text-white32 font-medium text-[12px] leading-[14.4px]'>@{member.githubId}</p>
						</div>
          ))}
        </div>
      )}
      {isDropdownVisible && filteredMembers.length === 0 && inputValue.length > 0 && (
        <div className='flex justify-center items-center font-inter py-3 bg-cardGithubBlueBg rounded-[6px] px-3 w-full absolute top-[62px] left-0 z-50'>
					<p className='text-white32 font-medium text-[12px] leading-[14.4px]'>No Results</p>
				</div>
      )}
			<div className='flex flex-wrap gap-1'>
        {selectedMembers.length > 0 && selectedMembers.map((member) => (
          <div 
						key={member.githubId}
						className='bg-cardGithubBlueBg rounded-[6px] px-2 py-2 flex gap-1 items-center w-fit'
					>
						<img src={member.img} alt="Profile pic" width={24} height={24} className='rounded'/>
            <p className='text-white88 text-[14px] leading-[20px]'>{member.username}</p>
						<X onClick={() => handleRemoveMember(member)} size={14} className='text-white32 cursor-pointer' />
          </div>
        ))}
			</div>
    </div>
  );
};

export default GithubSearchBox;