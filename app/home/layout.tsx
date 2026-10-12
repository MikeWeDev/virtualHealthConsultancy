import type { Metadata } from "next";
import { CountdownProvider } from '../context/CountdownContext';
import { UserProvider } from '../context/UserContext';
import Navbar from '../../components/Nav';

export const metadata: Metadata = {
  title: "EThealth | Virtual Healthcare",
  description: "Book secure virtual consultations with trusted specialists and manage your care from anywhere.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CountdownProvider>
      <UserProvider>
        <Navbar />
        {children}
      </UserProvider>
    </CountdownProvider>
  );
}
