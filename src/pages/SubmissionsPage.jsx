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
        // const { _id, __v, $__, $isNew, status, user, comments, milestones, totalPrize, created_at, updated_at, ...submissionData } = currentSubmission;

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

        submissionData.status = 'accepted';
        acceptRejectSubmission(submissionData, currentSubmission?._doc?._id)
    }

    console.log('submissions', submissions)

    return (
        <div>
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
                          <p className="text-[14px] leading-[20px]">Fill the Information</p>
                        </div>
                        <div className='h-[1px] w-full bg-primaryYellow'/>
                        <div className='flex justify-between gap-4'>
                            <div className='flex flex-col gap-1 w-40 md:w-full'>
                                <label 
                                  htmlFor='username'
                                  className='text-[13px] leading-[15.6px] font-medium text-white32'
                                >
                                  Your Name
                                </label>
                                <input 
                                  defaultValue={currentSubmission?.user?.displayName}
                                  className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`} 
                                  placeholder='Jhon Doe'
                                  name='username'
                                  id='username'
                                //   onChange={handleChange}
                                />
                                
                            </div>
                            <div className='flex flex-col gap-1 w-44 md:w-full'>
                                <label 
                                  htmlFor='emailId' 
                                  className='text-[13px] leading-[15.6px] font-medium text-white32'
                                >
                                  Your Email
                                </label>
                                <input 
                                  defaultValue={currentSubmission?.user?.email}
                                  className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}
                                  placeholder='Jhon@Doe.com'
                                  name='emailId'
                                  id='emailId'
                                //   onChange={handleChange}
                                />
                               
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label 
                              htmlFor='appExp' 
                              className='text-[13px] leading-[15.6px] font-medium text-white32'
                            >
                              Do you have experience designing application?
                            </label>
                            <textarea 
                              className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}
                              placeholder='I am a preety fuckin cool dev'
                              rows={3}
                              name='appExp'
                              id='appExp'
                            //   onChange={handleChange}
                            />
                           
                        </div>

                        <div className='flex flex-col gap-1 w-44 md:w-full'>
                          <label 
                            htmlFor='emailId' 
                            className='text-[13px] leading-[15.6px] font-medium text-white32'
                          >
                            Portfolio link
                          </label>
                          <input 
                            className={`bg-white7 rounded-[6px] text-white48 placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}
                            placeholder='https://www.johndoe.com'
                            name='portfolioLink'
                            id='portfolioLinkid'
                            // onChange={handleChange}
                          />
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <label 
                              htmlFor='ercAddress' 
                              className='text-[13px] leading-[15.6px] font-medium text-white32'
                            >
                              Enter your ERC-20 Address
                            </label>
                            <input 
                              defaultValue={currentSubmission?.user?.walletAddress}
                              className={`bg-white7 rounded-[6px] placeholder:text-white32 px-3 py-2 text-[14px] focus:outline-0 focus:bg-white7`}
                              placeholder='0xabc1234....'
                              name='ercAddress'
                              id='ercAddress'
                            //   onChange={handleChange}
                            />
                            
                        </div>
                        

                    </div>

                </div>
              </div>

        </div>
      </div>

            </div>


            <div className='flex justify-between items-center mt-4'>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                    className='text-white88 disabled:text-white48'
                >
                <ChevronLeft size={20} />
                </button>
                <div className='text-[14px] text-white88 font-inter'>
                {currentPage + 1} of {totalSubmissions}
                </div>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalSubmissions - 1}
                    className='text-white88 disabled:text-white48'
                >
                <ChevronRight size={20} />
                </button>
            </div>

            <button onClick={handleAccpetReject}>accetp</button>
        
        </div>
    )
}

export default SubmissionsPage