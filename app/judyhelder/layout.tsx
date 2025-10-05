// app/[wedding]/convidados/[guestId]/layout.tsx

export default async function JHLayout({
  children,
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  return <div>{children}</div>;
}
