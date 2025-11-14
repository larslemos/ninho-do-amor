import goldenHeart from '@/assets/golden_heart.webp';

interface HeartIconProps {
  className?: string;
  onClick?: () => void;
}

const HeartIcon = ({ className = '', onClick }: HeartIconProps) => {
  return (
    <div className={`inline-block cursor-pointer ${className}`} onClick={onClick}>
      <img
        src={goldenHeart}
        alt="Golden Heart"
        width="32"
        height="32"
        className="transition-transform hover:scale-110"
      />
    </div>
  );
};

export default HeartIcon;
