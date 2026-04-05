'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isPracticePage = pathname === '/practice';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isPracticePage || isAuthPage) return null;

  return <Footer />;
}
