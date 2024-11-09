import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, DollarSign, LayoutGrid, ListFilter, TableProperties, TimerIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUserDetails, getUserProjects } from "../../service/api"
import Spinner from "../ui/spinner"
import Tabs from "../ui/Tabs"
import ExploreGigsCard from "./ExploreGigsCard"
import { useSelector } from "react-redux"
import exploreBtnImg from '../../assets/svg/menu_btn_subtract.png'
import exploreBtnHoverImg from '../../assets/svg/menu_btn_hover_subtract.png'
import FancyButton from "../ui/FancyButton"

const initialTabs = [
  {id: 'building', name: 'Building', isActive: true},
  {id: 'in_review', name: 'In Review', isActive: false},
  {id: 'completed', name: 'Completed', isActive: false}
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
    else if (selectedTab === 'completed') projectsToSort = userProjects?.filter(project => project.status === 'completed');
    else if (selectedTab === 'in_review') projectsToSort = userProjects?.filter(project => project.status === 'submitted');
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

  const ExploreGigsBtn = () => {
    return (
      <FancyButton 
        src_img={exploreBtnImg} 
        hover_src_img={exploreBtnHoverImg} 
        img_size_classes='w-[175px] h-[44px]' 
        className='font-gridular text-[14px] leading-[16.8px] text-primaryYellow mt-0.5'
        btn_txt={<span className='flex items-center justify-center gap-2'><span>Explore all</span><ArrowUpRight size={18}/></span>} 
        alt_txt='save project btn' 
        onClick={navigateToProjectDetails}
      />
    )
  }

  return (
    <div>
        {userId == user_id ? 
          <div className="flex justify-between items-center">
            <h1 className="font-gridular text-primaryYellow text-[20px]">My Gigs</h1>
            {ExploreGigsBtn()}
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
          filteredProjects && selectedTab == 'building' && filteredProjects?.length ? <div className="mt-24">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="font-gridular text-white88 text-[24px]">You haven't applied to any projects :(</div>
              <p className="text-white32 font-gridular">Explore gigs and start building now!</p>
            </div>
              <div className="flex justify-center items-center mt-6">
                {ExploreGigsBtn()}
              </div>
            </div>
            : selectedTab !== 'building' && !filteredProjects?.length ? <div className="mt-24">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="font-gridular text-white88 text-[24px]">Oops! Looks like you haven't submitted a project :(</div>
                <p className="text-white32 font-gridular">Explore gigs and start building now!</p>
              </div>
                <div className="flex justify-center items-center mt-6">
                  {ExploreGigsBtn()}
                </div>
            </div>
            : filteredProjects?.map((project, idx) => <div key={idx} className={`my-4 ${projectsGridView ? "grid grid-cols-12" : "flex flex-col hover:bg-white4"}`}> 
                <ExploreGigsCard data={project} type={"project"} projectsGridView={projectsGridView}/>
                <div className='border border-x-0 border-t-0 border-b-white7'></div>
            </div>
          )}
        </div>
    </div>
  )
}

export default ExploreGigs