'use client';

import { Type, Twitter, Mail, ExternalLink, Shield, Lock, Globe, ChevronRight, X as XIcon } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Practice Engine', href: '/practice' },
      { name: 'Global Rankings', href: '/leaderboard' },
      { name: 'Learning Lab', href: '/learn' },
      { name: 'Word Pools', href: '/practice?mode=words' },
    ],
    community: [
      { name: 'GitHub Architecture', href: 'https://github.com' },
      { name: 'Twitter / X', href: 'https://twitter.com' },
      { name: 'Developer API', href: '#' },
      { name: 'Status', href: '#' },
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Protocol', href: '#' },
      { name: 'Security Baseline', href: '#' },
    ]
  };

  return (
    <footer className="w-full bg-background pt-32 pb-16 px-6 lg:px-8 border-t border-white/5 font-mono overflow-hidden relative">
      {/* Decorative Grid Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-[1250px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Identity Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="grid-box p-1.5 bg-primary/5 group-hover:bg-primary/10 transition-all border-primary/20">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-black text-on-surface uppercase tracking-[0.4em]">Horse Typing</span>
            </Link>
            <p className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] leading-loose max-w-xs">
              Surgical precision in every keystroke. 
              Built with Next.js, Prisma, and Supabase 
              for the modern editorial elite.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="grid-box p-2.5 hover:bg-primary/5 hover:border-primary/40 transition-all group">
                <ExternalLink className="w-4.5 h-4.5 text-on-surface-variant/40 group-hover:text-primary" />
              </Link>
              <Link href="#" className="grid-box p-2.5 hover:bg-primary/5 hover:border-primary/40 transition-all group">
                <XIcon className="w-4.5 h-4.5 text-on-surface-variant/40 group-hover:text-primary" />
              </Link>
              <Link href="#" className="grid-box p-2.5 hover:bg-primary/5 hover:border-primary/40 transition-all group">
                <Mail className="w-4.5 h-4.5 text-on-surface-variant/40 group-hover:text-primary" />
              </Link>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div>
            <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
              <div className="w-2 h-2 bg-primary/40 grid-box" /> Product Matrix
            </h4>
            <ul className="space-y-5">
              {footerLinks.product.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" /> {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network Column */}
          <div>
            <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
              <div className="w-2 h-2 bg-primary/40 grid-box" /> Connectivity
            </h4>
            <ul className="space-y-5">
              {footerLinks.community.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 group">
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" /> {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security/Protocol Column */}
          <div>
            <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
              <div className="w-2 h-2 bg-primary/40 grid-box" /> Protocol
            </h4>
            <ul className="space-y-5">
              {footerLinks.legal.map(l => (
                <li key={l.name}>
                  <Link href={l.href} className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 group">
                    <Shield className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" /> {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Binary Bottom Bar */}
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8 text-[11px] font-bold text-on-surface-variant/20 uppercase tracking-[0.4em]">
             <span>SYSTEM: STABLE</span>
             <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
             <span>LATENCY: 12ms</span>
             <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
             <span>POOL: {currentYear}.V2</span>
          </div>
          <p className="text-[11px] font-bold text-on-surface-variant/30 uppercase tracking-[0.3em]">
            © {currentYear} Horse Typing Systems. All rights authorized.
          </p>
        </div>
      </div>
    </footer>
  );
}
