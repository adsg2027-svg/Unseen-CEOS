import { Link } from 'react-router-dom';
import { ArrowRight, Upload, BarChart3, FileText, Handshake, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import img1 from '../assets/img_1.jpg';
import img2 from '../assets/img_2.jpg';

const steps = [
  { icon: Upload,    title: 'Data Collection',   desc: 'Field researchers upload structured interview data from women entrepreneurs' },
  { icon: BarChart3, title: 'Agency Scoring',    desc: '5-parameter scorecard identifies who genuinely leads the business' },
  { icon: FileText,  title: 'Business Plans',    desc: 'AI-assisted templates generate investor-ready plans and projections' },
  { icon: Handshake, title: 'Investor Matching', desc: 'Shortlisted ventures are matched with aligned funders and lenders' },
];

const problems = [
  { num: '01', title: 'Economic Inequality', desc: "Millions of microbusinesses are registered in women's names but most are not actually woman-led. Real decision-making power remains absent." },
  { num: '02', title: 'Market Inefficiency', desc: 'Lenders and investors lack data to distinguish genuine women-led ventures from name-only ownership, leading to misallocated capital.' },
  { num: '03', title: 'Hidden Gender Gaps',  desc: 'Hidden patriarchal control inside "women-owned" businesses means empowerment programs fail to shift real agency to women.' },
];

function HeroImage({ src, alt, caption, side }) {
  const slideClass = side === 'left' ? 'anim-slide-in-left delay-200' : 'anim-slide-in-right delay-200';
  const floatClass = side === 'left' ? 'anim-float-left'              : 'anim-float-right';
  const rotDeg     = side === 'left' ? '-3deg'                         : '3deg';

  return (
    <div className={`hidden lg:flex items-center justify-center ${slideClass}`}>
      {/* Gradient glow ring */}
      <div
        className="anim-glow rounded-2xl p-[3px]"
        style={{ background: 'linear-gradient(135deg,#E97451,#FBBF24,#E97451)' }}
      >
        {/* Floating photo card */}
        <div
          className={`relative w-64 xl:w-72 rounded-2xl overflow-hidden shadow-2xl bg-white ${floatClass}`}
          style={{ transform: `rotate(${rotDeg})` }}
        >
          <div className="h-80 xl:h-96 w-full overflow-hidden">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-10 pb-3 px-3">
            <p className="text-white text-[11px] font-medium leading-snug">{caption}</p>
          </div>

          {/* "Real Story" badge */}
          <div className="absolute top-2.5 left-2.5 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
            Real Story
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { user, userType, userProfile } = useAuth();
  const appHome = userType === 'venture' ? '/funders' : '/dashboard';

  return (
    <div className="min-h-screen">

      {/* ── Landing Navbar ──────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">UC</span>
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">
            The Unseen <span className="text-amber-400">CEOs</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-white/70 text-sm">
                {userProfile?.displayName ?? user.email}
              </span>
              <Link
                to={appHome}
                className="bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                Open App →
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-800 via-primary-700 to-amber-600 text-white overflow-hidden">

        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-1/4   w-80 h-80 bg-amber-300 rounded-full blur-[140px] opacity-25" />
          <div className="absolute bottom-16 right-1/4 w-96 h-96 bg-white     rounded-full blur-[140px] opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[180px] opacity-20" />
        </div>

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* 3-column: left image | center text | right image */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24
                        grid grid-cols-1 lg:grid-cols-[1fr_2.2fr_1fr] gap-8 xl:gap-12 items-center">

          {/* Left photo */}
          <HeroImage
            src={img1}
            alt="Woman entrepreneur at sewing machine"
            caption="Tailoring entrepreneur, Rajasthan — sets her own prices"
            side="left"
          />

          {/* ── Center content ── */}
          <div className="flex flex-col items-center text-center gap-5">

            {/* Pill badge */}
            <div className="anim-badge-pop delay-100 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 shadow-lg">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/85 font-medium">Empowering genuine women-led growth</span>
            </div>

            {/* Headline */}
            <div className="anim-fade-in-up delay-200">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                The Unseen
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(90deg,#FB923C,#E97451,#FBBF24)' }}
                >
                  CEOs
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="anim-fade-in-up delay-400 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              Identifying, supporting, and funding women who{' '}
              <em className="text-amber-300 not-italic font-semibold">actually</em>{' '}
              run their businesses in India's informal economy
            </p>

            {/* Key insight card */}
            <div className="anim-fade-in-up delay-600 w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-amber-400" />
                <p className="text-[11px] text-white/50 uppercase tracking-widest font-semibold">Key Insight</p>
              </div>
              <p className="text-sm font-medium text-white/80 leading-snug">
                Only{' '}
                <span className="text-4xl font-black text-primary-400 leading-none">9%</span>
                {' '}of Indian women entrepreneurs have real financial decision-making power
              </p>
              <p className="text-[11px] text-white/30 mt-2">IFMR / SEWA, 2022</p>
            </div>

            {/* CTA buttons */}
            <div className="anim-fade-in-up delay-800 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Link
                to={user ? appHome : '/signup'}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-primary-500/40 hover:shadow-2xl hover:-translate-y-0.5"
              >
                {user ? 'Go to App' : 'Get Started'}
                <ArrowRight size={18} />
              </Link>
              {!user && (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200"
              >
                Sign In
              </Link>
              )}
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 hover:bg-white/10 text-white/80 hover:text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200"
              >
                How It Works
                <ChevronDown size={18} />
              </a>
            </div>

            {/* Mobile-only stacked images */}
            <div className="anim-fade-in delay-1000 flex gap-3 lg:hidden mt-2 w-full">
              {[img1, img2].map((src, i) => (
                <div key={i} className="flex-1 rounded-xl overflow-hidden h-36 border-2 border-white/20 shadow-lg">
                  <img src={src} alt="" className="w-full h-full object-cover object-center" />
                </div>
              ))}
            </div>
          </div>

          {/* Right photo */}
          <HeroImage
            src={img2}
            alt="Women artisans working together in workshop"
            caption="Textile collective, Gujarat — women leading every step"
            side="right"
          />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={22} className="text-white/40" />
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-white/20 text-center text-white">
            {[
              { value: '12+',  label: 'Entrepreneurs Profiled' },
              { value: '5',    label: 'Agency Score Parameters' },
              { value: '~₹1L', label: 'Optimal Funding Amount' },
            ].map((s, i) => (
              <div key={i} className="px-4">
                <p className="text-3xl md:text-4xl font-black">{s.value}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Statement ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">Why This Matters</h2>
            <p className="text-warm-500 max-w-2xl mx-auto">
              Across India's informal economy, millions of microbusinesses are legally registered in women's names —
              but most are not actually woman-led.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div
                key={i}
                className="relative bg-warm-50 border border-warm-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <span className="absolute -top-3 -right-1 text-8xl font-black text-warm-100 select-none group-hover:text-primary-50 transition-colors duration-300">
                  {p.num}
                </span>
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors duration-300">
                    <span className="text-primary-600 font-bold group-hover:text-white transition-colors duration-300">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-warm-900 mb-2">{p.title}</h3>
                  <p className="text-warm-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-warm-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">How It Works</h2>
            <p className="text-warm-500 max-w-xl mx-auto">
              A simple, 4-step process to identify genuine women leaders and connect them with the right support.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashed connector line (desktop only) */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-primary-200 z-0" />

            {steps.map((step, i) => (
              <div
                key={i}
                className="relative z-10 bg-white rounded-2xl border border-warm-200 p-6 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300 shadow-sm">
                    <step.icon size={24} className="text-primary-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Step {i + 1}</span>
                  <h3 className="text-base font-semibold text-warm-900">{step.title}</h3>
                  <p className="text-warm-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-bleed image strip ─────────────────────────────────── */}
      <section className="relative h-52 md:h-72 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="overflow-hidden">
            <img
              src={img1}
              alt="Woman entrepreneur at sewing machine"
              className="w-full h-full object-cover object-center scale-110 hover:scale-100 transition-transform duration-1000"
            />
          </div>
          <div className="overflow-hidden">
            <img
              src={img2}
              alt="Women artisans in workshop"
              className="w-full h-full object-cover object-top scale-110 hover:scale-100 transition-transform duration-1000"
            />
          </div>
        </div>

        {/* Dark overlay with quote */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-900/85 via-warm-900/60 to-warm-900/85 flex items-center justify-center px-6">
          <p className="text-white text-xl md:text-3xl font-bold text-center leading-snug">
            Every woman here{' '}
            <span className="text-primary-400">built something real.</span>
            <br />
            <span className="text-white/55 text-base md:text-xl font-normal">We just help the world see it.</span>
          </p>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-50 rounded-full opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-50 rounded-full opacity-80 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-primary-500" />
            <span className="text-sm text-primary-600 font-medium">Ready to explore?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">Meet the Unseen CEOs</h2>
          <p className="text-warm-500 mb-8 leading-relaxed">
            Explore entrepreneur profiles, agency scores, AI-assisted business plans, and an investor matching view — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={user ? appHome : '/signup'}
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {user ? 'Go to App' : 'Get Started'}
              <ArrowRight size={18} />
            </Link>
            {!user && (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-warm-300 hover:border-primary-300 text-warm-700 hover:text-primary-600 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200"
            >
              Sign In
            </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-8 bg-warm-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">UC</span>
            </div>
            <span className="text-sm font-medium text-warm-200">The Unseen CEOs</span>
          </div>
          <p className="text-xs text-warm-500">A student-built platform for real women-led growth in India's informal economy</p>
        </div>
      </footer>
    </div>
  );
}
