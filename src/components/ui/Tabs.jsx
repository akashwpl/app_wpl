import React, { useEffect, useRef, useState } from 'react'


const Tabs = ({ tabs, handleTabClick, selectedTab }) => {

    const tabRefs = useRef([]);
    const [underlineStyle, setUnderlineStyle] = useState({});
  

    useEffect(() => {
        const activeTab = tabRefs.current[tabs.findIndex(tab => tab.isActive)];
        if (activeTab) {
          setUnderlineStyle({
            width: `${activeTab.offsetWidth}px`,
            transform: `translateX(${activeTab.offsetLeft}px)`
          });
        }
      }, [tabs, selectedTab]);

    return (
        <div>
            <div className='flex relative'>
                {tabs.map((tab, index) => (
                    <div ref={el => tabRefs.current[index] = el} onClick={() => handleTabClick(tab.id)} key={tab.id} className={`px-4 py-5 ${selectedTab == tab.id ? "bg-[#050e52] text-primaryYellow" : "text-white32"} font-gridular text-[14px] leading-[16.8px] transition duration-150 cursor-pointer`}>{tab.name}</div>
                ))}
                <div className={`absolute bottom-0 h-[1px] bg-[#FBF1B8] transition-all duration-200 `} style={underlineStyle} />
            </div>
        </div>
    )
}

export default Tabs