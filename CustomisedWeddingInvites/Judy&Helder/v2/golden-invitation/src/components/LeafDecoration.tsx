import goldenLeaflet from '@/assets/golden_leaflet.webp';

interface LeafDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const LeafDecoration = ({ position, className = "" }: LeafDecorationProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0 rotate-90';
      case 'bottom-left':
        return 'bottom-0 left-0 -rotate-90';
      case 'bottom-right':
        return 'bottom-0 right-0 rotate-180';
      default:
        return '';
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} ${className}`}>
      <img 
        src={goldenLeaflet}
        alt="Golden Leaflet Decoration"
        width="120" 
        height="120" 
        className="opacity-60"
      />
    </div>
  );
};

export default LeafDecoration;