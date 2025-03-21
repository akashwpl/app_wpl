import { ArrowLeft, ArrowRight, CircleCheck, CircleX, Download } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import btnPng from '../assets/images/leaderboard_btn.png'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { displaySnackbar } from '../store/thunkMiddleware'
import { adminOpenProjectApproveOrReject, adminProjectApproveOrReject, createNotification, getPendingProjects } from '../service/api'


const Requests = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user_id } = useSelector((state) => state)

    const [currentPage, setCurrentPage] = useState(1)
    const [filteredReq, setFilteredReq] = useState([])
    const itemsPerPage = 8

    const {data: allPendingProjects, isLoading: isLoadingallPendingProjects, refetch: refetchPendingProjects} = useQuery({
        queryKey: ['allPendingProjects'],
        queryFn: () => getPendingProjects(),
    })

    useEffect(() => {
        if(!isLoadingallPendingProjects) {
            console.log('pendingProj',allPendingProjects);
            allPendingProjects?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setFilteredReq(allPendingProjects);
        }
    },[isLoadingallPendingProjects, allPendingProjects])

    const handleAcceptRejectRequest = async (id, userId, title, bountyType, status) => {
        const dataObj = { isApproved: status }
        let res;
        if(!bountyType) {
            res = await adminProjectApproveOrReject(id, dataObj);
        } else {
            res = await adminOpenProjectApproveOrReject(id, dataObj);
        }
        
        if(res._id) {
            const notiObj = {
                msg: `Admin has ${status ? "approved" : "rejected"} your bounty: ${title}.`,
                type: 'project_req',
                fromId: user_id,
                user_id: userId,
                project_id: id
            }
            const res = await createNotification(notiObj)
            dispatch(displaySnackbar(`You have successfully ${status ? 'Approved' : 'Rejected'} the bounty: ${title}.`))
        } 
        refetchPendingProjects();
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentData = filteredReq?.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredReq?.length / itemsPerPage); i++) {
      pageNumbers?.push(i);
    }

    console.log('pnum',pageNumbers);
    

    const navigateToProjects = (id) => {
        navigate(`/projectdetails/${id}`)
    }   

    console.log('cp',currentPage);
    

    return (
        <div className='size-full'>
            <div className='mx-20 mt-28'>
                <h2 className='font-gridular text-xl text-primaryYellow'>Gig requests from WPL Sponsors</h2>

                {/* TABLE */}
                <div className='mt-8'>
                    <div className=''>
                        <div className='bg-[#091044] rounded-md py-2'>
                            <div className='flex justify-between items-center px-4 py-2 mb-1'>
                                <div className='text-[14px] font-gridular text-white88'>Requests ({filteredReq?.length})</div>
                                {/* <div className='text-[12px] font-gridular text-white48 flex items-center gap-2'>Download as CSV <Download size={18} color='#FFFFFF7A'/></div> */}
                            </div>
                            <div className="border border-dashed border-white88 w-full"></div>
                            {filteredReq?.length == 0 
                            ?       <div className='text-[14px] text-primaryYellow font-gridular px-4 py-6 text-center'>No Requests to process</div> 
                            :
                                <>
                                    <div className='grid grid-cols-10 gap-2 my-4 px-4'>
                                        <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                                        <div className='text-[14px] col-span-2 text-white48 font-inter'>Name</div>
                                        <div className='text-[14px] col-span-2 text-white48 font-inter'>Organisation</div>
                                        <div className='text-[14px] col-span-5 text-white48 font-inter'>Description</div>
                                        {/* <div className='text-[14px] col-span-2 text-white48 font-inter'>Action</div> */}
                                    </div>
                                    <div className="border border-dashed border-white88 w-full"></div>
                                    <div className='max-h-[515px] overflow-y-hidden'>
                                        {currentData?.map((proj, index) => (
                                            <div 
                                                onClick={() =>navigateToProjects(proj._id)}
                                                key={index} className={`grid grid-cols-10 gap-2 py-3 items-center cursor-pointer px-5 border-b border-white7 hover:bg-white12`}>
                                                <div className='text-[14px] col-span-1 text-white88 font-inter'>{(parseInt(indexOfFirstItem)+parseInt(index))+1}</div>
                                                <div className='text-[14px] col-span-2 text-start text-white88 font-inter'>
                                                    {proj?.title}
                                                </div>
                                                <div className='text-[14px] col-span-2 text-start text-white88 font-inter'>
                                                    {proj?.organisation?.organisationHandle}
                                                </div>
                                                <div className='text-[14px] col-span-5 text-white88 font-inter truncate'>
                                                    {proj?.description}
                                                </div>
                                                {/* <div className='col-span-2 flex justify-between w-[90px]'> */}

                                                    {/* <CircleCheck onClick={() => handleAcceptRejectRequest(proj._id,proj.owner_id,proj.title,proj.isOpenBounty,true)} className='text-cardGreenText/70' size={30} />
                                                    <CircleX onClick={() => handleAcceptRejectRequest(proj._id,proj.owner_id,proj.title,proj.isOpenBounty,false)} className='text-cardRedText/70' size={30} /> */}
                                                {/* </div> */}
                                            </div>
                                        ))}
                                    </div>
                                </>}
                            </div>
                        </div>

                    {/* pagination */}
                    <div className="flex justify-end items-center gap-2 md:gap-6 mt-6">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className='relative'>
                            <img src={btnPng} alt='' className='w-[34px] h-[23px]'/>
                            <ArrowLeft size={20} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-4 h-4 text-white48'/>
                        </button>
                        <div className='flex gap-4 text-white text-[12px] font-gridular'>
                        {pageNumbers.map((number) => {
                            if (number === 1 || number === pageNumbers.length || (number >= currentPage - 1 && number <= currentPage + 1)) {
                            return (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={currentPage === number ? 'bg-[#293BBC] w-[20px] h-[18px]' : ''}
                                >
                                    {number}
                                </button>
                            );
                            } else if (number === currentPage - 2 || number === currentPage + 2) {
                            return <span key={number}>...</span>;
                            }
                            return null;
                        })}
                        </div>
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} className='relative'>
                            <img src={btnPng} alt='' className='w-[34px] h-[23px]'/>
                            <ArrowRight size={20} className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[50%] w-4 h-4 text-white48'/>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Requests;