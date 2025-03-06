import CustomModal from '../ui/CustomModal'
import { Reorder } from 'framer-motion'

const WinnersModal = (showSelecteWinnersModal, setShowSelecteWinnersModal, selectedWinners, setSelectedWinners) => {
  console.log('selectedWinners modadkald', selectedWinners)
  return (
    <CustomModal
    isOpen={showSelecteWinnersModal}
    closeModal={() => setShowSelecteWinnersModal(false)}
  >
    <div className='bg-[#101C77] w-[580px] h-[583px] rounded-xl py-6 px-3'>
      <div className='flex flex-col justify-center items-center gap-3'>
        <img src={""} className='size-[48px]'/>
        <h3 className='text-primaryYellow text-[24px] leading-[28px] font-gridular'>Reorder submissions as per rank</h3>
        <p className='w-[390px] text-center text-white32 text-[14px] font-inter leading-[19px]'>Hold and drag a submission to move it around. Remember 
        to rank people in descending order.</p>
      </div>
      <div>
        <Reorder.Group axis='y' values={selectedWinners} onReorder={setSelectedWinners}>
          {selectedWinners?.map((submission, index) => (
            <Reorder.Item
              value={submission}
              key={index}
              className='bg-white4 rounded-md p-3 flex items-center gap-3'
            >
              {submission?.user?.displayName}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  </CustomModal>
  )
}

export default WinnersModal