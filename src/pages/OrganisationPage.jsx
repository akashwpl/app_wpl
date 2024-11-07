import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ExploreGigs from '../components/home/ExploreGigs';
import Statistics from '../components/home/Statistics';
import { getUserDetails } from '../service/api';

const OrganisationPage = () => {
    const { id } = useParams();

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", id],
        queryFn: () => getUserDetails(id),
        enabled: !!id,
    })
    return (
        <div className='flex flex-row justify-between mt-4 mx-8'>
            <div className='flex flex-col px-[46px] mt-4 w-full '>
                <Statistics userDetails={userDetails} />
                <div>
                    <ExploreGigs userId={id}/>
                </div>
            </div>
        </div>
    )
}

export default OrganisationPage
