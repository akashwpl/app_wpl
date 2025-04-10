import used_by_img from '../../assets/svg/template_images/used_by.png';
import template_card_bg from '../../assets/svg/template_card_bg.png';
import template_card_hover_bg from '../../assets/svg/template_card_hover_bg.png';
import { useState } from 'react';

const TemplateCard = ({ cardData, handleTemplateProjectStates }) => {
  const [isHovered, setIsHovered] = useState(false);
  const transtionDuration = 300

  return (
    <div
      className='w-[290px] h-[190px] cursor-pointer relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleTemplateProjectStates(cardData?.id)}
    >
      {/* Background Image (Base) */}
      <img
        src={template_card_bg}
        alt='template card background'
        className={`w-full h-full absolute top-0 left-0 transition-opacity duration-${transtionDuration} ease-in-out`}
        style={{ opacity: isHovered ? 0 : 1 }}
      />

      {/* Background Image (Hover) */}
      <img
        src={template_card_hover_bg}
        alt='template card hover background'
        className={`w-full h-full absolute top-0 left-0 transition-opacity duration-${transtionDuration} ease-in-out`}
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className='absolute inset-0 top-0 px-8 py-5'>
        <img src={cardData?.image} className='w-14 h-16 mx-auto my-5' alt="" />
        <div className='flex items-center justify-between'>
          <div className='flex flex-col justify-center'>
            <p className='font-gridular text-[14px] text-white88'>{cardData?.title}</p>
            <div className='flex items-center gap-1'>
              <p className='font-inter text-[12px] font-medium text-white64'>Used by</p>
              <img src={used_by_img} className='w-5' alt="User by image" />
            </div>
          </div>
          <button className='font-gridular text-[16px] text-primaryBlue bg-primaryGreen w-11 h-6 rounded-md'>Use</button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;