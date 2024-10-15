import React from 'react'
import wpllogo from '../assets/images/wpl_prdetails.png'
import headerPng from '../assets/images/prdetails_header.png'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import PoWCard from '../components/profile/PoWCard'
import { ArrowUpRight, DiscIcon, Edit2, Mail, Send } from 'lucide-react'

import dummyPng from '../assets/dummy/Container.png'
import { Link } from 'react-router-dom'


const ProfilePage = () => {
  return (
    <div className='overflow-x-hidden'>
      <div>
        <img src={headerPng} alt='header' className='h-[200px] w-full'/>
      </div>

      <div className='flex flex-col justify-center items-center'>
        <div className='w-[350px] md:w-[480px]'>
          <div className='-translate-y-8'>
            <img src={wpllogo} alt="WPL Logo" className='size-[72px]'/>
          </div>

          <div>
            <div className='flex justify-between'>
              <div>
                <p className='text-[24px] leading-[28px] text-primaryYellow font-gridular'>Akshit Verma</p>
                <p className='text-[14px] text-white32 font-inter'>@akshit</p>
              </div>
              <div className='bg-white7 rounded-[6px] flex gap-1 items-center h-[32px] px-2 py-1'>
                <Link to={'/editprofile'}><p className='text-[12px] text-white48 font-medium font-inter'>Edit Profile</p></Link>
                <Edit2 size={14} className='text-white32'/>
              </div>
            </div>

            <div className='text-white88 font-inter mt-3'>
              <p>A short bio about how big my ego is</p>
            </div>

            <div className='text-[14px] text-white88 font-inter flex items-center gap-1 mt-3'>
              <p>00 <span className='text-white32'>Projects Completed</span></p>
              <p>$0.00 <span className='text-white32'>Earned</span></p>
            </div>
          </div>

          <div className='border-t border-white7 mt-6'>
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-white7">
                <AccordionTrigger className="text-white48 font-inter hover:no-underline">Proof of Work</AccordionTrigger>
                <AccordionContent>
                  {powdummy.map((project, index) => (
                    <PoWCard key={index} data={project}/>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-white7">
              <AccordionTrigger className="text-white48 font-inter hover:no-underline">Active Projects</AccordionTrigger>
                <AccordionContent>
                  {projectdummy && projectdummy.length == 0 ? 
                    <div className='text-center pt-4'>
                        <p className='text-[#FAF1B1E0] font-gridular'>Nothing to see here</p>
                        <p className='text-[12px] text-white32 font-medium'>Start contributing to more projects and earn rewards.</p>
                    </div>
                  :
                    projectdummy.map((project, index) => (
                      <PoWCard key={index} data={project}/>
                    ))
                  }
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-white7">
                <AccordionTrigger className="text-white48 font-inter hover:no-underline">Contact</AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-col gap-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-1'>
                        <DiscIcon size={16} className='text-white32'/>
                        <p className='text-[14px] text-white32'>Discord</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <p className='text-[14px] text-white88'>@akshitverma</p>
                        <ArrowUpRight size={16} className='text-white32'/>
                      </div>
                    </div>

                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-1'>
                        <Send size={16} className='text-white32'/>
                        <p className='text-[14px] text-white32'>Telegram</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <p className='text-[14px] text-white88'>@akshitverma</p>
                        <ArrowUpRight size={16} className='text-white32'/>
                      </div>
                    </div>

                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-1'>
                        <Mail size={16} className='text-white32'/>
                        <p className='text-[14px] text-white32'>Email</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <p className='text-[14px] text-white88'>@akshitverma</p>
                        <ArrowUpRight size={16} className='text-white32'/>
                      </div>
                    </div>

                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage


const projectdummy = [
  {img: dummyPng, 
    title: 'UX Design for WPL', 
    projectdetails: {
      team: ['Akshit Verma', 'John Doe', 'Jane Doe'],
      endsOn: 'Ends on June 26',
    }
  },
]

const powdummy = [
  {img: dummyPng, 
    title: 'UX Design for WPL', 
    desc: 'Some one linear for my Project, coz it\'s asethetic', 
    skills: ['Frontend', 'Javascript', 'Figma'],
  },
  {img: dummyPng, 
    title: 'Frontend for WPL', 
    desc: 'Some one linear for my Project, coz it\'s asethetic', 
    skills: ['Frontend', 'Javascript', 'Figma', 'React'],
  },
]