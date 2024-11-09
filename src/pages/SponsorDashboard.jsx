import React from 'react'
import Statistics from '../components/home/Statistics'
import { getUserDetails } from '../service/api'
import { useSelector } from 'react-redux'
import ExploreGigs from '../components/home/ExploreGigs'
import { useQuery } from '@tanstack/react-query'

const SponsorDashboard = () => {
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
                <ExploreGigs />
            </div>
        </div>
    )
}

export default SponsorDashboard