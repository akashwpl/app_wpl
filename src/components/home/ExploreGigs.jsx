import { useQuery } from "@tanstack/react-query"
import { ArrowUpRight, LayoutGrid, ListFilter, TableProperties } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import exploreBtnHoverImg from '../../assets/svg/menu_btn_hover_subtract.png'
import exploreBtnImg from '../../assets/svg/menu_btn_subtract.png'
import { getAllProjects, getUserDetails, getUserProjects } from "../../service/api"
import FancyButton from "../ui/FancyButton"
import Spinner from "../ui/spinner"
import Tabs from "../ui/Tabs"
import ExploreGigsCard from "./ExploreGigsCard"

import listAscendingSvg from '../../assets/svg/list-number-ascending.svg'
import listDescendingSvg from '../../assets/svg/list-number-descending.svg'
import SearchRoles from "./SearchRoles"

// TODO ::  Leaderboard page clickable user and rediret to user profile

const userTabs = [
  {id: 'ongoing', name: 'Live', isActive: true},
  {id: 'idle', name: 'All', isActive: false},
  {id: 'closed', name: 'Completed', isActive: false}
]

const ExploreGigs = ({orgProjects, userId}) => {

  const navigate = useNavigate()
  const { user_id, user_role } = useSelector((state) => state)

  const [tabs, setTabs] = useState(userTabs)
  const [selectedTab, setSelectedTab] = useState('ongoing')
  const [sortOrder, setSortOrder] = useState('ascending')
  const [sortBy, setSortBy] = useState('prize')

  const [showfilterModal, setShowFilterModal] = useState(false)
  const [projectsGridView, setProjectsGridView] = useState(true)
  const [weeksFilter, setWeeksFilter] = useState()
  const [bountyTypeFilter, setBountyTypeFilter] = useState()
  const [roleName, setRoleName] = useState('none');
  const [tiles, setTiles] = useState([])


  const { data: allProjects, isLoading: isLoadingAllProjects } = useQuery({
    queryKey: ["allProjects"],
    queryFn: getAllProjects
  })

  const { data: userDetails, isLoading: isLoadingUserDetails } = useQuery({
    queryKey: ["userDetails", user_id],
    queryFn: () => getUserDetails(user_id),
    enabled: !!user_id,
  })

  const [searchInput, setSearchInput] = useState()
  const [foundationFilter, setFoundationFilter] = useState()


  const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
    queryKey: ["userProjects", user_id],
    queryFn: getUserProjects,
    enabled: !!userId
  })

  console.log('allProjects explore gig', allProjects)

  // useEffect(() => {
  //   if(user_role == 'sponsor') {
  //     setTabs(sponsorTabs)
  //     setSelectedTab('live')
  //   } else {
  //     setTabs(userTabs)
  //     setSelectedTab('live')
  //   }
  // }, [user_role])


  const handleTabClick = (id) => {
    const newTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === id
    }));
    setTabs(newTabs)
    setSelectedTab(id)
  }

  const filteredProjects = useMemo(() => {
    return allProjects?.filter((el) => {
      if(selectedTab == 'closed') {
        return (el?.status == 'closed' || el?.status == 'completed')
      } else {
        return el?.status == selectedTab
      }
    })
        ?.filter(project => {
            const matchesType = project?.type?.toLowerCase() === 'bounty';
            const matchesSearch = searchInput ? project?.title?.toLowerCase().includes(searchInput.toLowerCase()) : true;
            const matchesRole = tiles.length > 0 ? tiles.some(tile => project?.roles?.map(role => role.toLowerCase()).includes(tile.toLowerCase())) : true;
            const matchfoundation = foundationFilter && foundationFilter !== 'All' ? project?.organisation?.organisationHandle?.toLowerCase() === foundationFilter?.toLowerCase() : true;
            // Week-based filter
            const lastMilestone = project?.milestones?.[project.milestones.length - 1];
            const deadlineDate = lastMilestone ? new Date(lastMilestone.deadline) : null;
            const weeksLeft = deadlineDate ? (deadlineDate - new Date()) / (1000 * 60 * 60 * 24 * 7) : null;
            const matchesWeeks = 
                !weeksFilter || // if no weeks filter is set
                (weeksFilter === 'lessThan2' && weeksLeft < 2) ||
                (weeksFilter === 'between2And4' && weeksLeft >= 2 && weeksLeft <= 4) ||
                (weeksFilter === 'above4' && weeksLeft > 4); 

            const matchesBountyIsOpen = 
            bountyTypeFilter == null || // If no checkbox is selected, show all
            (bountyTypeFilter === 'open' && project?.isOpenBounty) ||
            (bountyTypeFilter === 'close' && project?.isOpenBounty == false);             

            return matchesSearch && matchesRole && matchesType && matchesWeeks && matchfoundation && matchesBountyIsOpen;
        })
        .sort((a, b) => {
            return sortOrder === 'ascending' ? a?.totalPrize - b?.totalPrize : b?.totalPrize - a?.totalPrize;
    });
}, [allProjects, selectedTab, searchInput, roleName, sortOrder, weeksFilter, foundationFilter, bountyTypeFilter]);


  // const filteredProjects = useMemo(() => {
  //   // Filter projects based on the selected tab
  //   let projectsToSort = [];
  //   if (selectedTab === 'building') projectsToSort = userProjects?.filter(project => project.status === 'ongoing');
  //   else if (selectedTab === 'completed') projectsToSort = userProjects?.filter(project => project.status === 'completed' || project.status === 'closed');
  //   else if (selectedTab === 'in_review') projectsToSort = userProjects?.filter(project => project.status === 'submitted');
  //   else projectsToSort = userProjects;

  //   // Sort by the last milestone's deadline

  //   if(sortBy == 'prize') {
  //     return projectsToSort
  //       ?.sort((a, b) => {
  //         return sortOrder === 'ascending' ? a.totalPrize - b.totalPrize : b.totalPrize - a.totalPrize;
  //       });
  //   } else {
  //   return projectsToSort
  //     ?.sort((a, b) => {
  //       const dateA = a.milestones && a.milestones.length > 0
  //         ? new Date(a.milestones[a.milestones.length - 1].deadline)
  //         : new Date(0); // fallback date if no milestones
  //       const dateB = b.milestones && b.milestones.length > 0
  //         ? new Date(b.milestones[b.milestones.length - 1].deadline)
  //         : new Date(0); // fallback date if no milestones
        
  //         return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
  //     });
  //   }
  // }, [userProjects, selectedTab, sortOrder]);

  
//   const filteredProjects = useMemo(() => {
//     let projectsToSort = [];
//     if (selectedTab === 'all') projectsToSort = userProjects?.filter(project => project.status == 'idle');
//     else if (selectedTab === 'live') projectsToSort = userProjects?.filter(project => project.status === 'ongoing');
//     else if (selectedTab === 'completed') projectsToSort = userProjects?.filter(project => project.status === 'completed' || project.status === 'closed');
//     // else if (selectedTab === 'in_review') projectsToSort = userProjects?.filter(project => project.status === 'submitted');
//     else projectsToSort = userProjects;

//     return projectsToSort
//         ?.filter(project => {
//             // Week-based filter
//             const lastMilestone = project?.milestones?.[project.milestones.length - 1];
//             const deadlineDate = lastMilestone ? new Date(lastMilestone.deadline) : null;
//             const weeksLeft = deadlineDate ? (deadlineDate - new Date()) / (1000 * 60 * 60 * 24 * 7) : null;
//             const matchesWeeks = 
//                 !weeksFilter || // if no weeks filter is set
//                 (weeksFilter === 'lessThan2' && weeksLeft < 2) ||
//                 (weeksFilter === 'between2And4' && weeksLeft >= 2 && weeksLeft <= 4) ||
//                 (weeksFilter === 'above4' && weeksLeft > 4);

//             const matchesBountyIsOpen = 
//               bountyTypeFilter == null || // If no checkbox is selected, show all
//               (bountyTypeFilter === 'open' && project?.isOpenBounty) ||
//               (bountyTypeFilter === 'close' && project?.isOpenBounty == false);      

//             return matchesWeeks && matchesBountyIsOpen;
//         })
//         .sort((a, b) => {
//             return sortOrder === 'ascending' ? a?.totalPrize - b?.totalPrize : b?.totalPrize - a?.totalPrize;
//     });
// }, [userProjects, sortOrder, weeksFilter, selectedTab]);

  const handleWeeksFilterChange = (event) => {
    const value = event.target.value;
    setWeeksFilter(prevFilter => prevFilter === value ? '' : value);
  };

  const handleBountyTypeFilterChange = (event) => {
    const value = event.target.value;
    setBountyTypeFilter(prevFilter => prevFilter === value ? null : value);
  }

  const navigateToProjectDetails = () => {
    navigate('/userprojects')
  }

  const handleRoleChange = (e) => {
    setRoleName(e.target.value)
  }

  const handleKeyboardEnter = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        setTiles((prev) => [...prev, e.target.value?.trim()])
        setSearchInput('')
    }
  }

  const handleRemoveTile = (tile) => {
    setTiles((prev) => prev.filter((t) => t !== tile))
  }


  const handleFoundationFilterChange = (value) => {
    setFoundationFilter(prevFilter => prevFilter === value ? '' : value);
  }

  const handleSearch = (e) => {
    setSearchInput(e.target.value)
  }

  const navigateToCreateProject = () => {
    navigate('/addproject')
  }

  return (
    <div>
          <div className="flex justify-between items-center">
            <h1 className="font-gridular text-primaryYellow text-[20px]">Explore all</h1>
            {user_role == 'user' ?
            <FancyButton
              src_img={exploreBtnImg}
              hover_src_img={exploreBtnHoverImg}
              img_size_classes='w-[175px] h-[44px]' 
              className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
              btn_txt={<span className='flex items-center justify-center gap-2'><span>{"Go to my gigs"}</span><ArrowUpRight size={18}/></span>} 
              alt_txt='save project btn' 
              onClick={navigateToProjectDetails}
            /> :
            <FancyButton 
              src_img={exploreBtnImg} 
              hover_src_img={exploreBtnHoverImg} 
              img_size_classes='w-[175px] h-[44px]' 
              className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
              btn_txt={<span className='flex items-center justify-center gap-2'><span>{"+ Add Listing"}</span><ArrowUpRight size={18}/></span>} 
              alt_txt='save project btn' 
              onClick={navigateToCreateProject}
            />}
          </div>
              
          {user_role == 'user' && 
            <div className='mt-6'>
                <SearchRoles tiles={tiles} handleRoleChange={handleRoleChange} handleRemoveTile={handleRemoveTile} handleKeyboardEnter={handleKeyboardEnter} searchInput={searchInput} handleSearch={handleSearch} handleFoundationFilterChange={handleFoundationFilterChange}/>
            </div>
          }
          
        <div className="flex justify-between items-center border border-white7 rounded-[2px] mt-5">
          <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab}/>
          <div className="flex flex-row items-center w-[200px] justify-evenly  text-white48">
            <div className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[56px] h-[32px]">
                <LayoutGrid onClick={() => {setProjectsGridView((prev) => !prev)}} size={14} className={`${projectsGridView ? "text-primaryYellow" : "text-white32"} cursor-pointer`}/>
                <div className='h-full border border-r border-white/10'></div>
                <TableProperties onClick={() => {setProjectsGridView((prev) => !prev)}} className={`${!projectsGridView ? "text-primaryYellow" : "text-white32"} cursor-pointer`} size={14} rotate={90}/>
            </div>
            <div className="flex flex-row justify-center items-center cursor-pointer relative">
                <div onClick={() => setShowFilterModal((prev) => !prev)} className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[89px] h-[32px]">
                  <ListFilter size={12}/>
                  <p className='font-gridular text-[14px] leading-[16.8px]'>Filter</p>
                </div>

                {showfilterModal && 
                  <div className="absolute w-[162px] top-10 -left-[74px] rounded-md bg-white4 backdrop-blur-[52px] py-3 flex flex-col px-4 z-50">
                    <div>
                        <p className='text-[12px] font-semibold font-inter mb-3 text-start'>Sort prizes</p>
                        <div onClick={() => {setSortOrder('ascending'); setShowFilterModal(false)}} className={`font-gridular text-[14px] ${sortOrder == 'ascending' ? "text-primaryYellow" : 'text-white88'} mb-1 flex items-center gap-1`}><img src={listAscendingSvg} alt='sort' color={sortOrder == 'ascending' ? "#FBF1B8" : "#FFFFFF52"} className={`text-[16px]`} /> Low to High</div>
                        <div onClick={() => {setSortOrder('descending'); setShowFilterModal(false)}} className={`font-gridular text-[14px] ${sortOrder == 'descending' ? "text-primaryYellow" : 'text-white88'}  mb-[6px] flex items-center gap-1`}><img src={listDescendingSvg} alt='sort' className={`${sortOrder == 'descending' ? "text-primaryYellow" : "text-white32"}`} /> High to Low</div>
                    </div>
                    <div className='border border-dashed border-white7 w-full my-4'/>
                    <div>
                        <p className='text-[12px] font-semibold font-inter mb-2 text-start'>Bounty type</p>
                        <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                            <input type='checkbox' name='open' value='open' onChange={(e) => handleBountyTypeFilterChange(e)} checked={bountyTypeFilter === 'open'} id='open' className='border border-primaryYellow cursor-pointer'/>
                            <label className='cursor-pointer' htmlFor='open'>Open</label>
                        </div>
                        <div className=' flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                            <input type='checkbox' name='close' value='close' onChange={(e) => handleBountyTypeFilterChange(e)} checked={bountyTypeFilter === 'close'} id='close' className='border border-primaryYellow cursor-pointer'/>
                            <label className='cursor-pointer' htmlFor='close'>Gated</label>
                        </div>
                    </div>
                    <div className='border border-dashed border-white7 w-full my-4'/>
                    <div>
                        <p className='text-[12px] font-semibold font-inter mb-3'>Select duration</p>
                        <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                            {/* <div className='border border-primaryYellow h-[14px] p-0 m-0 flex justify-center items-center rounded-sm'> */}
                                <input type='checkbox' name='duration' value='lessThan2' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'lessThan2'} id='1' className='p-0 m-0 cursor-pointer'/>
                            {/* </div> */}
                            <label htmlFor='1'>{`<`} 2 weeks</label>
                        </div>
                        <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                            <input type='checkbox' name='duration' value='between2And4' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'between2And4'} id='2' className='border border-primaryYellow cursor-pointer'/>
                            <label htmlFor='2'>2-4 weeks</label>
                        </div>
                        <div className=' flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                            <input type='checkbox' name='duration' value='above4' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'above4'} id='3' className='border border-primaryYellow cursor-pointer'/>
                            <label htmlFor='3'>{`>`} 4 week</label>
                        </div>
                    </div>
                  </div>
                }
            </div>
          </div>
        </div>

        <div>
          {isLoadingUserProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
          filteredProjects && selectedTab == 'live' && filteredProjects?.length == 0 ? <div className="mt-24">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="font-gridular text-white88 text-[24px]">No Gigs Available</div>
              {/* <p className="text-white32 font-gridular">Explore gigs and start building now!</p> */}
            </div>
              <div className="flex justify-center items-center mt-6">
                {/* <FancyButton 
                  src_img={exploreBtnImg} 
                  hover_src_img={exploreBtnHoverImg} 
                  img_size_classes='w-[175px] h-[44px]' 
                  className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                  btn_txt={<span className='flex items-center justify-center gap-2'><span>{user_role != 'user' ? "List Projects" : "Explore all"}</span><ArrowUpRight size={18}/></span>} 
                  alt_txt='save project btn' 
                  onClick={navigateToProjectDetails}
                /> */}
              </div>
            </div>
            : selectedTab !== 'live' && filteredProjects?.length == 0 ? <div className="mt-24">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="font-gridular text-white88 text-[24px]">No Gigs Available</div>
                {/* <p className="text-white32 font-gridular">Explore gigs and start building now!</p> */}
              </div>
                {/* <div className="flex justify-center items-center mt-6">
                  <FancyButton 
                    src_img={exploreBtnImg} 
                    hover_src_img={exploreBtnHoverImg} 
                    img_size_classes='w-[175px] h-[44px]' 
                    className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                    btn_txt={<span className='flex items-center justify-center gap-2'><span>{user_role != 'user' ? "List Projects" : "Explore all"}</span><ArrowUpRight size={18}/></span>} 
                    alt_txt='save project btn' 
                    onClick={navigateToProjectDetails}
                  />
                </div> */}
            </div>
            : <div className={`${projectsGridView ? "grid grid-cols-2 gap-4" : "flex flex-col"}`}>
                {filteredProjects?.length == 0 ? <div></div> : filteredProjects?.map((project, idx) => <div key={idx} className={`${projectsGridView ? "" : "hover:bg-white4"}`}> 
                    <div className='col-span-1'>
                      <ExploreGigsCard data={project} type={"project"} projectsGridView={projectsGridView}/>
                      {/* {projectsGridView && <div className='border border-x-0 border-t-0 border-b-white7'></div>} */}
                    </div>
                </div>
              )}
            </div>}
        </div>
    </div>
  )
}

export default ExploreGigs