import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold font-display tracking-tight text-brand-primary">
          LaunchKit
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/launch"
            className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:bg-black/80 transition-opacity"
          >
            Start Free
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center relative">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-3xl -z-10" />

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-brand-neutral/50 text-xs font-medium text-text-secondary mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            v1.0 Public Beta is Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.1]">
            From bio to brand <br />
            <span className="text-brand-primary">in 60 seconds</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            LaunchKit transforms a simple one-sentence bio into a complete brand identity with a live website. No design skills required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/launch"
              className="px-8 py-4 text-lg font-medium bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 hover:scale-105 transition-all shadow-lg shadow-brand-primary/25"
            >
              Launch My Brand 🚀
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 text-lg font-medium bg-white border border-gray-200 text-foreground rounded-full hover:bg-gray-50 transition-colors"
            >
              See Example
            </a>
          </div>
        </div>

        {/* Hero Visual / Mockup */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto aspect-[16/9] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 hidden md:flex items-center justify-center">
            <div className="text-center text-gray-500">
                <p>App Demo / Visual Placeholder</p>
                <p className="text-sm">(We will add a real interactive demo here later)</p>
            </div>
            {/* 3 Step Visual (CSS Mock) */}
            <div className="absolute inset-0 flex items-center justify-around px-20 opacity-20 pointer-events-none">
                 <div className="w-64 h-80 bg-gray-800 rounded-lg transform -rotate-6"></div>
                 <div className="w-64 h-80 bg-gray-800 rounded-lg transform translate-y-[-20px] z-10 border border-gray-700"></div>
                 <div className="w-64 h-80 bg-gray-800 rounded-lg transform rotate-6"></div>
            </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="how-it-works" className="py-24 bg-bg-surface">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "1. The Spark", desc: "Enter your name and a one-sentence bio.", icon: "✨" },
                    { title: "2. AI Magic", desc: "Our agent generates 3 unique brand identities.", icon: "🤖" },
                    { title: "3. One-Click Launch", desc: "We register your .cv domain and deploy instantly.", icon: "🚀" }
                ].map((feature, i) => (
                    <div key={i} className="p-8 bg-background rounded-2xl border border-brand-neutral shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
                        <p className="text-text-secondary">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
