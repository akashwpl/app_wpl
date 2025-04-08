import { useState } from "react";

const FancyButton = ({
  src_img,
  hover_src_img = src_img,
  img_size_classes = '',
  className,
  btn_txt,
  alt_txt = 'Image alt text',
  isArrow = false,
  onClick,
  disabled = false,
  transitionDuration = 0, // New prop for transition duration (in ms)
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const durationClass = transitionDuration > 0 ? `duration-${transitionDuration}` : '';

  return (
    <button
      className={`relative ${disabled && 'cursor-not-allowed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Base Image */}
      <img
        src={src_img}
        alt={alt_txt}
        className={`${img_size_classes} ${transitionDuration ? `transition-opacity duration-${transitionDuration} ease-in-out` : ''}`}
        style={{ opacity: isHovered ? 0 : 1 }}
      />

      {/* Hover Image */}
      <img
        src={hover_src_img}
        alt={`${alt_txt} on hover`}
        className={`absolute top-0 left-0 ${img_size_classes} ${transitionDuration ? `transition-opacity duration-${transitionDuration} ease-in-out` : '' }`}
        style={{ opacity: isHovered ? 1 : 0 }}
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
  );
};

export default FancyButton; 