import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Filter, Search } from 'lucide-react'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import SearchRoles from '../components/home/SearchRoles'
import Spinner from '../components/ui/spinner'
import { getAllProjects, getUserDetails } from '../service/api'

const AllProjectsPage = () => {
    const navigate = useNavigate()
    const { user_id } = useSelector((state) => state)

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
        if (!searchInput) return allProjects;
        return allProjects?.filter(project => 
            project?.title?.toLowerCase()?.includes(searchInput?.toLowerCase())
        );
    }, [allProjects, searchInput]);

    return (
        <div className='flex justify-center items-center'>
            <div className='md:w-[800px] max-w-[1200px] mt-6'>
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
                    <SearchRoles />
                </div>

                <div className='border border-white7 h-[56px] rounded-md flex justify-between items-center'>
                    <div className='flex items-center gap-2 w-full ml-3'>
                        <Search className='text-white32' size={16}/>
                        <input value={searchInput} onChange={handleSearch}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' placeholder='Search for you fav Org, role...'/>
                    </div>
                    <div className='border border-white7 min-w-[169px] h-full flex justify-center items-center'>
                        <div className='flex items-center justify-center border border-white7 rounded-md px-2 py-[6px] gap-1'>
                            <Filter className='text-white32' size={15}/>
                            <p className='font-gridular text-[14px] text-white48'>Sort Results</p>
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