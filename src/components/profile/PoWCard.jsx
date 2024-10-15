import React from 'react'

const PoWCard = ({ data }) => {
  return (
    <div className='flex gap-4 items-center mb-4'>
        <div>
            <img src={data?.imgPreview || data?.img} alt='dummy' className='size-[50px] md:size-[90px] aspect-square rounded-lg'/>
        </div>
        <div>
            <p className='text-white font-inter'>{data?.title}</p>
            <div className='flex items-center gap-2 mt-1'>
                {data?.projectdetails ?
                    <div>
                        <div className='text-[13px] text-white48 font-inter flex items-center gap-1'>by 
                            <div className='flex items-center gap-1'>{data?.projectdetails?.team.map((mem, idx) => <p key={idx}>{mem}</p>)}</div>
                        </div>
                        <div className='text-[13px] text-white32'>{data?.projectdetails?.endsOn}</div>
                    </div>
                    : <div>
                        <p className='text-[13px] text-white32 font-medium font-inter mt-1'>{data?.desc}</p>
                        <div className='flex items-center gap-1 flex-wrap mt-1'>
                            {data?.skills?.map((lang, idx) => <div key={idx} className='bg-white7 text-[#FFFFFF3D] text-[12px] font-medium rounded-md px-2 py-1'>{lang}</div>)}
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default PoWCard