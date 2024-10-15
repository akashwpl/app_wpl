import { useEffect, useState } from "react"
import Tabs from "../ui/Tabs"
import ExploreGigsCard from "./ExploreGigsCard"
import { LayoutGrid, ListFilter, TableProperties } from "lucide-react"
import { BASE_URL } from "../../lib/constants"


const initialTabs = [
  {id: 'opengigs', name: 'Open Gigs', isActive: true},
  {id: 'inreview', name: 'In Review', isActive: false},
  {id: 'completed', name: 'Completed', isActive: false}
]

const ExploreGigs = () => {

  const [tabs, setTabs] = useState(initialTabs)
  const [selectedTab, setSelectedTab] = useState('opengigs')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchAllProjects()
  }, [])

  const fetchAllProjects = async () => {
    const reposne = await fetch(`${BASE_URL}/projects/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token_app_wpl')}`
      }
    }).then(res => res.json())
    .then(data => {
      setProjects(data?.data)
    })
  }

  console.log('projects', projects)

  const handleTabClick = (id) => {
    const newTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === id
    }));
    setTabs(newTabs)
    setSelectedTab(id)
  }

  return (
    <div>
        <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-6">Explore Gigs</p>
        <div className="flex justify-between items-center border border-white7 rounded-[2px]">
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

        {selectedTab === 'opengigs' && <div>
            <ExploreGigsCard />
            <ExploreGigsCard />
            <ExploreGigsCard />
            <ExploreGigsCard />
        </div>}
        {selectedTab === 'inreview' &&  <div>
            <ExploreGigsCard />
            <ExploreGigsCard />
            <ExploreGigsCard />
            <ExploreGigsCard />
        </div>}
        {selectedTab === 'completed' &&  <div>
            <ExploreGigsCard />
            <ExploreGigsCard />
            <ExploreGigsCard />
            <ExploreGigsCard />
        </div>}
      
    </div>
  )
}

export default ExploreGigs