import {
  ArrowRight,
  BarChart3,
  Leaf,
  Map,
  Thermometer,
  TreeDeciduous,
  TrendingDown,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Thermometer className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Verdant</span>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40"
          >
            Try Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
              Fighting Urban Heat Islands with{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Data-Driven Intelligence
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Verdant empowers urban planners with real NASA satellite data and AI-powered
              recommendations to build cooler, greener, more livable cities.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40"
              >
                Explore Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 sm:mt-24">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                <div className="flex h-8 items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 dark:border-gray-800 dark:bg-gray-900">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Map className="mx-auto h-16 w-16 text-emerald-500/50" />
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Interactive Heat Map Dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">10+</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Canadian Cities</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">NASA</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Satellite Data</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">5-10°C</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Heat Reduction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">Real-time</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Climate Analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Everything you need to combat urban heat
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powered by real satellite data and designed for actionable insights
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Map className="h-6 w-6" />}
              title="Interactive Heat Maps"
              description="Visualize urban heat patterns with real NASA POWER satellite temperature data overlaid on city maps."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Climate Analytics"
              description="Track temperature trends, compare urban vs rural temperatures, and measure heat island intensity."
            />
            <FeatureCard
              icon={<TreeDeciduous className="h-6 w-6" />}
              title="Green Infrastructure"
              description="Get AI-powered recommendations for parks, green roofs, tree planting, and cool pavements."
            />
            <FeatureCard
              icon={<TrendingDown className="h-6 w-6" />}
              title="Impact Projections"
              description="Estimate temperature reduction from proposed green infrastructure interventions."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Vulnerability Mapping"
              description="Identify communities most at risk from extreme heat and prioritize interventions."
            />
            <FeatureCard
              icon={<Leaf className="h-6 w-6" />}
              title="Green Coverage"
              description="Monitor vegetation levels and track progress toward urban cooling goals."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build a cooler city?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            Start exploring urban heat patterns and discover green infrastructure opportunities in
            your city today.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-emerald-600 shadow-lg transition-all hover:bg-gray-50"
          >
            Launch Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Thermometer className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Verdant</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Data sourced from NASA POWER and NOAA. Open source climate resilience tools.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-emerald-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
