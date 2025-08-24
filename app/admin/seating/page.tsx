// app/admin/seating/page.tsx

import SeatingManagement from '@/components/admin/SeatingManagement';
import PlatformHeader from '@/components/PlatformHeader';

export default function SeatingPage() {
  return (
    <div>
      <PlatformHeader />
      <SeatingManagement />
    </div>
  );
}
