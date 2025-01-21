const SponsorStatistics = ({ userDetails, totalOrganisations }) => {
    console.log('userDetails', userDetails)
    return (
      <div className="mb-8">
          <p className="font-gridular text-primaryYellow text-[20px] leading-[24px] mb-8">Hey {userDetails ? userDetails?.displayName : "User"}</p>
          <div className="flex flex-row text-primaryBlue">
              <div className="mr-3 w-full h-[101px] py-5 px-5 bg-cover bg-[url('assets/images/total_earned_bg.png')] rounded-md">
                  <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Total Listings</p>
                  <p className='font-gridular text-[42px] leading-[50.4px]'>{userDetails ? userDetails?.totalProjectsInWPL : '0'}</p>
              </div>
              <div className='w-1/2 h-[101px] bg-primaryGreen py-6 px-3 rounded-lg mr-3'>
                <p className='font-inter font-medium text-[12px] leading-[14.4px] mb-1'>Rewards Distributed</p>
                <p className='font-gridular text-[42px] leading-[42px]'>
                    {"$0"}
                </p>
            </div>
          </div>
      </div>
    )
  }
  
  export default SponsorStatistics