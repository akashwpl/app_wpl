import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import saveBtnHoverImg from '../assets/svg/menu_btn_hover_subtract.png'
import saveBtnImg from '../assets/svg/menu_btn_subtract.png'
import ExploreGigsCard from '../components/home/ExploreGigsCard'
import FancyButton from '../components/ui/FancyButton'
import Spinner from '../components/ui/spinner'
import { getUserDetails } from '../service/api'

import { Plus } from 'lucide-react'

const AllUserOwnedProjectsPage = () => {
    const navigate = useNavigate()

    const { user_id } = useSelector((state) => state)

    const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    const navigateToAddProject = () => {
        navigate('/addproject')
    }

    return (
        <div className='flex justify-center items-center'>
            <div className='md:w-[800px] max-w-[1200px] mt-6'>
                <div className='flex justify-between items-center'>
                    <div className='font-gridular text-primaryYellow text-[32px]'>All Gigs Owned</div>
                    <FancyButton 
                        src_img={saveBtnImg}
                        hover_src_img={saveBtnHoverImg}
                        img_size_classes='w-[175px] h-[44px]'
                        className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
                        btn_txt={<span className='flex items-center justify-center gap-2'><Plus size={20} fontWeight={800} className='size-4 stoke-[3]'/><span>Add project</span></span>} 
                        alt_txt='Add project btn'
                        onClick={navigateToAddProject}
                    />
                </div>
                <div className='mt-8'>
                    <div>
                        {isLoadingUserProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
                        userProjects && userProjects?.projects?.owned?.map((project, idx) => <div key={idx} className='hover:bg-white4'> 
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

export default AllUserOwnedProjectsPage