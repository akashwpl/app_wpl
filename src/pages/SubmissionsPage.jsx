import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { acceptRejectSubmission, getProjectSubmissions } from '../service/api'
import { useParams } from 'react-router-dom';
import headerPng from '../assets/images/prdetails_header.png'
import { AlignLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import wpllogo from '../assets/images/wpl_prdetails.png'



const SubmissionsPage = () => {

    const { id } = useParams();

    const {data: submissions, isLoading: isLoadingSubmission} = useQuery({
        queryKey: ["submissions", id],
        queryFn: () => getProjectSubmissions(id),
    })

    const [currentPage, setCurrentPage] = useState(0);

    const totalSubmissions = submissions?.length || 0;
    const currentSubmission = submissions?.[currentPage];

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalSubmissions - 1));
    };
    
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

  
    const handleAccpetReject = () => {
        console.log('submission', currentSubmission)

        const submissionData = {
            email: currentSubmission.user?.email,
            experienceDescription: currentSubmission._doc?.experienceDescription || "",
            name: currentSubmission.user?.displayName || "",
            portfolioLink: currentSubmission._doc?.portfolioLink || "",
            projectId: id, // Using the id from useParams
            status: "accepted", // Hardcoded to 'accepted' for now
            teammates: [],
            userId: currentSubmission.user?._id || "",
            walletAddress: currentSubmission._doc?.walletAddress || "",
          };

        submissionData.status = 'rejected';
        acceptRejectSubmission(submissionData, currentSubmission?._doc?._id)
    }

    console.log('submissions', submissions)

    return (
        <div className='relative'>
            <div>
                <img src={headerPng} alt='header' className='h-[200px] w-full'/>
            </div>

            <div>
                <div className='flex flex-col justify-center items-center'>
                <div className='w-[350px] md:w-[480px]'>
                    <div className='-translate-y-8'>
                        <img src={wpllogo} alt="WPL Logo" className='size-[72px]'/>
                    </div>

                    <div>
                        <div className='flex justify-between'>
                        <div>
                            <p className='text-[24px] leading-[28px] text-primaryYellow font-gridular'>{currentSubmission?.user?.displayName}</p>
                            <p className='text-[14px] text-white32 font-inter'>@{currentSubmission?.user?.username}</p>
                        </div>
                        </div>

                        <div className='text-[14px] text-white88 font-inter flex items-center gap-1 mt-3'>
                        <p>{currentSubmission?.user?.projectsCompleted} <span className='text-white32'>Projects Completed</span></p>
                        <p>${currentSubmission?.user?.totalEarned} <span className='text-white32'>Earned</span></p>
                        </div>
                    </div>

                    <div className='mt-2'>
                        <div>
                            <div className='flex flex-col gap-4 font-inter'>
                                <div className='mt-8 flex flex-row items-center gap-1 text-primaryYellow'>
                                <AlignLeft size={16} />
                                <p className="text-[14px] leading-[20px]">Information</p>
                                </div>
                                <div className='h-[1px] w-full bg-primaryYellow'/>
                                <div className='flex justify-between gap-4'>
                                    <div className='flex flex-col gap-1 w-40 md:w-full'>
                                        <label 
                                        htmlFor='username'
                                        className='text-[13px] leading-[15.6px] font-medium text-white32'
                                        >
                                            Name
                                        </label>
                                        <div className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}>{currentSubmission?.user?.displayName || "--"}</div>
                                    </div>
                                    <div className='flex flex-col gap-1 w-44 md:w-full'>
                                        <label 
                                        htmlFor='emailId' 
                                        className='text-[13px] leading-[15.6px] font-medium text-white32'
                                        >
                                            Email
                                        </label>
                                        <div className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}>{currentSubmission?.user?.email}</div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label 
                                    htmlFor='appExp' 
                                    className='text-[13px] leading-[15.6px] font-medium text-white32'
                                    >
                                    Experience designing application
                                    </label>
                                    <div className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}>{currentSubmission?._doc?.experienceDescription}</div> 
                                </div>

                                <div className='flex flex-col gap-1 w-44 md:w-full'>
                                <label 
                                    htmlFor='emailId' 
                                    className='text-[13px] leading-[15.6px] font-medium text-white32'
                                >
                                    Portfolio link
                                </label>
                                <a href={currentSubmission?._doc?.portfolioLink} target='_blank' className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7 cursor-pointer`}>{currentSubmission?._doc?.portfolioLink}</a>
                                </div>

                                <div className='flex flex-col gap-1 w-full'>
                                    <label 
                                    htmlFor='ercAddress' 
                                    className='text-[13px] leading-[15.6px] font-medium text-white32'
                                    >
                                        ERC-20 Address
                                    </label>
                                    <div className={`bg-white7 text-white48 rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}>{currentSubmission?.user?.walletAddress}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='fixed bottom-0 left-0 w-full bg-[#091044] flex justify-between items-center px-14 py-5'>
            <div className='flex justify-between items-center gap-2'>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                    className='text-white88 disabled:text-white48 bg-white7 rounded-md p-[1px]'
                >
                    <ChevronLeft size={20} />
                </button>
                <div className='text-[14px] text-white88 font-inter'>
                    Submissions: {currentPage + 1} / {totalSubmissions}
                </div>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalSubmissions - 1}
                    className='text-white88 disabled:text-white48 bg-white7 rounded-md p-[1px]'
                >
                    <ChevronRight size={20} />
                </button>
            </div>
            <div>
                <button onClick={handleAccpetReject} className='px-4 py-1 bg-[#F03D3D1A] text-[#E38070] border border-[#E38070] rounded-md'>Reject</button>
                <button onClick={handleAccpetReject} className='px-4 py-1 bg-[##0ED0651A] text-[#9FE7C7] border border-[#9FE7C7] rounded-md'>Accept</button>
            </div>
        </div>
           
        </div>
    )
}

export default SubmissionsPage