import { AudioProvider } from '@/hooks/use-audio';
import AudioControl from '@/components/AudioControl';

export default function GuestInvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AudioProvider>
      <AudioControl />
      {/* Layout UI */}
      {/* Place children where you want to render a page or nested layout */}
      <main>{children}</main>
    </AudioProvider>
  );
}
