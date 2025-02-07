import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import Spinner from '../components/ui/spinner'
import { getUserDetails } from '../service/api'

import { LayoutGrid, ListFilter, Plus, TableProperties } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import headerPng from '../assets/images/prdetails_header.png'
import Tabs from '../components/ui/Tabs'

import listAscendingSvg from '../assets/svg/list-number-ascending.svg'
import listDescendingSvg from '../assets/svg/list-number-descending.svg'
import FancyButton from '../components/ui/FancyButton'

import saveBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png';
import saveBtnImg from '../assets/svg/menu_btn_subtract.png';

const sponstTabs = [
    {id: 'ongoing', name: 'Live', isActive: true},
    {id: 'idle', name: 'All', isActive: false},
    {id: 'closed', name: 'Completed', isActive: false}
]

const allTabs = [
    {id: 'idle', name: 'Live', isActive: true},
    {id: 'ongoing', name: 'In Review', isActive: false},
    {id: 'closed', name: 'Completed', isActive: false}
]

const AllUserOwnedProjectsPage = () => {
    const navigate = useNavigate()

    const { user_id, user_role } = useSelector((state) => state)
    const [tabs, setTabs] = useState(allTabs)
    const [selectedTab, setSelectedTab] = useState('idle')

    const [showfilterModal, setShowFilterModal] = useState(false)
    const [projectsGridView, setProjectsGridView] = useState(true)
    const [sortOrder, setSortOrder] = useState('ascending');
    const [weeksFilter, setWeeksFilter] = useState()
    const [foundationFilter, setFoundationFilter] = useState()
    const [bountyTypeFilter, setBountyTypeFilter] = useState()


    const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    const navigateToAddProject = () => {
        navigate('/addproject')
    }

    const handleTabClick = (id) => {
        const newTabs = tabs.map((tab) => ({
          ...tab,
          isActive: tab.id === id
        }));
        setTabs(newTabs)
        setSelectedTab(id)
    }

    useEffect(() => {
        if(user_role == "user"){
            setTabs(allTabs)
        } else {
            setTabs(sponstTabs)
        }
    }, [user_role])

    console.log('userProjects', userProjects?.projects)

    const filteredProjects = useMemo(() => {
        if(user_role == 'sponsor') {
        return userProjects?.projects?.owned?.filter((el) => {
            if(selectedTab == 'idle') {
                return el?.status == "idle"
            }
            else if(selectedTab == 'closed') {
                return (el?.status == 'closed' || el?.status == 'completed')
            } else {
            return el?.status == selectedTab
        }
        })
            ?.filter(project => {
                const matchesType = project?.type?.toLowerCase() === 'bounty';
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

                return matchesType && matchesWeeks && matchesBountyIsOpen;
            })
            .sort((a, b) => {
                return sortOrder === 'ascending' ? a?.totalPrize - b?.totalPrize : b?.totalPrize - a?.totalPrize;
        });
        } else {
            return userProjects?.projects?.taken?.filter((el) => {
                if(selectedTab == 'idle') {
                    return el?.status == "idle"
                }
                else if(selectedTab == 'closed') {
                    return (el?.status == 'closed' || el?.status == 'completed')
                } else {
                return el?.status == selectedTab
            }
            })
                ?.filter(project => {
                    const matchesType = project?.type?.toLowerCase() === 'bounty';
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
    
                    return matchesType && matchesWeeks && matchesBountyIsOpen;
                })
                .sort((a, b) => {
                    return sortOrder === 'ascending' ? a?.totalPrize - b?.totalPrize : b?.totalPrize - a?.totalPrize;
            });
        }
    }, [userProjects, selectedTab, sortOrder, weeksFilter, foundationFilter, bountyTypeFilter]);

   
    const handleBountyTypeFilterChange = (event) => {
        const value = event.target.value;
        setBountyTypeFilter(prevFilter => prevFilter === value ? null : value);
    }
    const handleWeeksFilterChange = (event) => {
        const value = event.target.value;
        setWeeksFilter(prevFilter => prevFilter === value ? '' : value);
    };

    return (
        <div className='overflow-x-hidden'>
            <div>
                <img src={headerPng} alt='header' className='h-[200px] w-full'/>
            </div>
        
            <div className='flex justify-center items-center -translate-y-36'>
                <div className='md:w-[1100px] max-w-[1400px] mt-6 bg-[#06105D] p-6 rounded-xl'>
                    <div className='flex justify-between items-center'>
                        <div className='font-gridular text-primaryYellow text-[20px]'>My gigs</div>
                        {/* <FancyButton 
                            src_img={saveBtnImg}
                            hover_src_img={saveBtnHoverImg}
                            img_size_classes='w-[175px] h-[44px]'
                            className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                            btn_txt={<span className='flex items-center justify-center gap-2'><Plus size={20} fontWeight={800} className='size-4 stoke-[3]'/><span>Add Listing</span></span>} 
                            alt_txt='Add project btn'
                            onClick={navigateToAddProject}
                        /> */}
                    </div>

                    <div className='border border-white7 rounded-md h-[56px] flex justify-between items-center mt-9'>
                        <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab}/>
                        <div>
                            <div className="flex flex-row items-center w-[200px] justify-evenly  text-white48">
                                <div className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[56px] h-[32px]">
                                    <LayoutGrid onClick={() => {setProjectsGridView((prev) => !prev)}} size={14} className={`${projectsGridView ? "text-primaryYellow" : "text-white32"} cursor-pointer`}/>
                                    <div className='h-full border border-r border-white/10'></div>
                                    <TableProperties onClick={() => {setProjectsGridView((prev) => !prev)}} className={`${!projectsGridView ? "text-primaryYellow" : "text-white32"} cursor-pointer`} size={14} rotate={90}/>
                                </div>
                                <div className="flex flex-row justify-center items-center relative">
                                    <div onClick={() => setShowFilterModal((prev) => !prev)} className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[89px] h-[32px] cursor-pointer">
                                        <ListFilter size={12}/>
                                        <p className='font-gridular text-[14px] leading-[16.8px]'>Filter</p>
                                    </div>

                                    {showfilterModal && 
                                        <div className="absolute w-[156px] top-10 -left-[70px] rounded-md bg-white4 backdrop-blur-[52px] py-3 flex flex-col px-4 z-50">
                                            <div>
                                                <p className='text-[12px] font-semibold font-inter mb-2 text-start'>Sort prizes</p>
                                                <div onClick={() => {setSortOrder('ascending'); setShowFilterModal(false)}} className={`font-gridular text-[14px] cursor-pointer ${sortOrder == 'ascending' ? "text-primaryYellow" : 'text-white88'} mb-1 flex items-center gap-1`}><img src={listAscendingSvg} alt='sort' color={sortOrder == 'ascending' ? "#FBF1B8" : "#FFFFFF52"} className={`text-[16px]`} /> Low to High</div>
                                                <div onClick={() => {setSortOrder('descending'); setShowFilterModal(false)}} className={`font-gridular text-[14px] cursor-pointer ${sortOrder == 'descending' ? "text-primaryYellow" : 'text-white88'}  mb-[6px] flex items-center gap-1`}><img src={listDescendingSvg} alt='sort' className={`${sortOrder == 'descending' ? "text-primaryYellow" : "text-white32"}`} /> High to Low</div>
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
                                                <p className='text-[12px] font-semibold font-inter mb-2'>Select duration</p>
                                                <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                                                    {/* <div className='border border-primaryYellow h-[14px] p-0 m-0 flex justify-center items-center rounded-sm'> */}
                                                        <input type='checkbox' name='duration' value='lessThan2' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'lessThan2'} id='1' className='p-0 m-0 cursor-pointer'/>
                                                    {/* </div> */}
                                                    <label className='cursor-pointer' htmlFor='1'>{`<`} 2 weeks</label>
                                                </div>
                                                <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                                                    <input type='checkbox' name='duration' value='between2And4' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'between2And4'} id='2' className='border border-primaryYellow cursor-pointer'/>
                                                    <label className='cursor-pointer' htmlFor='2'>2-4 weeks</label>
                                                </div>
                                                <div className=' flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                                                    <input type='checkbox' name='duration' value='above4' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'above4'} id='3' className='border border-primaryYellow cursor-pointer'/>
                                                    <label className='cursor-pointer' htmlFor='3'>{`>`} 4 week</label>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-8'>
                        <div className={`${projectsGridView ? "grid grid-cols-2 gap-4" : "flex flex-col"} transition duration-300 max-h-[80vh] overflow-y-auto`}>
                            {isLoadingUserProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
                                filteredProjects?.length == 0 ? <div className='flex justify-center items-center mt-10 col-span-2'><p className='text-white88 font-gridular text-[24px]'>No projects found :(</p></div> :
                                filteredProjects && 
                                filteredProjects.map((project, idx) => <div key={idx} className={`${!projectsGridView ? "hover:bg-white4 px-4 rounded-md" : ''} w-full gap-3`}>
                                        <div className='col-span-1'>
                                            <ExploreGigsCard data={project} type={"project"} projectsGridView={projectsGridView}/>
                                        </div>
                                    {/* <div className=' border border-x-0 border-t-0 border-b-white7'></div> */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllUserOwnedProjectsPage