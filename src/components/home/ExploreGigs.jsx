import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, ArrowUpRight, DollarSign, LayoutGrid, ListFilter, TableProperties, TimerIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUserDetails, getUserProjects } from "../../service/api"
import Spinner from "../ui/spinner"
import Tabs from "../ui/Tabs"
import ExploreGigsCard from "./ExploreGigsCard"
import { useSelector } from "react-redux"


const initialTabs = [
  {id: 'building', name: 'Building', isActive: true},
  {id: 'current', name: 'Current', isActive: false},
  {id: 'Done', name: 'Done', isActive: false}
]

const ExploreGigs = ({userId}) => {

  const navigate = useNavigate()
  const { user_id } = useSelector((state) => state)

  const [tabs, setTabs] = useState(initialTabs)
  const [selectedTab, setSelectedTab] = useState('building')
  const [sortOrder, setSortOrder] = useState('ascending')
  const [sortBy, setSortBy] = useState('prize')

  const [showfilterModal, setShowFilterModal] = useState(false)
  const [projectsGridView, setProjectsGridView] = useState(false)


  const {data: userProjects, isLoading: isLoadingUserProjects} = useQuery({
    queryKey: ["userProjects"],
    queryFn: getUserProjects
  })


  const handleTabClick = (id) => {
    const newTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === id
    }));
    setTabs(newTabs)
    setSelectedTab(id)
  }

  const navigateToProjectDetails = () => {
    navigate(`/allprojects`)
  }

  const filteredProjects = useMemo(() => {
    // Filter projects based on the selected tab
    let projectsToSort = [];
    if (selectedTab === 'building') projectsToSort = userProjects?.filter(project => project.status === 'ongoing');
    else if (selectedTab === 'Done') projectsToSort = userProjects?.filter(project => project.status === 'completed');
    else if (selectedTab === 'current') projectsToSort = userProjects?.filter(project => project.status === 'submitted');
    else projectsToSort = userProjects;

    // Sort by the last milestone's deadline

    if(sortBy == 'prize') {
      return projectsToSort
        ?.sort((a, b) => {
          return sortOrder === 'ascending' ? a.totalPrize - b.totalPrize : b.totalPrize - a.totalPrize;
        });
    } else {
    return projectsToSort
      ?.sort((a, b) => {
        const dateA = a.milestones && a.milestones.length > 0
          ? new Date(a.milestones[a.milestones.length - 1].deadline)
          : new Date(0); // fallback date if no milestones
        const dateB = b.milestones && b.milestones.length > 0
          ? new Date(b.milestones[b.milestones.length - 1].deadline)
          : new Date(0); // fallback date if no milestones
        
          return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
      });
    }
  }, [userProjects, selectedTab, sortOrder]);

  return (
    <div>
        {userId == user_id ? 
          <div className="flex justify-between items-center">
            <h1 className="font-gridular text-primaryYellow text-[20px]">My Gigs</h1>
            <p onClick={navigateToProjectDetails} className="font-gridular bg-white4 py-2 px-2 rounded-md text-primaryYellow/70 hover:text-primaryYellow text-[14px] leading-[24px] flex items-center gap-1 cursor-pointer">Explore all <ArrowUpRight size={16}/></p>
          </div>
          : null
        }
        <div className="flex justify-between items-center border border-white7 rounded-[2px] mt-5">
          <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab}/>
          <div className="flex flex-row items-center w-[200px] justify-evenly  text-white48">
            <div className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[56px] h-[32px]">
                <LayoutGrid onClick={() => {setProjectsGridView((prev) => !prev)}} size={14} className={`${projectsGridView ? "text-primaryYellow" : "text-white32"} cursor-pointer`}/>
                <div className='h-full border border-r border-white/10'></div>
                <TableProperties onClick={() => {setProjectsGridView((prev) => !prev)}} className={`${!projectsGridView ? "text-primaryYellow" : "text-white32"} cursor-pointer`} size={14} rotate={90}/>
            </div>
            <div className="flex flex-row justify-center items-center cursor-pointer relative">
                <div onClick={() => setShowFilterModal((prev) => !prev)} className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[89px] h-[32px]">
                  <ListFilter size={12}/>
                  <p className='font-gridular text-[14px] leading-[16.8px]'>Filter</p>
                </div>

                {showfilterModal && 
                  <div className="absolute w-[150px] top-9 -left-4 bg-primaryBlue rounded-md">
                    <p onClick={() => {setSortBy('prize'); setShowFilterModal(false)} } className="text-[14px] text-white88 font-semibold hover:bg-white12 pl-4 flex items-center gap-1 font-inter py-2 cursor-pointer"><DollarSign size={16}/> Prize</p>
                    <div className="h-[1px] w-full bg-white12 my-1" />
                    <p onClick={() => {setSortBy('deadline'); setShowFilterModal(false)}} className="text-[14px] text-white88 font-semibold hover:bg-white12 pl-4 flex items-center gap-1 font-inter py-2 cursor-pointer"><TimerIcon size={16}/> Deadline</p>
                  </div>
                }
            </div>
          </div>
        </div>

        <div>
          {isLoadingUserProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
          filteredProjects && selectedTab == 'building' && !filteredProjects?.length ? <div className="mt-4">
              <div className="font-gridular text-primaryYellow text-[24px]">Start Contributing to Gigs</div>
              <div className="flex justify-center items-center mt-8">
                <button onClick={navigateToProjectDetails} className="bg-primaryYellow/90 hover:bg-primaryYellow text-black w-fit px-4 py-1 rounded-md font-bienvenue mt-3 text-[20px]">Explore Gigs</button>
              </div>
            </div>
            : selectedTab !== 'building' && !filteredProjects?.length ? <div className="font-gridular text-primaryYellow text-[24px] mt-4">No gigs found</div> 
            : filteredProjects?.map((project, idx) => <div key={idx} className={`hover:bg-white4 my-4 ${projectsGridView ? "grid grid-cols-12" : "flex flex-col"}`}> 
                <ExploreGigsCard data={project} type={"project"}/>
                <div className='border border-x-0 border-t-0 border-b-white7'></div>
            </div>
          )}
        </div>
    </div>
  )
}

export default ExploreGigs