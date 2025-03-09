import React, { useEffect, useRef, useState } from 'react';
import wolfTiltImg from '../../assets/icons/wolf_tilt.png';
import '../../../src/index.css';

const Tabs = ({ tabs, handleTabClick, selectedTab, submissionsCount }) => {
  const tabRefs = useRef([]);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (!tabRefs.current) return;
    const activeTabIndex = tabs.findIndex(tab => tab.id === selectedTab);
    const activeTab = tabRefs?.current[activeTabIndex];
    
    if (activeTab) {
      setUnderlineStyle({
        width: `${activeTab.offsetWidth}px`,
        transform: `translateX(${activeTab.offsetLeft}px)`
      });
    }
  }, [tabs, selectedTab]);

  useEffect(() => {
    if (!isClicked) return;

    const timeout = setTimeout(() => {
      setIsClicked(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isClicked]);

  return (
    <div>
      <div className="flex relative">
        {tabs.map((tab, index) => (
          <div 
            ref={el => tabRefs.current[index] = el} 
            onClick={() => {
              handleTabClick(tab.id);
              setTimeout(() => {
                setIsClicked(prev => !prev);
              }, 100);
            }} 
            key={tab.id} 
            className={`
              px-4 h-14
              ${selectedTab === tab.id ? "bg-[#050e52] text-primaryYellow" : "text-white32"}
              ${selectedTab === "overview" ? "rounded-tl-md rounded-bl-md" : ""}
              font-gridular font-normal text-sm leading-[16.8px]
              transition duration-150 cursor-pointer
              flex justify-center items-center 
              overflow-hidden relative
            `}
          >
            {tab.id === selectedTab && (
              <img
                className={`absolute bottom-0 right-0 w-5 h-5 transition-all duration-1000 ease-in-out ${
                  isClicked ? 'wolf-tilt-left' : 'wolf-tilt-right'
                }`}
                src={wolfTiltImg}
                alt="Wolf tilt"
              />
            )}
            {tab.name}
            {/* {submissionsCount && tab.name === 'Submissions' && (
              <span className="text-primaryYellow ml-2">
                ({submissionsCount})
              </span>
            )} */}
          </div>
        ))}
        {tabs?.length > 0 && (
          <div 
            className={`absolute bottom-0 h-[1px] bg-[#FBF1B8] transition-all duration-200 ${
              selectedTab === "building" ? "min-w-[100px]" : ""
            }`}
            style={underlineStyle}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;