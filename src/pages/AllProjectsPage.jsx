import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowRight, ArrowUp, DollarSign, Filter, LayoutGrid, ListFilter, Search, TableProperties, TimerIcon } from 'lucide-react'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import SearchRoles from '../components/home/SearchRoles'
import Spinner from '../components/ui/spinner'
import { getAllProjects, getUserDetails } from '../service/api'
import listAscendingSvg from '../assets/svg/list-number-ascending.svg'
import listDescendingSvg from '../assets/svg/list-number-descending.svg'

const AllProjectsPage = () => {
    const navigate = useNavigate()
    const { user_id } = useSelector((state) => state)

    const [roleName, setRoleName] = useState('none');
    const [sortOrder, setSortOrder] = useState('ascending');
    const [showfilterModal, setShowFilterModal] = useState(false)
    const [projectsGridView, setProjectsGridView] = useState(false)

    const [tiles, setTiles] = useState([])


    const {data: allProjects, isLoading: isLoadingAllProjects} = useQuery({
        queryKey: ["allProjects"],
        queryFn: getAllProjects
    })

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    const [searchInput, setSearchInput] = useState()

    const handleSearch = (e) => {
        setSearchInput(e.target.value)
    }

    
    const navigateToAddProject = () => {
        navigate('/addproject')
    }

    const filteredProjects = useMemo(() => {
        return allProjects
            ?.filter(project => {
                const matchesType = project?.type?.toLowerCase() === 'bounty';
                const matchesSearch = searchInput ? project?.title?.toLowerCase().includes(searchInput.toLowerCase()) : true;
                const matchesRole = roleName && roleName !== 'none' ? project?.role?.toLowerCase() === roleName.toLowerCase() : true;
                return matchesSearch && matchesRole && matchesType;
            })
            .sort((a, b) => {
                const dateA = a.milestones && a.milestones.length > 0 
                    ? new Date(a.milestones[a.milestones.length - 1].deadline) 
                    : new Date(0);
                const dateB = b.milestones && b.milestones.length > 0 
                    ? new Date(b.milestones[b.milestones.length - 1].deadline) 
                    : new Date(0);
                
                return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
            });
    }, [allProjects, searchInput, roleName, sortOrder]);

    const handleRoleChange = (e) => {
        setRoleName(e.target.value)
    }

    const handleKeyboardEnter = (e) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            setTiles((prev) => [...prev, e.target.value?.trim()])
            setSearchInput('')
        }
    }

    const handleRemoveTile = (tile) => {
        console.log('tile', tile)
        setTiles((prev) => prev.filter((t) => t !== tile))
    }

   console.log('tiles', tiles)

    return (
        <div className='flex justify-center items-center'>
            <div className='md:w-[800px] max-w-[1200px] mt-6 pb-32'>
                <div className={`mr-3 w-full flex justify-center items-start flex-col h-[101px] py-5 px-4 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md `}>
                    {userDetails?.role == 'sponsor' ? <div className='w-full flex flex-col justify-between'>
                        <h2 className='text-[18px] font-gridular text-[#06105D]'>Invite the best talent to work on your project!</h2>
                        <p className='text-[#06105D] text-[13px] font-inter'>"KODAK" marks the debut collaboration between New Delhi-based heavyweight KING</p>
                        <div onClick={navigateToAddProject} className='flex justify-between items-center w-full bg-[#06105D] rounded-md px-2 py-[6px] mt-3 cursor-pointer'>
                            <p className='text-primaryYellow text-[13px] font-gridular'>Add your project!</p>
                            <ArrowRight size={20} className='text-primaryYellow'/>
                        </div>
                    </div> 
                    :   <>
                            <h2 className='font-gridular text-primaryBlue font-semibold text-[23px] leading-[27px]'>Start Contributing Onchain</h2>
                            <p className='text-primaryBlue font-inter font-semibold text-[13px]'>Earn in crypto by contributing to your fav projects</p> 
                        </>
                    }
                </div>

                <div className='mt-6'>
                    <SearchRoles tiles={tiles} handleRoleChange={handleRoleChange} handleRemoveTile={handleRemoveTile} handleKeyboardEnter={handleKeyboardEnter} searchInput={searchInput} handleSearch={handleSearch}/>
                </div>

                {/* <div className='border border-white7 h-[56px] flex justify-between items-center'>
                    <div className='flex items-center gap-2 w-full ml-3'>
                        <Search className='text-white32' size={16}/>
                        <input onKeyDown={handleKeyboardEnter} value={searchInput} onChange={handleSearch}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' placeholder='Search for you fav Org, role...'/>
                    </div>
                    <div className='border-l border-white7 min-w-[180px] h-full flex justify-center items-center cursor-pointer'>
                        <div className='flex items-center justify-center border border-white7 rounded-md px-2 py-[6px] gap-1'>
                            <Filter className='text-white32' size={15}/>
                            <p onClick={() => setSortOrder((prev) => {
                                if(prev == 'ascending') return 'descending'
                                else return 'ascending'
                            })} className='font-gridular text-[14px] text-white48 flex items-center gap-1'>Sort Results {sortOrder == 'ascending' ? <ArrowDown size={15}/> : <ArrowUp size={15}/>}</p>
                        </div>
                    </div>
                </div> */}


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
                                <div className="absolute w-[156px] top-9 -left-[70px] rounded-md bg-white4 backdrop-blur-sm py-3 flex flex-col px-4">
                                    <div>
                                        <p className='text-[12px] font-semibold font-inter mb-2 text-start'>Sort prizes</p>
                                        <div className='font-gridular text-[14px] text-white88 mb-1 flex items-center gap-1'><img src={listAscendingSvg} alt='sort' className='size-[16px]' /> Low to High</div>
                                        <div className='font-gridular text-[14px] text-white88 mb-[6px] flex items-center gap-1'><img src={listDescendingSvg} alt='sort' className='size-[16px]' /> High to Low</div>
                                        <div className='font-gridular text-[14px] text-white88'> Low to High</div>
                                    </div>
                                    <div className='border border-dashed border-white7 w-full my-4'/>
                                    <div>
                                        <p className='text-[12px] font-semibold font-inter mb-2'>Select duration</p>
                                        <div className='mb-1'>
                                            <input type='checkbox' name='duration' value='1' id='1'/>
                                            <label htmlFor='1'>{`<`} 2 weeks</label>
                                        </div>
                                        <div className='mb-1'>
                                            <input type='checkbox' name='duration' value='1' id='1'/>
                                            <label htmlFor='1'>2-4 weeks</label>
                                        </div>
                                        <div className=''>
                                            <input type='checkbox' name='duration' value='1' id='1'/>
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
                    <div>
                        {isLoadingAllProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
                        filteredProjects && filteredProjects.map((project, idx) => <div key={idx} className='hover:bg-white4'> 
                                <ExploreGigsCard data={project} type={"project"}/>
                                <div className=' border border-x-0 border-t-0 border-b-white7'></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllProjectsPage