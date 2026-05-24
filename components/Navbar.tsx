'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Trophy, Activity, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();
  const pathname = usePathname();

  // Initialize theme from localStorage/document class
  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ht_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) setUser((await res.json()).user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setUser(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/practice', label: 'Practice' },
    { href: '/learn', label: 'Learn' },
    { href: '/ai-practice', label: 'AI Practice' },
    { href: '/leaderboard', label: 'Rankings' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full h-14 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/20' : 'bg-background/40 backdrop-blur-md border-b border-white/4'
      }`}>
        <div className="max-w-7xl mx-auto h-full px-5 lg:px-10 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-7 h-7 rounded-md overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
              <img
                src="https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png"
                alt="Horse Typing"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">Horse Typing</span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-on-surface bg-white/6'
                      : 'text-on-surface-variant/50 hover:text-on-surface/80 hover:bg-white/4'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-white/8 hover:border-white/15 bg-white/3 hover:bg-white/6 transition-all text-on-surface-variant/70 hover:text-on-surface cursor-pointer flex items-center justify-center shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {loading ? (
              <div className="w-20 h-8 rounded-lg bg-white/4 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15 bg-white/3 hover:bg-white/6 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-on-surface/80 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant/40 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs font-bold text-on-surface/80 truncate">{user.name}</p>
                        <p className="text-[10px] text-on-surface-variant/40 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5 transition-colors">
                          <Activity className="w-3.5 h-3.5" /> My stats
                        </Link>
                        <Link href="/leaderboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5 transition-colors">
                          <Trophy className="w-3.5 h-3.5" /> Leaderboard
                        </Link>
                        <div className="my-1.5 h-px bg-white/5" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-error/60 hover:text-error hover:bg-error/5 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 hover:border-primary/50 transition-all"
                >
                  Register free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-white/8 hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 bg-background/95 backdrop-blur-xl border-b border-white/8 md:hidden"
          >
            <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? 'bg-white/6 text-on-surface'
                      : 'text-on-surface-variant/60 hover:text-on-surface hover:bg-white/4'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-1.5">
                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface-variant/60 hover:bg-white/4 hover:text-on-surface transition-colors text-left cursor-pointer w-full"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                {user ? (
                  <div className="space-y-2">
                    <p className="px-4 text-xs font-bold text-on-surface-variant/30 uppercase tracking-widest">{user.name}</p>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-on-surface-variant/60 hover:bg-white/4 hover:text-on-surface transition-colors">
                      <Activity className="w-4 h-4" /> My stats
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-error/70 hover:text-error hover:bg-error/5 transition-colors text-left">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-semibold text-on-surface-variant/60 hover:bg-white/4 hover:text-on-surface transition-colors text-center border border-white/8">
                      Sign in
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-primary text-center border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-colors">
                      Register free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
