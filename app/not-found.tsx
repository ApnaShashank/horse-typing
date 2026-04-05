'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronRight, Layout, Terminal, Type } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background relative overflow-hidden font-mono mt-16">
      {/* Background Grid Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right,#ffffff05 1px,transparent 1px),linear-gradient(to bottom,#ffffff05 1px,transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/2 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="flex flex-col items-center"
        >
          {/* Glitch Effect 404 */}
          <div className="relative mb-8 select-none">
             <motion.span 
               initial={{ x: -2 }}
               animate={{ x: 2 }}
               transition={{ repeat: Infinity, duration: 0.1, repeatType: "reverse" }}
               className="text-8xl md:text-9xl font-black text-on-surface opacity-10 absolute inset-0 blur-sm translate-x-1 translate-y-1"
             >
                404
             </motion.span>
             <span className="text-8xl md:text-9xl font-black text-on-surface tracking-tighter block relative z-10 hover:text-primary transition-colors cursor-default">404</span>
             <motion.span 
                initial={{ x: 2 }}
                animate={{ x: -2 }}
                transition={{ repeat: Infinity, duration: 0.1, repeatType: "reverse" }}
                className="text-8xl md:text-9xl font-black text-primary opacity-20 absolute inset-0 blur-sm -translate-x-1 -translate-y-1"
             >
                404
             </motion.span>
          </div>

          <div className="w-12 h-1 bg-primary/40 mb-8" />
          
          <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary/60 mb-6">Route Interrupted</h2>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-on-surface mb-8 leading-tight">Identity lost in the grid.</h3>
          
          <p className="text-[13px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-12 leading-loose max-w-sm mx-auto">
            The requested path does not match our verified session routing. Re-identify or return to base practice module.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
             <Link href="/practice" className="group flex items-center gap-3 px-10 py-5 grid-box border-primary/40 text-[11px] font-black uppercase tracking-[0.4em] text-primary hover:bg-primary/10 transition-all font-mono">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retrace Session
             </Link>
             
             <Link href="/" className="text-[9px] font-bold text-on-surface-variant/20 hover:text-on-surface-variant/40 uppercase tracking-[0.4em] transition-colors flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Platform Overview
             </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Status Display */}
      <div className="absolute top-1/2 left-10 hidden xl:flex flex-col gap-8 opacity-5">
         {[ "0x_ROUTE_FAILED", "IDENTITY_SYNC_LOSS", "TELEMETRY_DROP_OUT" ].map(s => (
            <div key={s} className="flex items-center gap-4">
               <div className="w-2 h-2 bg-primary rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">{s}</span>
            </div>
         ))}
      </div>
    </div>
  );
}
