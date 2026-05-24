'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Trophy, BarChart3, Zap, Target, Users, Clock, CheckCircle, ChevronDown,
  Brain, Sparkles, Keyboard, RefreshCw
} from "lucide-react";

// ─── Live Typing Demo ─────────────────────────────────────────────
const DEMO_WORDS = [
  { text: "the", correct: true },
  { text: "quick", correct: true },
  { text: "brown", correct: true },
  { text: "fox", correct: true },
  { text: "jumps", correct: false },
  { text: "over", correct: true },
  { text: "the", correct: true },
  { text: "lazy", correct: true },
];

function TypingPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(i => {
        const next = (i + 1) % DEMO_WORDS.length;
        setWpm(v => Math.min(142, v + Math.floor(Math.random() * 4)));
        setAcc(98 + Math.floor(Math.random() * 2));
        return next;
      });
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/8 bg-[#0e0e0e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Live · Time 30s</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-correct/60">{wpm} wpm</span>
      </div>

      {/* Words */}
      <div className="px-6 py-6 min-h-[100px] flex flex-wrap gap-2">
        {DEMO_WORDS.map((word, i) => {
          const state = i < activeIndex ? (word.correct ? 'correct' : 'error') : i === activeIndex ? 'active' : 'pending';
          return (
            <span
              key={i}
              className={`text-base font-mono transition-all duration-200 ${
                state === 'correct' ? 'text-correct' :
                state === 'error' ? 'text-error line-through' :
                state === 'active' ? 'text-on-surface border-b-2 border-primary' :
                'text-on-surface-variant/30'
              }`}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 px-5 py-3 border-t border-white/5 bg-white/[0.01]">
        {[
          { label: 'WPM', value: wpm },
          { label: 'ACC', value: `${acc}%` },
          { label: 'TIME', value: '30s' },
        ].map(s => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest">{s.label}</span>
            <span className="text-sm font-black text-on-surface/70 font-mono">{s.value}</span>
          </div>
        ))}
        <div className="ml-auto text-[9px] font-bold text-on-surface-variant/15 uppercase tracking-widest">Tab · Restart</div>
      </div>
    </div>
  );
}

// ─── Counter animation ────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); return; }
      setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Component ───────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleUpgrade = async () => {
    if (loadingUser) return;
    if (!user) {
      router.push('/login?redirect=pricing');
      return;
    }
    if (user.isPro) {
      setToast({ type: 'success', message: 'You are already a Pro member!' });
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Horse Typing Pro",
        description: "Monthly subscription upgrade",
        image: "https://ik.imagekit.io/DEMOPROJECT/3c470dc2-3a50-4f45-9960-deb3429114e8.png",
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            setCheckoutLoading(true);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setToast({ type: 'success', message: 'Success! You are now a Pro member. Enjoy AI features!' });
              setUser((prev: any) => prev ? { ...prev, isPro: true } : null);
            } else {
              setToast({ type: 'error', message: verifyData.error || 'Payment verification failed.' });
            }
          } catch (verifyErr: any) {
            setToast({ type: 'error', message: 'Error verifying payment signature.' });
          } finally {
            setCheckoutLoading(false);
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#9333ea",
        },
        modal: {
          ondismiss: function () {
            setToast({ type: 'error', message: 'Payment cancelled by user.' });
            setCheckoutLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setToast({ type: 'error', message: response.error.description || 'Payment execution failed.' });
        setCheckoutLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Error initiating checkout.' });
      setCheckoutLoading(false);
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Detailed Progression Analytics",
      desc: "Log your WPM, accuracy, and consistency automatically. Track your progress with advanced charts and historical test results.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI Performance Diagnostics",
      desc: "Our AI Typing Coach analyzes your keystroke latency and finger reach to pinpoint weak spots and suggest matching curriculum lessons.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Custom AI Practice Generator",
      desc: "Practice with custom text generated from prompt requests (e.g. resignation email, JS promise chains, SQL table joins). Customize and edit them on the fly.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "56 Step-by-Step Lessons",
      desc: "A structured, complete touch-typing curriculum starting from simple home row keys to advanced numbers, brackets, and code symbols.",
    },
    {
      icon: <Keyboard className="w-5 h-5" />,
      title: "Premium Virtual Keyboards",
      desc: "Train visual guidance with gorgeous, interactive keyboard styles including Standard, Neon, Glassmorphism, Retro, and Cyberpunk.",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Global Verified Standings",
      desc: "Submit your results and match your speed against typists worldwide. The global leaderboard tracks and ranks verified personal bests.",
    },
  ];

  const stats = [
    { value: 42000, suffix: '+', label: 'Typists registered' },
    { value: 1200000, suffix: '+', label: 'Tests completed' },
    { value: 142, suffix: ' WPM', label: 'All-time top score' },
    { value: 99, suffix: '%', label: 'Uptime this year' },
  ];

  const steps = [
    { n: '01', title: 'Pick your mode', desc: 'Choose from timed test, word count, quote mode, or paste your own text. Start in under 5 seconds.' },
    { n: '02', title: 'Start typing', desc: 'The test begins on your first keystroke. Real-time WPM and accuracy update as you go.' },
    { n: '03', title: 'Review and improve', desc: 'See your results, weak keys, and WPM trend. Every test moves you forward.' },
  ];

  const faqs = [
    { q: "Do I need an account to practice?", a: "No. You can start a test immediately without signing up. An account is only needed to save your history and appear on the leaderboard." },
    { q: "How is WPM calculated?", a: "We use the standard definition: one word equals five characters. Your WPM is your net speed after deducting errors from raw speed." },
    { q: "Can I practice with my own text?", a: "Yes. Switch to Custom mode in the practice page and paste anything you want — code, prose, notes, anything." },
    { q: "How does the leaderboard work?", a: "Only your personal best score per mode appears on the global board. You won't flood the ranking with every test you take." },
  ];

  return (
    <div className="text-on-surface overflow-x-hidden">

      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Beautiful Ambient Glow Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Main radial glow */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(147, 51, 234, 0.07) 0%, rgba(79, 70, 229, 0.03) 30%, transparent 70%)'
          }} />
          
          {/* Animated Ambient Blob 1 */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[-10%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/4 blur-[120px] pointer-events-none"
          />

          {/* Animated Ambient Blob 2 */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/4 blur-[130px] pointer-events-none"
          />

          {/* Animated Ambient Blob 3 */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[30%] left-[40%] w-[250px] h-[250px] rounded-full bg-purple-500/3 blur-[100px] pointer-events-none"
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-24"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>


              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.0] mb-6 font-headline"
              >
                Get faster<br />
                <span className="text-primary">at the keyboard.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-on-surface-variant/60 leading-relaxed mb-10 max-w-lg"
              >
                Horse Typing is a clean, no-distraction typing trainer. Take timed tests, track your progress over time, and see where you stand against other typists worldwide.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/practice"
                  className="group flex items-center gap-2.5 px-6 py-3.5 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/60 rounded-lg text-sm font-bold text-primary transition-all duration-200"
                >
                  Start typing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/4 rounded-lg text-sm font-semibold text-on-surface-variant/60 hover:text-on-surface-variant transition-all duration-200"
                >
                  <Trophy className="w-4 h-4" />
                  See rankings
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/5"
              >
                {[
                  { value: '15s / 30s / 60s', label: 'Timed modes' },
                  { value: 'Free', label: 'No account needed' },
                  { value: 'Real-time', label: 'Live WPM tracking' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-sm font-black text-on-surface/80">{s.value}</div>
                    <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Live demo */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-xl mx-auto lg:max-w-none"
            >
              <TypingPreview />
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-correct/50" />
                Live preview — click the practice page to type for real
              </div>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-on-surface-variant/20"
          >
            <span className="text-[9px] uppercase tracking-widest font-bold">Scroll</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Stats Strip ───────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-surface-container-low/40 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface mb-1 font-['Manrope']">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs text-on-surface-variant/40 uppercase tracking-widest font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-xl"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70 mb-4">What you get</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-['Manrope'] mb-5">
            Built to help you improve faster.
          </h2>
          <p className="text-on-surface-variant/50 text-base leading-relaxed">
            Everything you need is here — no paid plans, no feature gating, no email required to start.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3, borderColor: 'rgba(153,153,153,0.25)' }}
              className="group p-7 rounded-xl border border-white/6 bg-surface-container-low/50 hover:bg-surface-container-low transition-all duration-300 cursor-default max-w-md mx-auto sm:max-w-none w-full"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────── */}
      <section className="border-t border-white/5 py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: 'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(150,150,150,0.04) 0%, transparent 60%)'
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70 mb-4">How it works</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight font-['Manrope'] mb-14">
                Three steps.<br />One goal.
              </h2>
              <div className="space-y-10">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <span className="text-5xl font-black text-white/[0.04] group-hover:text-primary/10 transition-colors leading-none mt-1 select-none">{s.n}</span>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface mb-1.5">{s.title}</h4>
                      <p className="text-sm text-on-surface-variant/50 leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3 w-full max-w-xl mx-auto lg:max-w-none"
            >
              {/* Mock result card */}
              <div className="rounded-xl border border-white/8 bg-[#0e0e0e] p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/30 mb-4">Your result — Time 60s</div>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'WPM', val: '94', color: 'text-primary' },
                    { label: 'Accuracy', val: '97%', color: 'text-correct' },
                    { label: 'Raw', val: '101', color: 'text-on-surface/70' },
                  ].map(m => (
                    <div key={m.label}>
                      <div className={`text-3xl font-black ${m.color} font-['Manrope']`}>{m.val}</div>
                      <div className="text-[10px] text-on-surface-variant/30 uppercase tracking-widest mt-1 font-bold">{m.label}</div>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '66%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="h-full bg-primary/70 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/30 mt-2">Faster than 66% of users in this mode</p>
              </div>

              {/* CTA inside */}
              <div className="rounded-xl border border-white/6 bg-surface-container-low p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5 text-center sm:text-left">
                <div className="w-10 h-10 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-on-surface mb-0.5">Save your progress</div>
                  <p className="text-xs text-on-surface-variant/40 leading-relaxed">Create a free account and every test result is saved permanently to your history.</p>
                </div>
                <Link href="/register" className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-primary/10 border border-primary/25 text-primary text-xs font-bold hover:bg-primary/20 transition-colors shrink-0">
                  Sign up free
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Leaderboard Preview ───────────────────────────────── */}
      <section className="border-t border-white/5 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70 mb-4">Global rankings</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight font-['Manrope']">
                Where do you rank?
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 text-sm font-semibold text-primary/70 hover:text-primary transition-colors"
            >
              Full leaderboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-white/8 overflow-hidden bg-surface-container-low/20"
          >
            <div className="overflow-x-auto">
              <div className="min-w-[480px] sm:min-w-0">
                {/* Header row */}
                <div className="grid grid-cols-[32px_1fr_50px_60px] sm:grid-cols-[48px_1fr_80px_80px_100px] gap-2 sm:gap-4 px-4 sm:px-6 py-4 bg-surface-container-low border-b border-white/5 text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-on-surface-variant/30">
                  <span>#</span>
                  <span>Typist</span>
                  <span className="text-center">WPM</span>
                  <span className="text-center">Acc</span>
                  <span className="text-right hidden sm:block">Mode</span>
                </div>

                {[
                  { rank: 1, name: 'WPM_Demon', wpm: 148, acc: 99, mode: '15s', medal: 'text-yellow-500' },
                  { rank: 2, name: 'GhostKey', wpm: 139, acc: 98, mode: '15s', medal: 'text-gray-400' },
                  { rank: 3, name: 'TypeMaster', wpm: 132, acc: 100, mode: '15s', medal: 'text-amber-600' },
                  { rank: 4, name: 'FingerFlow', wpm: 127, acc: 97, mode: '15s', medal: '' },
                  { rank: 5, name: 'SpeedyFinger', wpm: 121, acc: 96, mode: '15s', medal: '' },
                ].map((row, i) => (
                  <motion.div
                    key={row.rank}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-[32px_1fr_50px_60px] sm:grid-cols-[48px_1fr_80px_80px_100px] gap-2 sm:gap-4 px-4 sm:px-6 py-4.5 border-b border-white/4 hover:bg-white/[0.015] transition-colors items-center cursor-default"
                  >
                    <span className={`text-sm font-black ${row.medal || 'text-on-surface-variant/30'}`}>{row.rank}</span>
                    <span className="text-sm font-semibold text-on-surface/80 truncate">{row.name}</span>
                    <span className="text-center text-sm font-black text-primary">{row.wpm}</span>
                    <span className="text-center text-sm font-semibold text-on-surface-variant/60">{row.acc}%</span>
                    <span className="text-right text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-wider hidden sm:block">{row.mode}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="px-6 py-8 text-center bg-surface-container-low/40">
              <p className="text-sm text-on-surface-variant/40 mb-4">Your best score per mode appears here once you start typing.</p>
              <div className="flex justify-center gap-3">
                <Link href="/practice" className="px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/25 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                  Start a test
                </Link>
                <Link href="/register" className="px-5 py-2.5 rounded-lg border border-white/10 text-on-surface-variant/60 text-xs font-bold hover:border-white/20 hover:text-on-surface-variant transition-colors">
                  Create account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <section className="border-t border-white/5 py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70 mb-4">Questions</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight font-['Manrope']">Common questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─────────────────────────────────────── */}
      <section className="border-t border-white/5 py-28 relative overflow-hidden bg-black/10">
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(150,150,150,0.02) 0%, transparent 70%)'
        }} />
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center space-y-4"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/70">Membership Plans</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight font-['Manrope']">Simple, transparent pricing</h2>
            <p className="text-on-surface-variant/50 text-sm max-w-md mx-auto">
              Start practicing for free, or upgrade to Pro to unlock advanced AI coaching and generator tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid-box p-8 bg-surface-container-low/40 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col justify-between max-w-md mx-auto md:max-w-none w-full"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-on-surface-variant/70">Free Plan</h3>
                  <p className="text-xs text-on-surface-variant/40 mt-1">Great for casual typists wanting to practice daily.</p>
                </div>
                <div className="flex items-baseline gap-1 text-on-surface font-headline">
                  <span className="text-5xl font-black">$0</span>
                  <span className="text-xs text-on-surface-variant/40 font-bold uppercase">/ forever</span>
                </div>
                <div className="h-px bg-white/5" />
                <ul className="space-y-3.5 text-xs text-on-surface-variant/60 font-sans">
                  {[
                    "Unlimited Standard Practice runs",
                    "Access to all 56 touch-typing Learn Lessons",
                    "Live stats tracking (WPM, Accuracy, Consistency)",
                    "Basic visual keyboard layout helpers",
                    "Global leaderboard ranking submission",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-correct shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  href="/practice"
                  className="block w-full text-center px-6 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/4 rounded-lg text-xs font-bold text-on-surface transition-all duration-200"
                >
                  Start Typing For Free
                </Link>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid-box p-8 bg-primary/[0.02] border border-primary/20 hover:border-primary/45 rounded-2xl flex flex-col justify-between relative shadow-xl shadow-primary/5 max-w-md mx-auto md:max-w-none w-full"
            >
              <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-background text-[8px] font-black uppercase tracking-wider">
                Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-primary">Pro Coach</h3>
                  <p className="text-xs text-on-surface-variant/40 mt-1">Unlock AI diagnostics, custom prompts, and themes.</p>
                </div>
                <div className="flex items-baseline gap-1 text-primary font-headline">
                  <span className="text-5xl font-black">$5</span>
                  <span className="text-xs text-primary/50 font-bold uppercase">/ month</span>
                </div>
                <div className="h-px bg-white/5" />
                <ul className="space-y-3.5 text-xs text-on-surface-variant/80 font-sans">
                  {[
                    "Everything in Free Plan",
                    "Unlimited AI custom prompt generations",
                    "AI Coach diagnostics (keystroke latency analysis)",
                    "Interactive text editor to customize practice text",
                    "All premium virtual keyboards (Neon, Cyberpunk, Glass, etc.)",
                    "Developer-level coding templates and presets",
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-on-surface/90 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading || (user && user.isPro)}
                  className="block w-full text-center px-6 py-3.5 bg-primary text-background hover:bg-primary/90 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-md shadow-primary/10 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center min-h-[44px]"
                >
                  {checkoutLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" />
                  ) : user && user.isPro ? (
                    "Active Pro Member"
                  ) : (
                    "Upgrade to Pro"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-white/5 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/8 bg-surface-container-low/50 p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 -z-0" style={{
              backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(150,150,150,0.05) 0%, transparent 70%)'
            }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight font-['Manrope'] mb-5">
                Ready to type faster?
              </h2>
              <p className="text-base text-on-surface-variant/50 max-w-md mx-auto mb-10">
                No setup. No install. Open the practice page and start your first test in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/practice"
                  className="group flex items-center gap-2.5 px-8 py-4 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/60 rounded-lg text-sm font-bold text-primary transition-all duration-200"
                >
                  Open practice
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 hover:bg-white/4 rounded-lg text-sm font-semibold text-on-surface-variant/60 hover:text-on-surface-variant transition-all duration-200"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-white/8 flex items-center gap-3 shadow-2xl backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-correct/10 border-correct/30 text-correct'
                : 'bg-error/10 border-error/30 text-error'
            }`}
          >
            <div className="text-xs font-black tracking-wide">{toast.message}</div>
            <button onClick={() => setToast(null)} className="text-[10px] font-black uppercase hover:opacity-75 transition-opacity">Close</button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────
function FAQItem({ q, a, delay }: { q: string; a: string; delay?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="rounded-xl border border-white/6 overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4.5 text-left hover:bg-white/[0.015] transition-colors"
      >
        <span className="text-sm font-semibold text-on-surface/90">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-on-surface-variant/40">
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-5 text-sm text-on-surface-variant/55 leading-relaxed border-t border-white/4 pt-4">
          {a}
        </div>
      </motion.div>
    </motion.div>
  );
}
