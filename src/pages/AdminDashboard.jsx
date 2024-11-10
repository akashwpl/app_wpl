import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import btnPng from '../assets/images/leaderboard_btn.png'
import wpl_logo from '../assets/images/wpl_prdetails.png'
import Statistics from '../components/home/Statistics'
import { getAllOrganisations, getUserDetails } from '../service/api'
import { useNavigate } from 'react-router-dom'



const AdminDashboard = () => {
    const navigate = useNavigate()
    const { user_id } = useSelector((state) => state)

    const {data: userDetails, isLoading: isLoadingUserDetails} = useQuery({
        queryKey: ["userDetails", user_id],
        queryFn: () => getUserDetails(user_id),
        enabled: !!user_id,
    })

    const {data: organisationsDetails, isLoading: isLoadingOrganisationDetails} = useQuery({
        queryKey: ["allOrganisations"],
        queryFn: () => getAllOrganisations(user_id),
    })

    console.log('organisationsDetails', organisationsDetails)
    
    const [searchInput, setSearchInput] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const filteredData = useMemo(() =>  searchInput
        ? dummyData.filter(data =>
            data.name.toLowerCase().includes(searchInput.toLowerCase())
        )
        : dummyData
    , [searchInput])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentData = organisationsDetails?.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData?.length / itemsPerPage); i++) {
      pageNumbers?.push(i);
    }

    const navigateToOrganisationPage = (id) => {
        navigate(`/organisation/${id}`)
    }


    return (
        <div className='flex flex-row justify-between mt-4 mx-8'>
            <div className='flex flex-col px-[46px] mt-4 w-full '>
                <Statistics userDetails={userDetails} />

                <div>
                    <div>
                        <h2 className='font-bold text-2xl text-primaryYellow font-gridular'>Organizations</h2>

                        <div className='border border-white7 h-[56px] rounded-md flex justify-between items-center mt-4'>
                            <div className='flex items-center gap-2 w-full ml-3'>
                                <Search className='text-white32' size={16}/>
                                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}  className='bg-transparent w-full outline-none border-none text-white88 placeholder:text-[14px] placeholder:text-white32 placeholder:font-gridular' placeholder='Search by name...'/>
                            </div>
                            <div className='border border-white7 min-w-[169px] h-full flex justify-center items-center'>
                                <div className='flex items-center justify-center border border-white7 rounded-md px-2 py-[6px] gap-1'>
                                    <Filter className='text-white32' size={15}/>
                                    <p className='font-gridular text-[14px] text-white48'>Sort Results</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 grid grid-cols-12 gap-1'>
                            {currentData?.map((data, index) => (
                                <div key={index} onClick={() => navigateToOrganisationPage(data?._id)} className='flex gap-2 col-span-3 justify-start hover:bg-white4 cursor-pointer py-4 px-2 rounded-md'>
                                    <div>
                                        <img src={data?.logo || wpl_logo} alt='' className='size-[70px] rounded-md'/>
                                    </div>
                                    <div className='flex flex-col justify-between'>
                                        <div>
                                            <h2 className='text-white88 text-[14px]'>{data?.name}</h2>
                                            <p className='text-white48 text-[14px]'>{data?.organisationHandle}</p>
                                        </div>
                                        <div className=''>
                                            <div className='text-white48 text-[14px]'>Project count: <span className='text-white88'>{data?.projectsCount || 0}</span></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
        </div>
    )
}

export default AdminDashboard


const dummyData = [
    {name: "org1", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 1},
    {name: "org2", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 2},
    {name: "org3", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 3},
    {name: "org4", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 4},
    {name: "org5", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 5},
    {name: "org6", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 6},
    {name: "org7", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 7},
    {name: "org8", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 8},
    {name: "org9", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 9},
    {name: "org10", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 10},
    {name: "org11", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 11},
    {name: "org12", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 12},
    {name: "org13", org_handle: "org_handle", logo: wpl_logo, projects_count: 10, _id: 13},
]