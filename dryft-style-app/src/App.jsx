import { useState, useEffect, useRef } from 'react';

// Scroll-based Agents Component
const ScrollAgents = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);

  const modules = [
    {
      id: 'plan',
      label: 'Module_01: Plan',
      title: 'Automate Layouts.',
      text: 'Automate transmission and solar layouts to reduce CAPEX. Our agents iterate through thousands of topology scenarios in seconds.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop',
      stats: [
        { label: 'Topology_Optimization', value: 'Active_v4.2' },
        { label: 'CAPEX_Alpha_Target', value: '15.4% Reduction' }
      ]
    },
    {
      id: 'orchestrate',
      label: 'Module_02: Orchestrate',
      title: 'Maximize Density.',
      text: 'Balance data center power in real-time. We eliminate stranded capacity by orchestrating loads against grid volatility.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      stats: [
        { label: 'Real_Time_Balancing', value: 'Synchronized' },
        { label: 'Latency_Response', value: '< 12MS' }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const { top, bottom } = ref.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;

          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveIndex(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Left: Scrolling Text */}
      <div className="space-y-0">
        {modules.map((module, index) => (
          <div
            key={module.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="min-h-[70vh] flex flex-col justify-center py-16"
          >
            <div
              className="flex items-center gap-3 mb-8"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: activeIndex === index ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
              }}
            >
              <span className="w-2.5 h-2.5 bg-white rounded-sm" style={{ opacity: activeIndex === index ? 1 : 0.3 }} />
              {module.label}
            </div>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 transition-opacity duration-500"
              style={{
                fontStyle: 'italic',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: activeIndex === index ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)'
              }}
            >
              {module.title}
            </h2>
            <p
              className="text-xl font-medium leading-snug mb-8 max-w-md uppercase transition-opacity duration-500"
              style={{
                color: activeIndex === index ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'
              }}
            >
              {module.text}
            </p>
            {/* Stats */}
            <div
              className="space-y-4 pt-8 border-t transition-opacity duration-500"
              style={{
                borderColor: activeIndex === index ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                opacity: activeIndex === index ? 1 : 0.3
              }}
            >
              {module.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.label}</span>
                  <span style={{ color: 'rgba(255,255,255,1)', fontWeight: 700 }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Sticky Image */}
      <div className="hidden lg:block sticky top-32 h-[60vh]">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {modules.map((module, index) => (
            <img
              key={module.id}
              src={module.image}
              alt={module.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{
                opacity: activeIndex === index ? 1 : 0
              }}
            />
          ))}
          {/* Module label overlay */}
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg">
            <span
              className="text-white font-medium uppercase"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.15em'
              }}
            >
              {modules[activeIndex].label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Typing animation for terminal
const TypeWriter = ({ text, delay = 0, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 25);
    return () => clearInterval(timer);
  }, [started, text, onComplete]);

  return <span>{displayText}</span>;
};

// Terminal Demo Component
const TerminalDemo = () => {
  const [step, setStep] = useState(0);

  const lines = [
    { type: 'system', text: 'Connecting to ERP...' },
    { type: 'success', text: 'success' },
    { type: 'system', text: 'Reading data...' },
    { type: 'divider' },
    { type: 'ai-label', text: 'Hugo AI' },
    { type: 'ai', text: 'We have 3 late items' },
    { type: 'ai', text: 'Thinking...' },
    { type: 'divider' },
    { type: 'action', text: 'Follow up with suppliers' },
    { type: 'action', text: 'Increase safety stock by 5' },
  ];

  useEffect(() => {
    if (step < lines.length) {
      const delay = lines[step].type === 'divider' ? 300 : 600;
      const timer = setTimeout(() => setStep(s => s + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="bg-[#F5F5F5]/90 backdrop-blur-sm border border-[#264AFF]/20 rounded-lg overflow-hidden text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Terminal Header */}
      <div className="bg-[#EEEEF0] px-4 py-3 border-b border-[#264AFF]/20 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 text-xs text-[#264AFF]/50">hugo-terminal</span>
      </div>

      {/* Terminal Content */}
      <div className="p-6 min-h-[300px] space-y-3">
        {lines.slice(0, step).map((line, i) => {
          if (line.type === 'divider') {
            return <div key={i} className="h-4" />;
          }
          if (line.type === 'system') {
            return (
              <div key={i} className="text-[#264AFF]/50">
                {'>'} {line.text}
              </div>
            );
          }
          if (line.type === 'success') {
            return (
              <div key={i} className="text-[#22C55E] inline-block ml-2">
                {line.text}
              </div>
            );
          }
          if (line.type === 'ai-label') {
            return (
              <div key={i} className="text-[#264AFF]/60 text-xs uppercase tracking-wider mt-4">
                {line.text}
              </div>
            );
          }
          if (line.type === 'ai') {
            return (
              <div key={i} className="text-[#264AFF]">
                {line.text}
              </div>
            );
          }
          if (line.type === 'action') {
            return (
              <div key={i} className="text-[#22C55E] flex items-center gap-2">
                <span>✦</span> {line.text}
              </div>
            );
          }
          return null;
        })}

        {step < lines.length && (
          <span className="inline-block w-2 h-4 bg-[#264AFF] animate-pulse" />
        )}
      </div>
    </div>
  );
};

// ASCII Art Component
const ASCIIArt = () => {
  const art = `
                                           .::---:::.
                                     .:=+*##%%%%%%%##*+=:.
                                 .:+#%%%%%%%%%%%%%%%%%%%##*=:.
                              .=*%%%%%%%%%%%%%%%%%%%%%%%%%%%%#*=.
                           .=*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###*=.
                         :+#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##*:
                       :*#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*:
                     .+#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%+.
                    :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
                   =#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=
                  +%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##*
                 +%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#+
                =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=
               :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
               *%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*
              :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
              =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#=
              *%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*
             .#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#.
             .%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%.
             .%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%.
             .%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%.
              *%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*
              =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#=
              :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
               *%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*
               :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
                =%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=
                 +%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#+
                  +%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##*
                   =#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%=
                    :#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%#:
                     .+#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%+.
                       :*#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*:
                         :+#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%##*:
                           .=*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%###*=.
                              .=*%%%%%%%%%%%%%%%%%%%%%%%%%%%%#*=.
                                 .:+#%%%%%%%%%%%%%%%%%%%##*=:.
                                     .:=+*##%%%%%%%##*+=:.
                                           .::---:::.
  `;

  return (
    <div className="py-16 overflow-hidden">
      <pre className="text-[6px] sm:text-[8px] md:text-[10px] text-[#264AFF]/20 text-center leading-none select-none whitespace-pre" style={{ fontFamily: "'Fragment Mono', monospace" }}>
        {art}
      </pre>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: '#FDFCFC',
        color: '#264AFF',
        backgroundImage: 'url(https://framerusercontent.com/images/qBN8aOrvBxJY1psOPRzjUkKOQc.png)',
        backgroundSize: '500px',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          backgroundColor: 'transparent',
          backgroundImage: 'url(https://framerusercontent.com/images/qBN8aOrvBxJY1psOPRzjUkKOQc.png)',
          backgroundSize: '500px',
          backgroundRepeat: 'repeat'
        }}
      >
        <div className="max-w-[1800px] mx-auto px-10 h-16 flex justify-between items-center">
          {/* Logo placeholder */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#000'
            }}
          >
            LOGO
          </div>

          {/* Nav links - moved to right */}
          <div className="flex items-center gap-12">
            <div className="hidden md:flex items-center gap-8">
              <a href="#manifesto" className="hover:opacity-60 transition-opacity" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000' }}>Manifesto</a>
              <a href="#team" className="hover:opacity-60 transition-opacity" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000' }}>Team</a>
              <a href="#blog" className="hover:opacity-60 transition-opacity" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000' }}>Blog</a>
              <a href="#careers" className="hover:opacity-60 transition-opacity" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000' }}>Careers</a>
            </div>
            <button
              className="px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition-all"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <h1 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: '1.5rem'
            }}>
              Reliability for the <b><i>Grid</i></b>. <br />
              Power for <b><i>Data Centers</i></b>.
            </h1>
            <p className="text-lg text-[#264AFF]/70 mb-8 max-w-lg leading-relaxed">
              We provide the agentic intelligence to plan energy infrastructure and orchestrate the power demands of data center. Decision science for the new energy era
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-[#264AFF] text-white font-medium rounded-lg hover:bg-[#1a3ad4] transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Video
              </button>
              <button className="px-6 py-3 border border-[#264AFF]/30 text-[#264AFF] font-medium rounded-lg hover:bg-[#264AFF]/10 transition-colors">
                Request Demo
              </button>
            </div>
          </div>

          {/* Right: Terminal Demo with Background */}
          <div className="relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.3)'
              }}
            />
            {/* Terminal on top */}
            <div className="relative z-10">
              <TerminalDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section id="manifesto" className="py-32 px-6 lg:px-12 border-t border-[#264AFF]/20">
        <div className="max-w-4xl mx-auto">
          <span
            className="mb-8 flex items-center gap-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#264AFF'
            }}
          >
            <span className="w-12 h-[1px] bg-[#264AFF]"></span>
            Manifesto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-8">
            The grid is evolving. So must the tools that build it.
          </h2>
          <div className="space-y-6 text-lg text-[#264AFF]/80 leading-relaxed">
            <p>
              For decades, infrastructure planning has relied on manual processes, static models, and siloed expertise. Engineers spend months on feasibility studies. Utilities struggle to keep pace with renewable integration. Data centers face power constraints that limit growth.
            </p>
            <p>
              We believe there's a better way. By combining agentic AI with deep domain expertise, we can compress planning cycles from months to days, optimize layouts that humans would never discover, and orchestrate power flows in real-time.
            </p>
            <p>
              This isn't about replacing engineers—it's about amplifying them. Giving them tools that handle the combinatorial complexity so they can focus on what matters: building reliable, sustainable infrastructure for the next century.
            </p>
          </div>
        </div>
      </section>

      {/* Agents Section - Scroll-based Modules */}
      <section
        id="agents"
        className="px-6 lg:px-12"
        style={{
          backgroundColor: 'rgba(38, 74, 255, 0.95)',
          color: '#FFFFFF'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <ScrollAgents />
        </div>
      </section>

      {/* Solutions Section with ASCII Background */}
      <section id="solutions" className="relative py-32 px-6 lg:px-24">
        {/* ASCII Art Background */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <ASCIIArt />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <span
            className="mb-16 flex items-center gap-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#264AFF'
            }}
          >
            <span className="w-12 h-[1px] bg-[#264AFF]"></span>
            Solutions
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start max-w-6xl mx-auto">
            <div>
              <h2
                className="mb-12"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#264AFF'
                }}
              >
                01 // The Engine
              </h2>
              <h3
                className="text-5xl md:text-7xl font-black mb-8"
                style={{ letterSpacing: '-0.02em', color: '#264AFF' }}
              >
                Math over <br />Marketing.
              </h3>
            </div>
            <div className="space-y-16">
              <div>
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(38, 74, 255, 0.4)'
                  }}
                >
                  L-SITE // PV & SUBSTATION
                </h4>
                <p className="text-2xl font-bold" style={{ color: '#264AFF' }}>
                  Autonomous siting that respects terrain physics. Not just a layout—a calculated yield maximum.
                </p>
              </div>
              <div>
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(38, 74, 255, 0.4)'
                  }}
                >
                  T-ROUTE // TRANSMISSION
                </h4>
                <p className="text-2xl font-bold" style={{ color: '#264AFF' }}>
                  Generative pathing across multi-layer resistance grids. Reducing T&D losses by computing every possible path in milliseconds.
                </p>
              </div>
              <div>
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(38, 74, 255, 0.4)'
                  }}
                >
                  TWIN-SYNC // ORCHESTRATION
                </h4>
                <p className="text-2xl font-bold" style={{ color: '#264AFF' }}>
                  The brain for the Data Center. Physics-based simulation that handles millisecond-level load fluctuations with stochastic integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Section */}
      <section id="careers" className="py-24 px-6 lg:px-12 border-t border-[#264AFF]/20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-medium text-[#264AFF]/60 tracking-widest uppercase">Join the Team</span>
          <h2 className="text-4xl lg:text-5xl font-semibold mt-4 mb-6">We're Hiring</h2>
          <p className="text-lg text-[#264AFF]/70 mb-8 max-w-xl mx-auto leading-relaxed">
            We're looking for people with a sense of urgency and outstanding taste for great products. Our team has built everything from robots and PCBs to software with millions of downloads.
          </p>
          <a
            href="#careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#264AFF] text-white font-medium rounded-lg hover:bg-[#1a3ad4] transition-colors"
          >
            View Careers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 border-t border-[#264AFF]/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl text-[#264AFF]/50 mb-2">Your ERP doesn't think,</p>
          <h2 className="text-5xl lg:text-6xl font-semibold tracking-tight">
            Dryft does.
          </h2>
          <a
            href="mailto:hello@dryft.ai"
            className="inline-block mt-10 px-8 py-4 border border-[#264AFF] text-[#264AFF] font-medium rounded-lg hover:bg-[#264AFF] hover:text-white transition-all"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-12 border-t border-[#264AFF]/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Logo */}
          <div>
            <span className="text-xl font-semibold tracking-tight">dryft</span>
          </div>

          {/* Find Us */}
          <div>
            <h4 className="text-xs font-medium text-[#888] tracking-widest uppercase mb-6">Find Us</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">LinkedIn</a>
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">X</a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="text-xs font-medium text-[#888] tracking-widest uppercase mb-6">Navigate</h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">Manifesto</a>
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">Team</a>
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">Blog</a>
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">Careers</a>
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">Imprint</a>
              <a href="#" className="block text-sm text-[#264AFF]/60 hover:text-[#264AFF] transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#264AFF]/20 text-center">
          <p className="text-sm text-[#264AFF]/50">
            Made with ♥ in San Francisco
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
