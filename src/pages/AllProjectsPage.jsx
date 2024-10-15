import { useQuery } from '@tanstack/react-query'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import { getAllProjects } from '../service/api'
import Spinner from '../components/ui/spinner'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AllProjectsPage = () => {
    const navigate = useNavigate()

    const {data: allProjects, isLoading: isLoadingAllProjects} = useQuery({
        queryKey: ["allProjects"],
        queryFn: getAllProjects
    })

    const navigateToAddProject = () => {
        navigate('/addproject')
    }

    return (
        <div className='flex justify-center items-center'>
            <div className='md:w-[800px] max-w-[1200px] mt-6'>
                <div className='flex justify-between items-center'>
                    <div className='font-gridular text-primaryYellow text-[32px]'>All Gigs</div>
                    <button onClick={navigateToAddProject} className='bg-primaryYellow/90 hover:bg-primaryYellow rounded-md py-1 px-2 flex justify-center items-center gap-1 font-gridular'><Plus size={20}/> Add a Project</button>
                </div>
                <div className='mt-8'>
                    <div>
                        {isLoadingAllProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
                        allProjects && allProjects.map((project, idx) => <div key={idx} className='hover:bg-white4'> 
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