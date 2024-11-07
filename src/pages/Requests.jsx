import { ArrowLeft, ArrowRight, Download } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import btnPng from '../assets/images/leaderboard_btn.png'
import { useNavigate } from 'react-router-dom'


const Requests = () => {
    const navigate = useNavigate()

    const [searchInput, setSearchInput] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const filteredData = useMemo(() =>  searchInput
        ? projectSubmissions.filter(data =>
            data.user?.displayName.toLowerCase().includes(searchInput.toLowerCase())
        )
        : projectSubmissions
    , [searchInput])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData?.length / itemsPerPage); i++) {
      pageNumbers?.push(i);
    }

    const navigateToSubmissions = (id, page) => {
        navigate(`/submissions/${id}/${page}`)
    }

    return (
        <div className='size-full'>
            <div className='mx-20 mt-20'>
                <h2 className='font-gridular text-xl text-primaryYellow'>Requests to Join WPL as Sponsor</h2>

                {/* TABLE */}
                <div className='mt-10'>
                    <div className=''>
                        <div className='bg-[#091044] rounded-md px-4 py-2'>
                        <div className='flex justify-between items-center py-2'>
                            <div className='text-[14px] font-gridular text-white88'>Submission ({projectSubmissions?.length})</div>
                            <div className='text-[12px] font-gridular text-white48 flex items-center gap-2'>Download as CSV <Download size={18} color='#FFFFFF7A'/></div>
                        </div>
                        {currentData?.length == 0 ? <div className='text-[14px] text-primaryYellow font-gridular'>No submissions yet</div> : <>
                            <div className='grid grid-cols-12 gap-2 mb-2'>
                                <div className='text-[14px] col-span-1 text-white48 font-inter'>No.</div>
                                <div className='text-[14px] col-span-3 text-white48 font-inter'>Name</div>
                                <div className='text-[14px] col-span-4 text-white48 font-inter'>Description</div>
                            </div>
                            <div className='max-h-[300px] overflow-y-auto'>
                            {currentData?.map((submission, index) => (
                                <div onClick={() => navigateToSubmissions(submission?._id, index + 1)} key={index} className={`grid grid-cols-12 gap-2 py-2 cursor-pointer ${index == 4 ? "" : "border-b border-white7"}`}>
                                <div className='text-[14px] col-span-1 text-white88 font-inter'>{index + 1}</div>
                                <div className='text-[14px] col-span-3 text-start text-white88 font-inter'>
                                    <div className='flex flex-col'>
                                        <p className='text-white88 text-[14px]'>{submission?.user?.displayName}</p>
                                        <p className='text-white32 text-[10px]'>@{submission?.user?.organisationHandle}</p>
                                    </div>
                                </div>
                                <div className='text-[14px] col-span-4 text-white88 font-inter truncate'>{submission?._doc?.experienceDescription}</div>
                                </div>
                            ))}
                            </div>
                        </>
                        }
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

export default Requests

const projectSubmissions = [
    {
        _id: "671e360bf7b187d104dc4e16",
        user: {
            displayName: 'John Doe',
            organisationHandle: "JohnDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Jane Doe',
            organisationHandle: "JaneDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Subham Doe',
            organisationHandle: "ShuDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'John Doe',
            organisationHandle: "JohnDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Jane Doe',
            organisationHandle: "JaneDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Subham Doe',
            organisationHandle: "ShuDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'John Doe',
            organisationHandle: "JohnDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Jane Doe',
            organisationHandle: "JaneDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Subham Doe',
            organisationHandle: "ShuDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'John Doe',
            organisationHandle: "JohnDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
    {
        user: {
            displayName: 'Jane Doe',
            organisationHandle: "JaneDoe"
        },
        _doc: {
            experienceDescription: 'I have been working as a developer for 5 years',
            portfolioLink: 'https://google.com'
        }
    },
]