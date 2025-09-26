import goldenHeart from '@/assets/golden_heart.webp';

interface HeartIconProps {
  className?: string;
  onClick?: () => void;
}

const HeartIcon = ({ className = "", onClick }: HeartIconProps) => {
  return (
    <div 
      className={`inline-block cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img 
        src={goldenHeart}
        alt="Golden Heart"
        width="32" 
        height="32" 
        className="hover:scale-110 transition-transform"
      />
    </div>
  );
};

export default HeartIcon;