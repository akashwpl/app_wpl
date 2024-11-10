const Statistics = ({ userDetails, totalOrganisations }) => {
  return (
    <div className="mb-8">
        <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey {userDetails ? userDetails?.displayName : "User"},</p>
        <div className="flex flex-row text-primaryBlue">
            <div className="mr-3 w-2/4 h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Projects</p>
                <p className='font-gridular text-[42px] leading-[50.4px]'>{userDetails ? userDetails?.totalProjectsInWPL : '0'}</p>
            </div>
            <div className="mr-3 w-2/4 h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Organisations</p>
                <p className='font-gridular text-[42px] leading-[50.4px]'>{totalOrganisations || '0'}</p>
            </div>
        </div>
    </div>
  )
}

export default Statistics