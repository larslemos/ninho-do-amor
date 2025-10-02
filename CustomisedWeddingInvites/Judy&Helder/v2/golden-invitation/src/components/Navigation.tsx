import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const pages = [
    { id: 0, label: 'Bem-vindos' },
    { id: 1, label: 'Convite' },
    { id: 2, label: 'Manual' },
    { id: 3, label: 'Mensagem' }
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-elegant-gold/30">
        <div className="flex space-x-2">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant={currentPage === page.id ? "default" : "ghost"}
              onClick={() => onPageChange(page.id)}
              className={`rounded-full px-4 py-2 text-sm body-font transition-all duration-300 ${
                currentPage === page.id 
                  ? 'bg-elegant-gold text-background shadow-md hover:bg-elegant-gold/90' 
                  : 'text-script-text hover:bg-elegant-gold/20 hover:text-script-text'
              }`}
            >
              {page.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Navigation hint */}
      <div className="text-center mt-2">
        <p className="text-xs text-body-text/70">
          Use ← → ou espaço para navegar
        </p>
      </div>
    </div>
  );
};

export default Navigation;