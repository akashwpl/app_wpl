import { ArrowLeft, CheckCheck } from "lucide-react"
import FancyButton from "../ui/FancyButton"
import { useNavigate } from "react-router-dom"

import greenBtnHoverImg from '../../assets/svg/green_btn_hover_subtract.png';
import greenBtnImg from '../../assets/svg/green_btn_subtract.png';

import add_bounty_img from '../../assets/images/add_bounty.png'
import add_grant_img from '../../assets/images/add_project.png'
import add_project_img from '../../assets/images/contributor_signup.png'

import loginBtnHoverImg from '../../assets/svg/btn_hover_subtract.png'
import loginBtnImg from '../../assets/svg/btn_subtract_semi.png'
import { useState } from "react";

const stepsData = {
	bounty: [
		{
			index: 1,
			title: 'Submit your form',
			desc: 'Create your bounty by filling a simple form',
		},
		{
			index: 2,
			title: 'Admin Approval',
			desc: 'Our team review & approves your application',
		},
		{
			index: 3,
			title: 'Bounty goes live',
			desc: 'The approved bounty becomes visible to the whole network',
		},
		{
			index: 4,
			title: 'Receive submissions',
			desc: 'Start receiving submissions from users',
		},
		{
			index: 5,
			title: 'Review & reward',
			desc: 'Review the submission, select the best one & reward!',
		},
	],
	project: [
		{
			index: 1,
			title: 'Submit your form',
			desc: 'Create your project by filling a simple form',
		},
		{
			index: 2,
			title: 'Admin Approval',
			desc: 'Our team review & approves your application',
		},
		{
			index: 3,
			title: 'Project goes live',
			desc: 'The approved project becomes visible to the whole network',
		},
		{
			index: 4,
			title: 'Receive potential Participants',
			desc: 'Start receiving applications from potential project participants',
		},
		{
			index: 5,
			title: 'Accept Participants',
			desc: 'Shortlist participants for the project task',
		},
		{
			index: 6,
			title: ' Review and Rewards',
			desc: 'Reveiw the submission and reward the user',
		},
	],
	grant: [
		{
			index: 1,
			title: 'Submit your form',
			desc: 'Create your grant by filling a simple form',
		},
		{
			index: 2,
			title: 'Admin Approval',
			desc: 'Our team review & approves your application',
		},
		{
			index: 3,
			title: 'Grant goes live',
			desc: 'The approved grant becomes visible to the whole network',
		},
	]
}

const SelectProjectType = () => {
  const navigate = useNavigate();

	const [isFirstScreen, setIsFirstScreen] = useState(true)
	const [gigType, setGigType] = useState('bounty');

	const handleGigChange = (type) => {
		setGigType(type);
		setIsFirstScreen(false);
	}

	const handleGigNavigation = (type) => {
		switch (type) {
			case "bounty":
				navigate('/addproject/bounty')
				break;
			case "project":
				navigate('/addproject/project')
				break;
			case "grant":
				navigate('/addgrant')
				break;
			default:
				navigate('/addproject/bounty')
				break;
		}
	}

	const handleGoBackBtn = () => {
		if(isFirstScreen) {
			navigate('/');
		} else {
			setGigType('bounty')
			setIsFirstScreen(true);
		}
	}

  return (
    <>
      <div className='absolute -top-6 left-20'>
        <div 
          onClick={handleGoBackBtn} 
          className='cursor-pointer hover:text-white64 text-white32 flex items-center gap-1 w-fit'
        >
            <ArrowLeft size={14} className=''/>
            <p className='font-inter text-[14px]'>Go back</p>
        </div>
      </div>
			{isFirstScreen ? 
				<div className='flex justify-center items-center gap-14 h-[80vh] mt-24'>
					{/* Create a Bounty */}
					<div className='flex flex-col w-[320px]'>
							<p className='font-gridular text-[24px] text-primaryGreen'>Create a Bounty</p>
							<p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>Bounties are listings where everyone completes a given scope of work, and competes for the prize pool </p>

							<div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
									<img className='w-[290px] h-[250px]' src={add_bounty_img} alt="bounty_img" />
									<div className='flex flex-col h-[110px]'>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Great for awareness campaigns where you want to reach the most people possible</p>
											</div>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Get multiple options to choose from</p>
											</div>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Examples: Twitter threads, Deep-Dives, Memes, Product Feedback, and more</p>
											</div>
									</div>
									<FancyButton 
											src_img={greenBtnImg} 
											hover_src_img={greenBtnHoverImg} 
											img_size_classes='w-[500px] h-[44px]' 
											className='font-gridular text-[14px] leading-[8.82px] text-primaryGreen mt-1.5'
											btn_txt='Create a bounty'  
											alt_txt='Add project btn' 
											onClick={() => handleGigChange('bounty')}
									/>
							</div>
					</div>

					{/* Create a Project */}
					<div className='flex flex-col w-[320px]'>
							<p className='font-gridular text-[24px] text-primaryYellow'>Create a Project</p>
							<p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>Projects are freelance gigs - people apply with their proposals but don't begin work until you pick them</p>

							<div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
									<img className='w-[290px] h-[250px]' src={add_project_img} alt="project_img" />
									<div className='flex flex-col h-[110px]'>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Perfect for work that requires collaboration and iteration</p>
											</div>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Single output that is specific to your exact needs</p>
											</div>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Examples: Full Stack Development, Hype Video Production, Hiring a Community Manager, and more</p>
											</div>
									</div>
									<FancyButton 
											src_img={loginBtnImg} 
											hover_src_img={loginBtnHoverImg} 
											img_size_classes='w-[500px] h-[44px]' 
											className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
											btn_txt='Create a project'  
											alt_txt='project apply btn' 
											onClick={() => handleGigChange('project')}
									/>
							</div>
					</div>

					{/* Create a Grant */}
					<div className='flex flex-col w-[320px]'>
							<p className='font-gridular text-[24px] text-primaryGreen'>Create a Grant</p>
							<p className='font-inter text-[12px] text-white48 font-medium leading-4 mb-5'>Bounties are listings where everyone completes a given scope of work, and competes for the prize pool </p>

							<div className='flex flex-col py-3 px-4 bg-cardBlueBg2 rounded-md gap-4'>
									<img className='w-[290px] h-[250px]' src={add_grant_img} alt="grant_img" />
									<div className='flex flex-col h-[110px]'>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Great for awareness campaigns where you want to reach the most people possible</p>
											</div>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Get multiple options to choose from</p>
											</div>
											<div className="flex flex-row text-white32 w-full items-center">
													<CheckCheck className='mr-1'/>
													<p className='font-medium font-inter text-xs w-full'>Examples: Twitter threads, Deep-Dives, Memes, Product Feedback, and more</p>
											</div>
									</div>
									<FancyButton 
											src_img={greenBtnImg} 
											hover_src_img={greenBtnHoverImg} 
											img_size_classes='w-[500px] h-[44px]' 
											className='font-gridular text-[14px] leading-[8.82px] text-primaryGreen mt-1.5'
											btn_txt='Create a grant'  
											alt_txt='Add grant btn' 
											onClick={() => handleGigChange('grant')}
									/>
							</div>
					</div>
				</div>
			:
				<div className='flex justify-center items-center h-[80vh] mt-24'>
					<div className="flex flex-col bg-white4 w-[420px] p-3 gap-4 rounded-md">
						{/* Title */}
						<div className="flex flex-col gap-1.5">
							<p className="font-gridular text-[24px] leading-7 text-primaryYellow capitalize">Create {gigType}</p>
							<p className="font-inter font-medium text-[12px] leading-[14.4px] text-white48">Here are the steps to create a <span className="capitalize">{gigType}</span></p>
						</div>
						{/* Points */}
						<div className="bg-cardGithubBlueBg p-5 rounded-md flex flex-col gap-3.5">
							{/* single point */}
							{stepsData[gigType]?.map((step) => {
								return (
								<div className="flex items-center gap-3.5">
									<div className="bg-white7 flex flex-row items-center justify-center rounded-full size-8">
										<p className="font-gridular text-[14px] leading-[11.2px] text-primaryYellow ">{step.index}</p>
									</div>
									<div className="flex flex-col">
										<p className="font-inter text-[14px] leading-5 text-white88">{step.title}</p>
										<p className="font-inter text-[10px] leading-3 text-white32">{step.desc}</p>
									</div>
								</div>
								)
							})}
						</div>
						{/* Create gig btn */}
						<FancyButton 
							src_img={loginBtnImg} 
							hover_src_img={loginBtnHoverImg} 
							img_size_classes='w-[500px] h-[44px]' 
							className='font-gridular text-[14px] leading-[8.82px] text-primaryYellow mt-1.5'
							btn_txt={`Create ${gigType}`}  
							alt_txt='Create gig btn' 
							onClick={() => handleGigNavigation(gigType)}
						/>
					</div>
				</div>
			}
  	</>
  )
}

export default SelectProjectType