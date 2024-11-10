import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ExploreGigs from '../components/home/ExploreGigs';
import { getOrgProjects, getUserDetails } from '../service/api';
import OrgExplore from '../components/home/OrgExplorePage';
import Statistics from '../components/home/AdminStatistics';
import { useSelector } from 'react-redux';

const OrganisationPage = () => {
    const { id } = useParams();
    const { user_id } = useSelector((state) => state)

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    return (
        <div className='flex flex-row justify-between mt-4 mx-8'>
            <div className='flex flex-col px-[46px] mt-4 w-full '>
                <Statistics userDetails={userDetails} />
                <div>
                    <OrgExplore userId={id}/>
                </div>
            </div>
        </div>
    )
}

export default OrganisationPage
