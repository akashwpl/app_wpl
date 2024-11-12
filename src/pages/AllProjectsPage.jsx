import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, ListFilter, TableProperties } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import listAscendingSvg from '../assets/svg/list-number-ascending.svg'
import listDescendingSvg from '../assets/svg/list-number-descending.svg'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import SearchRoles from '../components/home/SearchRoles'
import Spinner from '../components/ui/spinner'
import { getAllOrganisations, getAllProjects, getUserDetails } from '../service/api'

const AllProjectsPage = () => {
    const { user_id } = useSelector((state) => state)

    const [roleName, setRoleName] = useState('none');
    const [sortOrder, setSortOrder] = useState('ascending');
    const [showfilterModal, setShowFilterModal] = useState(false)
    const [projectsGridView, setProjectsGridView] = useState(false)

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
    const [weeksFilter, setWeeksFilter] = useState()
    const [foundationFilter, setFoundationFilter] = useState()

    const handleSearch = (e) => {
        setSearchInput(e.target.value)
    }
 
    const filteredProjects = useMemo(() => {
        return allProjects
            ?.filter(project => {
                const matchesType = project?.type?.toLowerCase() === 'bounty';
                const matchesSearch = searchInput ? project?.title?.toLowerCase().includes(searchInput.toLowerCase()) : true;
                const matchesRole = tiles.length > 0 ? tiles.some(tile => project?.roles?.map(role => role.toLowerCase()).includes(tile.toLowerCase())) : true;
                const matchfoundation = foundationFilter && foundationFilter !== 'all' ? project?.foundation?.toLowerCase() === foundationFilter?.toLowerCase() : true;
                // Week-based filter
                const lastMilestone = project?.milestones?.[project.milestones.length - 1];
                const deadlineDate = lastMilestone ? new Date(lastMilestone.deadline) : null;
                const weeksLeft = deadlineDate ? (deadlineDate - new Date()) / (1000 * 60 * 60 * 24 * 7) : null;
                const matchesWeeks = 
                    !weeksFilter || // if no weeks filter is set
                    (weeksFilter === 'lessThan2' && weeksLeft < 2) ||
                    (weeksFilter === 'between2And4' && weeksLeft >= 2 && weeksLeft <= 4) ||
                    (weeksFilter === 'above4' && weeksLeft > 4);

                return matchesSearch && matchesRole && matchesType && matchesWeeks && matchfoundation;
            })
            .sort((a, b) => {
                return sortOrder === 'ascending' ? a?.totalPrize - b?.totalPrize : b?.totalPrize - a?.totalPrize;
        });
    }, [allProjects, searchInput, roleName, sortOrder, weeksFilter, foundationFilter]);

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

    const handleWeeksFilterChange = (event) => {
        const value = event.target.value;
        setWeeksFilter(prevFilter => prevFilter === value ? '' : value);
    };

    const handleFoundationFilterChange = (event) => {
        const value = event.target.value;
        setFoundationFilter(prevFilter => prevFilter === value ? '' : value);
    }

    const {data: organisationsDetails, isLoading: isLoadingOrganisationDetails} = useQuery({
        queryKey: ["allOrganisations"],
        queryFn: () => getAllOrganisations(user_id),
    })

    console.log('tiles', tiles)

    return (
        <div className='flex justify-center items-center'>
            <div className='md:w-[1000px] max-w-[1200px] mt-6 pb-24'>

            <div className="mb-8">
                <div className="flex flex-row text-primaryBlue">
                    <div className="mr-3 w-2/4 h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                        <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Projects</p>
                        <p className='font-gridular text-[42px] leading-[50.4px]'>{userDetails ? userDetails?.totalProjectsInWPL : '0'}</p>
                    </div>
                    <div className="mr-3 w-2/4 h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                        <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Organisations</p>
                        <p className='font-gridular text-[42px] leading-[42px]'>
                            {organisationsDetails?.length || '0'}
                        </p>
                    </div>
                    
                </div>
            </div>
              
                <div className='mt-6'>
                    <SearchRoles tiles={tiles} handleRoleChange={handleRoleChange} handleRemoveTile={handleRemoveTile} handleKeyboardEnter={handleKeyboardEnter} searchInput={searchInput} handleSearch={handleSearch} handleFoundationFilterChange={handleFoundationFilterChange}/>
                </div>

                <div className='border border-white7 rounded-md h-[56px] flex justify-between items-center'>
                    <div className='bg-[#0000001F] h-full flex justify-center items-center w-[150px] text-primaryYellow font-gridular text-[14px] border-b border-primaryYellow'>
                        <p>Currently open</p>
                    </div>
                    <div>
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
                                <div className="absolute w-[156px] top-10 -left-[70px] rounded-md bg-white4 backdrop-blur-[52px] py-3 flex flex-col px-4 z-50">
                                    <div>
                                        <p className='text-[12px] font-semibold font-inter mb-3 text-start'>Sort prizes</p>
                                        <div onClick={() => {setSortOrder('ascending'); setShowFilterModal(false)}} className={`font-gridular text-[14px] ${sortOrder == 'ascending' ? "text-primaryYellow" : 'text-white88'} mb-1 flex items-center gap-1`}><img src={listAscendingSvg} alt='sort' color={sortOrder == 'ascending' ? "#FBF1B8" : "#FFFFFF52"} className={`text-[16px]`} /> Low to High</div>
                                        <div onClick={() => {setSortOrder('descending'); setShowFilterModal(false)}} className={`font-gridular text-[14px] ${sortOrder == 'descending' ? "text-primaryYellow" : 'text-white88'}  mb-[6px] flex items-center gap-1`}><img src={listDescendingSvg} alt='sort' className={`${sortOrder == 'descending' ? "text-primaryYellow" : "text-white32"}`} /> High to Low</div>
                                    </div>
                                    <div className='border border-dashed border-white7 w-full my-5'/>
                                    <div>
                                        <p className='text-[12px] font-semibold font-inter mb-3'>Select duration</p>
                                        <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                                            {/* <div className='border border-primaryYellow h-[14px] p-0 m-0 flex justify-center items-center rounded-sm'> */}
                                                <input type='checkbox' name='duration' value='lessThan2' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'lessThan2'} id='1' className='p-0 m-0 cursor-pointer'/>
                                            {/* </div> */}
                                            <label htmlFor='1'>{`<`} 2 weeks</label>
                                        </div>
                                        <div className='mb-1 flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                                            <input type='checkbox' name='duration' value='between2And4' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'between2And4'} id='1' className='border border-primaryYellow cursor-pointer'/>
                                            <label htmlFor='1'>2-4 weeks</label>
                                        </div>
                                        <div className=' flex items-center gap-2 text-white88 text-[14px] font-gridular'>
                                            <input type='checkbox' name='duration' value='above4' onChange={(e) => handleWeeksFilterChange(e)} checked={weeksFilter === 'above4'} id='1' className='border border-primaryYellow cursor-pointer'/>
                                            <label htmlFor='1'>{`>`} 4 week</label>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    </div>
                </div>

                <div className='mt-8'>
                    <div className={`${projectsGridView ? "grid grid-cols-2 gap-4" : "flex flex-col"} transition duration-300`}>
                        {isLoadingAllProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
                            filteredProjects?.length === 0 ? <div className='flex justify-center items-center mt-10 col-span-2'><p className='text-white88 font-gridular text-[24px]'>No projects found :(</p></div> :
                            filteredProjects && 
                            filteredProjects.map((project, idx) => <div key={idx} className={`${!projectsGridView ? "hover:bg-white4 rounded-md" : ''} w-full gap-3`}>
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
    )
}

export default AllProjectsPage


// TODO :: adding a project make roles multi select
// TODO :: 2nd and so on milestone should have prefilled start date based on prev milestone end date
