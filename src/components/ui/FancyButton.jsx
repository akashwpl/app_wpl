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
  disabled=false
}) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      className={`relative ${disabled && 'cursor-not-allowed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled}
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