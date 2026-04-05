'use client';

import { useState, useEffect } from 'react';
import { Type, User as UserIcon, LogOut, ChevronDown, Trophy, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    setIsMenuOpen(false); 
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/practice', label: 'Practice' },
    { href: '/leaderboard', label: 'Rankings' },
    { href: '/learn', label: 'Learn' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-60 border-b border-white/5 bg-background/50 backdrop-blur-md px-6 lg:px-8 font-mono">
      <div className="max-w-[1250px] mx-auto h-full flex items-center justify-between relative">
        
        {/* Left: Branding */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-4 group transition-all">
            <div className="grid-box p-1.5 bg-primary/5 group-hover:bg-primary/20 group-active:scale-95 transition-all">
              <Type className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-black text-on-surface uppercase tracking-[0.35em] leading-none">Horse Typing</span>
            </div>
          </Link>
        </div>

        {/* Center: Simplified Nav Links (Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${pathname === link.href ? 'text-primary' : 'text-on-surface-variant/40'}`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1.5 left-0 w-full h-px bg-primary" />
              )}
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right: Auth/User */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-40 h-10 grid-box animate-pulse opacity-50"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-4 pl-5 pr-4 py-2 grid-box transition-all group ${isMenuOpen ? 'border-primary/40 bg-white/5' : 'hover:border-white/20'}`}
              >
                <div className="flex flex-col items-end">
                   <span className="text-xs font-black text-on-surface uppercase tracking-widest">{user.name}</span>
                   <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Authenticated</span>
                </div>
                <div className="w-8 h-8 grid-box bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <UserIcon className="w-4 h-4" />
                </div>
                <ChevronDown className={`w-4 h-4 text-on-surface-variant/20 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 grid-box bg-surface-container-low border border-white/10 p-2.5 z-70 animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl">
                  <div className="px-5 py-4 border-b border-white/5 mb-2.5">
                    <p className="text-[10px] uppercase font-bold text-primary/40 tracking-[0.25em] mb-2">User Identity</p>
                    <p className="text-xs font-black text-on-surface/80 truncate font-mono uppercase tracking-tight">{user.email}</p>
                  </div>
                  
                  <Link href="/profile" className="flex items-center gap-4 px-5 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all">
                    <Activity className="w-4.5 h-4.5" />
                    Statistics
                  </Link>
                  <Link href="/leaderboard" className="flex items-center gap-4 px-5 py-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all">
                    <Trophy className="w-4.5 h-4.5" />
                    Global Rank
                  </Link>
                  
                  <div className="mt-2.5 pt-2.5 border-t border-white/5">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-5 py-3 text-xs font-bold uppercase tracking-widest text-error/60 hover:text-error hover:bg-error/5 transition-all"
                    >
                      <LogOut className="w-4.5 h-4.5" />
                      De-Authorize
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="px-8 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-all">Sign In</Link>
              <Link href="/register" className="grid-box px-10 py-2.5 text-xs font-black uppercase tracking-[0.3em] bg-primary/10 text-primary border border-primary/40 hover:bg-primary/20 transition-all active:scale-95 shadow-lg shadow-black/20">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
