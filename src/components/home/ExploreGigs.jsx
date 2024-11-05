import { useQuery } from "@tanstack/react-query"
import { ArrowUpRight, LayoutGrid, ListFilter, TableProperties } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUserProjects } from "../../service/api"
import Spinner from "../ui/spinner"
import Tabs from "../ui/Tabs"
import ExploreGigsCard from "./ExploreGigsCard"


const initialTabs = [
  {id: 'inprogress', name: 'In Progress', isActive: true},
  {id: 'inreview', name: 'In Review', isActive: false},
  {id: 'completed', name: 'Completed', isActive: false}
]

const ExploreGigs = () => {

  const navigate = useNavigate()

  const [tabs, setTabs] = useState(initialTabs)
  const [selectedTab, setSelectedTab] = useState('inprogress')


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

  const onGoingProjects =  useMemo(() => userProjects?.filter((project) => project.status === 'ongoing'), [userProjects])
  const completedProjects =  useMemo(() => userProjects?.filter((project) => project.status === 'completed'), [userProjects])
  const inReviewProjects =  useMemo(() => userProjects?.filter((project) => project.status === 'submitted'), [userProjects])

  return (
    <div>
        <div className="flex justify-between items-center">
          <h1 className="font-gridular text-primaryYellow text-[20px]">My Gigs</h1>
          <p onClick={navigateToProjectDetails} className="font-gridular bg-white4 py-2 px-2 rounded-md text-primaryYellow/70 hover:text-primaryYellow text-[14px] leading-[24px] flex items-center gap-1 cursor-pointer">Explore all <ArrowUpRight size={16}/></p>
        </div>
        <div className="flex justify-between items-center border border-white7 rounded-[2px] mt-5">
          <Tabs tabs={tabs} handleTabClick={handleTabClick} selectedTab={selectedTab}/>
          <div className="flex flex-row items-center w-[200px] justify-evenly  text-white48">
            <div className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[56px] h-[32px]">
                <LayoutGrid size={12}/>
                <div className='h-full border border-r border-white/10'></div>
                <TableProperties className='text-primaryYellow' size={12} rotate={90}/>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex flex-row justify-evenly items-center border border-white/10 rounded-lg w-[89px] h-[32px]">
                  <ListFilter size={12}/>
                  <p className='font-gridular text-[14px] leading-[16.8px]'>Filter</p>
                </div>
            </div>
          </div>
        </div>

        {selectedTab === 'inprogress' && <div>
          {isLoadingUserProjects ? <div className="flex justify-center items-center mt-10"> <Spinner /> </div> :
          userProjects && !userProjects?.length ? <div className="mt-4">
              <div className="font-gridular text-primaryYellow text-[24px]">Start Contributing to Gigs</div>
              <div className="flex justify-center items-center mt-8">
                <button onClick={navigateToProjectDetails} className="bg-primaryYellow/90 hover:bg-primaryYellow text-black w-fit px-4 py-1 rounded-md font-bienvenue mt-3 text-[20px]">Explore Gigs</button>
              </div>
              </div>
            : userProjects?.map((project, idx) => <div key={idx} className="hover:bg-white4 my-4"> 
                  <ExploreGigsCard data={project} type={"project"}/>
                  <div className=' border border-x-0 border-t-0 border-b-white7'></div>
              </div>
          )}
        </div>}
        {selectedTab === 'inreview' &&  <div>
            <div className="font-gridular text-primaryYellow text-[24px] mt-4">No Gigs in review</div>
        </div>}
        {selectedTab === 'completed' &&  <div>
          <div className="font-gridular text-primaryYellow text-[24px] mt-4">No Completed gigs found</div>
        </div>}
      
    </div>
  )
}

export default ExploreGigs