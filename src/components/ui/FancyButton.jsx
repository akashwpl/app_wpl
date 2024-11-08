import { useState } from "react";


const FancyButton = ({
  src_img, 
  hover_src_img=src_img, 
  img_size_classes='', 
  className, 
  btn_txt, 
  alt_txt='Image alt text', 
  isArrow=false,
  onClick,
}) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => setIsHovered(!isHovered);

  return (
    <button 
      className='relative' 
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      onClick={onClick}
    >
        <img 
          src={isHovered ? hover_src_img : src_img } 
          alt={alt_txt}
          className={img_size_classes}
        />
        <div className="absolute inset-0 top-1/4 uppercase">
            <p className={className}>
              {btn_txt}
              {isArrow && (
                <span className={`transition-all duration-300 ${isHovered ? 'ml-2' : ''}`}> →</span>
              )}
            </p>
        </div>
    </button>
  )
}

export default FancyButton