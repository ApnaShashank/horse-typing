'use client';

import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    product: [
      { label: 'Practice', href: '/practice' },
      { label: 'Learn to type', href: '/learn' },
      { label: 'Rankings', href: '/leaderboard' },
    ],
    account: [
      { label: 'Create account', href: '/register' },
      { label: 'Sign in', href: '/login' },
      { label: 'My stats', href: '/profile' },
    ],
    legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-white/5 bg-[#0c0c0c] pt-16 pb-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-7 h-7 rounded-md overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
                <img
                  src="https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png"
                  alt="Horse Typing"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-black text-on-surface tracking-tight">Horse Typing</span>
            </Link>
            <p className="text-sm text-on-surface-variant/40 leading-relaxed mb-6 max-w-[200px]">
              A free typing trainer that actually tracks your progress.
            </p>
            <div className="flex items-center gap-2">
              {[
                { href: 'https://github.com', icon: <Github className="w-4 h-4" />, label: 'GitHub' },
                { href: 'https://twitter.com', icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                { href: '#', icon: <Mail className="w-4 h-4" />, label: 'Email' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/8 text-on-surface-variant/40 hover:text-on-surface/80 hover:border-white/20 hover:bg-white/4 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/30 mb-5">Product</p>
            <ul className="space-y-3.5">
              {links.product.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-on-surface-variant/50 hover:text-on-surface/80 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/30 mb-5">Account</p>
            <ul className="space-y-3.5">
              {links.account.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-on-surface-variant/50 hover:text-on-surface/80 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/30 mb-5">Legal</p>
            <ul className="space-y-3.5">
              {links.legal.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-on-surface-variant/50 hover:text-on-surface/80 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant/30">
            © {year} Horse Typing. Free to use, always.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/25">
            <span className="w-1.5 h-1.5 rounded-full bg-correct/50 inline-block" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
