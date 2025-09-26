import { useState } from 'react';
import EntrancePage from '@/components/EntrancePage';
import WelcomePage from '@/components/WelcomePage';
import TimelinePage from '@/components/TimelinePage';
import ManualPage from '@/components/ManualPage';
import LastPage from '@/components/LastPage';

const Index = () => {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
  };

  if (!hasEntered) {
    return <EntrancePage onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <WelcomePage />
      <TimelinePage />
      <ManualPage />
      <LastPage />
    </div>
  );
};

export default Index;
