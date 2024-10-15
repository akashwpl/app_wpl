import { useQuery } from '@tanstack/react-query'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import { getAllProjects } from '../service/api'
import Spinner from '../components/ui/spinner'

const AllProjectsPage = () => {
    const {data: allProjects, isLoading: isLoadingAllProjects} = useQuery({
        queryKey: ["allProjects"],
        queryFn: getAllProjects
    })

    return (
        <div className='flex justify-center items-center'>
            <div className='md:w-[800px] max-w-[1200px] mt-6'>
                <div className='font-gridular text-primaryYellow text-[32px]'>All Gigs</div>
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