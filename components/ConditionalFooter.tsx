'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isPracticePage = pathname === '/practice';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isLearnPage = pathname === '/learn' || pathname.startsWith('/learn/');
  const isAIPracticePage = pathname === '/ai-practice';

  if (isPracticePage || isAuthPage || isLearnPage || isAIPracticePage) return null;

  return <Footer />;
}
