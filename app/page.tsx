import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#ecefe8] overflow-x-clip">
      {/* Background Map Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-666px] right-[-664px] top-[54px] flex items-center justify-center h-[3089px]">
          <div className="flex-none w-[3079px] h-[1993px] -rotate-90">
            <div className="relative w-full h-full bg-[#f5f5f5] overflow-clip">
              <div className="absolute top-[120px] left-0 w-full h-[1854px] relative">
                <Image
                  src="/images/landing/parks.png"
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full relative">
                <Image
                  src="/images/landing/water.png"
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full relative">
                <Image
                  src="/images/landing/secondary-roads.png"
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute top-0 left-0 w-full h-full relative">
                <Image
                  src="/images/landing/main-roads.png"
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-[54px] bg-[#1f2b26] z-10">
        <div className="relative h-full flex items-center justify-between px-5">
          <p className="font-alliance text-[24px] text-[#ecefe8] tracking-[-0.96px]">
            verdant
          </p>
          <p className="font-alliance text-[24px] text-white tracking-[-3.6px]">
            © 2026
          </p>
        </div>
      </header>

      {/* Logo */}
      <div className="absolute left-[34px] top-[90px] w-[153px] h-[153px] z-20">
        <img
          src="/images/landing/logo-vector.svg"
          alt="Verdant Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-[295px] pb-[300px]">
        {/* Decorative Green Blobs */}
        <div className="absolute right-[-13px] top-[167px] w-[603px] h-[603px] z-0">
          <img
            src="/images/landing/dark-green-1.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute right-[54px] top-[245px] w-[469px] h-[471px] z-0">
          <img
            src="/images/landing/dark-green-5.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute right-[65.71px] top-[262.46px] w-[432.829px] h-[432.829px] flex items-center justify-center z-0">
          <div className="rotate-[-15.69deg]">
            <img
              src="/images/landing/dark-green-6.svg"
              alt=""
              className="w-[351px] h-[351px] object-contain"
            />
          </div>
        </div>
        <div className="absolute right-[121.95px] top-[315px] w-[320.053px] h-[325.011px] flex items-center justify-center z-0">
          <div className="rotate-[24.77deg]">
            <img
              src="/images/landing/dark-green-7.svg"
              alt=""
              className="w-[237.989px] h-[248.127px] object-contain"
            />
          </div>
        </div>
        <div className="absolute right-[164.75px] top-[360.83px] w-[229.754px] h-[230.42px] flex items-center justify-center z-0">
          <div className="rotate-[-138.97deg]">
            <img
              src="/images/landing/dark-green-9.svg"
              alt=""
              className="w-[159.687px] h-[166.489px] object-contain"
            />
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 px-[57px]">
          <h1 className="font-alliance text-[128px] leading-[1.2] text-[#1f2b26] tracking-[-5.12px] w-[1136px]">
            <p className="mb-0">the new</p>
            <p className="mb-0 text-[#010103]">blueprint</p>
            <p className="mb-0">for a climate</p>
            <p>resilient city.</p>
          </h1>

          {/* Get Started CTA */}
          <div className="mt-[86px] relative">
            <div className="absolute left-[16px] w-[489px] h-[86px] bg-[#c0ffbd]" />
            <Link
              href="/dashboard"
              className="relative z-10 font-alliance text-[128px] leading-[1.2] text-[#1f2b26] tracking-[-5.12px] inline-block hover:opacity-80 transition-opacity"
            >
              get started. →
            </Link>
          </div>
        </div>
      </section>

      {/* Definition Section */}
      <section className="relative pb-[200px]">
        {/* Decorative Blob */}
        <div className="absolute left-[64px] top-[1280px] w-[437px] h-[437px] z-0">
          <img
            src="/images/landing/dark-green-10.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute left-[113.67px] top-[1335.88px] w-[338.987px] h-[324.087px] z-0">
          <img
            src="/images/landing/dark-green-11.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute left-[145.95px] top-[1365.68px] w-[264.632px] h-[264.632px] flex items-center justify-center z-0">
          <div className="rotate-[4.31deg]">
            <img
              src="/images/landing/dark-green-12.svg"
              alt=""
              className="w-[246.795px] h-[246.795px] object-contain"
            />
          </div>
        </div>

        {/* Definition Content */}
        <div className="relative z-10 px-[57px]">
          <div className="flex items-start gap-4 mb-4">
            <p className="font-alliance text-[128px] leading-[1.2] text-[#1f2b26] tracking-[-5.12px]">
              verdant
            </p>
            <span className="font-helvetica text-[24px] text-[#1f2b26] tracking-[-0.96px] mt-[85px]">
              (1)
            </span>
          </div>
          <p className="font-alliance text-[36px] leading-[0] text-[#1f2b26] tracking-[-1.44px] mb-8">
            <span className="leading-normal">/ˈvərd</span>
            <span className="font-helvetica leading-normal">(ə)</span>
            <span className="leading-normal">{`nt/ `}</span>
            <span className="leading-normal">{`   · `}</span>
            <span className="leading-normal">{`  `}</span>
            <span className="leading-normal">{` `}</span>
            <span className="leading-normal">adjective</span>
          </p>
          <div className="max-w-[606px] ml-auto text-right">
            <p className="font-alliance text-[24px] leading-[1.755] text-black tracking-[-0.96px]">
              The strategic integration of lush, living vegetation into urban landscapes to create
              biological cooling systems. In climate resilience, being &quot;verdant&quot; is the
              measurable transition from heat-absorbing grey infrastructure (asphalt and concrete)
              to heat-mitigating green infrastructure (canopy cover and carbon-sequestering
              parklands).
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative pb-[200px]">
        <div className="px-[57px]">
          <div className="flex items-start gap-4 mb-8">
            <p className="font-alliance text-[128px] leading-[1.2] text-[#1f2b26] tracking-[-5.12px]">
              gallery
            </p>
            <span className="font-helvetica text-[24px] text-[#1f2b26] tracking-[-0.96px] mt-[85px]">
              (2)
            </span>
          </div>
        </div>

        {/* Dashboard Image */}
        <div className="relative w-[1141px] h-[412px] rounded-[25px] overflow-hidden mb-4 mx-auto">
          <Image
            src="/images/landing/image1.png"
            alt="Verdant Dashboard - Vancouver"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Caption */}
        <div className="px-[57px] max-w-[1101px]">
          <p className="font-alliance text-[24px] leading-[1.755] text-black tracking-[-0.96px] mb-2">
            verdant DASHBOARD / VANCOUVER →
          </p>
          <p className="font-alliance text-[24px] leading-[1.755] text-black tracking-[-0.96px]">
            A visual showcase of urban heatmaps in the Greater Vancouver area.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pb-[200px]">
        <div className="relative px-[80px]">
          <div className="absolute right-[0px] w-[708px] h-[52px] bg-[#c0ffbd]" />
          <div className="flex items-start gap-4 relative z-10">
            <span className="font-helvetica text-[24px] text-[#1f2b26] tracking-[-0.96px] mt-[85px]">
              (3)
            </span>
            <p className="font-alliance text-[64px] leading-[0.97] text-black text-right tracking-[-2.56px] max-w-[749px] ml-auto">
              Start your journey toward a more verdant city today. ↗
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#1f2b26] h-[179px] px-[25px] py-[15px]">
        <div className="relative h-full">
          {/* Logo and Brand */}
          <div className="absolute bottom-[37px] left-[25px] flex items-center gap-[11px]">
            <img
              src="/images/landing/light-green-logo.svg"
              alt="Verdant Logo"
              className="w-[105px] h-[105px] object-contain"
            />
            <p className="font-alliance text-[128px] leading-[1.2] text-[#91b1a2] tracking-[-5.12px]">
              verdant
            </p>
            <p className="font-alliance text-[32px] leading-normal text-[#91b1a2] opacity-33 tracking-[-4.8px] ml-4">
              © 2026
            </p>
          </div>

          {/* Right Side Content */}
          <div className="absolute right-[15px] top-[23px] text-right">
            <p className="font-alliance text-[15px] leading-normal text-[#cfcfcf] mb-8">
              Github Repository
            </p>
            <div className="font-alliance text-[15px] leading-normal text-[#545454] mb-2">
              <p className="mb-0">Owen Skippen</p>
              <p className="mb-0">Martin Cam</p>
              <p className="mb-0">Krrish Kapoor</p>
              <p>Johnny Ho</p>
            </div>
            <p className="font-alliance text-[15px] leading-normal text-[#545454] mt-4">
              Powered by Google LLC. ©
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
