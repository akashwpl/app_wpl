import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { acceptRejectSubmission, getProjectDetails, getProjectSubmissions } from '../service/api'
import { useNavigate, useParams } from 'react-router-dom';
import headerPng from '../assets/images/prdetails_header.png'
import { AlignLeft, CheckCheck, ChevronLeft, ChevronRight, TriangleAlert, X } from 'lucide-react';
import wpllogo from '../assets/images/wpl_prdetails.png'
import checkTick from '../assets/images/check-tick.png'



const SubmissionsPage = () => {

    const { id, page } = useParams();
    const navigate = useNavigate();

    const {data: submissions, isLoading: isLoadingSubmission, refetch} = useQuery({
        queryKey: ["submissions", id],
        queryFn: () => getProjectSubmissions(id),
    })

    const {data: projectDetails, isLoading: isLoadingProjectDetails} = useQuery({
        queryKey: ['projectDetails', id],
        queryFn: () => getProjectDetails(id),
        enabled: !!id
    })

    console.log('projectDetails query', projectDetails)

    const [currentPage, setCurrentPage] = useState(page - 1);
    const [projectAccepted, setProjectAccepted] = useState(false);

    const totalSubmissions = submissions?.length || 0;
    const currentSubmission = submissions?.[currentPage];

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalSubmissions - 1));
    };
    
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    useEffect(() => {
        setCurrentPage(page - 1);
        return () => {
            setCurrentPage(0);
        }
    }, [page])

    const handleAccpetReject = (type) => {
        const submissionData = {
            email: currentSubmission.user?.email,
            experienceDescription: currentSubmission._doc?.experienceDescription || "",
            name: currentSubmission.user?.displayName || "",
            portfolioLink: currentSubmission._doc?.portfolioLink || "",
            projectId: id,
            teammates: [],
            userId: currentSubmission.user?._id || "",
            walletAddress: currentSubmission._doc?.walletAddress || "",
        };
        submissionData.status = type == 'accepted' ? 'accepted' : 'rejected';
        acceptRejectSubmission(submissionData, currentSubmission?._doc?._id)

        if (type == 'rejected') {
            goToNextPage();
        } else {
            setProjectAccepted(true);
        }

        refetch();
    }

    return (
        <div className='relative'>
            <div>
                <img src={headerPng} alt='header' className='h-[200px] w-full'/>
            </div>

            {projectAccepted 
                ? submittedDetails(projectDetails, navigate)
                : <>
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
                                            <textarea value={currentSubmission?._doc?.experienceDescription} readOnly rows={4} className={`bg-white7 w-full text-wrap rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`} /> 
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

                                        <div className='flex flex-col gap-1 w-full mb-20'>
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

                    <div className='fixed bottom-0 left-0 w-full bg-[#091044] flex justify-between items-center px-14 h-[70px]'>
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

                        {currentSubmission?._doc?.status == "rejected" 
                        ?   <div className='text-cardRedText'>
                                <div className='flex items-center gap-1'>
                                    <TriangleAlert size={16}/>
                                    You have rejected this submission
                                </div>
                            </div> 
                        :   <div className='flex items-center gap-2'>
                                <button onClick={() => handleAccpetReject('rejected')} className='px-4 py-1 bg-[#F03D3D1A] text-[#E38070] border border-[#E38070] rounded-md flex items-center gap-1'><X size={14}/>Reject</button>
                                <button onClick={() => handleAccpetReject('accepted')} className='px-4 py-1 bg-[#0ED0651A] text-[#9FE7C7] border border-[#9FE7C7] rounded-md flex items-center gap-1'><CheckCheck size={14}/>Accept</button>
                            </div>
                        }
                    </div>
                </>
            } 
        </div>
    )
}

const submittedDetails = (projectDetails, navigate) => {
    console.log('projectDetails', projectDetails)
    return(
        <div className='flex justify-center mt-4'>
            <div className='flex flex-col justify-evenly gap-4 h-[230px] w-[380px] items-center'>
                <div className='bg-white/10 size-full p-2 flex gap-2 rounded-sm'>
                    <div>
                        <div className='size-16 rounded-sm bg-white/10'/>
                    </div>
                    <div>
                        <p className='text-[20px] text-white88 text-wrap'>{projectDetails?.title}</p>
                        <p className='text-[13px] text-white32'>@{projectDetails?.organisationHandle}</p>
                    </div>
                </div>
                <div className='h-[1px] w-full bg-white7'/>
                <img width={60} src={checkTick} alt="" />
                <div className='flex flex-col items-center gap-1'>
                    <p className='font-inter text-[16px] leading-[22px] text-white'>Updated details</p>
                    <p className='text-[13px] leading-[15.6px] font-medium text-white32'>You can now view updated details of the project overview</p>
                </div>
                <button className='w-full text-primaryYellow font-gridular text-[14px] leading-[20px] bg-cardBlueBg py-2 rounded-md'
                    onClick={() => {
                        navigate(`/projectdetails/${projectDetails?._id}`)
                    }}
                >
                   View Project
                </button>
            </div>
        </div>
    )
}

export default SubmissionsPage