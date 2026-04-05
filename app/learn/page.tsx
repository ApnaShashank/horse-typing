'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Layout, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function LearnComingSoon() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background relative overflow-hidden font-mono mt-16">
      {/* Background Grid Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right,#ffffff05 1px,transparent 1px),linear-gradient(to bottom,#ffffff05 1px,transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Status Badge */}
          <div className="grid-box px-4 py-2 bg-primary/5 border-primary/20 mb-12 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Module Pending Authorization</span>
          </div>

          <div className="relative mb-12">
            <div className="grid-box p-6 bg-surface-container-highest relative z-20">
               <BookOpen className="w-12 h-12 text-primary/40" />
            </div>
            {/* Aesthetic Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-50" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-on-surface mb-6 leading-none">
            Engineered for <span className="text-primary">Mastery.</span>
          </h1>
          
          <p className="text-sm font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-12 leading-loose max-w-md mx-auto">
            Our comprehensive curriculum is currently being provisioned. 
            Advanced rhythm training and motor-skill modules are arriving soon.
          </p>

          {/* Progress Simulation UI */}
          <div className="w-full max-w-sm grid-box p-1 bg-white/5 border-white/5 mb-16 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "65%" }}
               transition={{ duration: 2, ease: "easeInOut" }}
               className="h-1.5 bg-primary relative"
             >
                <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-r from-transparent to-white/40" />
             </motion.div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
             <Link href="/practice" className="group flex items-center gap-3 px-8 py-4 grid-box border-primary/40 text-[11px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary/10 transition-all">
                Return to Practice <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
             
             <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant/20 uppercase tracking-[0.2em]">
                <Terminal className="w-3.5 h-3.5" />
                Auth: System_Root
             </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Text Corner */}
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-10">
         <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Horse Typing 2.5.0</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Curriculum_Provisioning_Active</span>
         </div>
      </div>
    </div>
  );
}
