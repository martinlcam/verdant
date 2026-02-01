export default function Footer() {
  return (
    <footer className="relative mt-auto mb-0 bg-[#1f2b26] h-[179px] px-[25px] py-[15px]">
      <div className="relative h-full">
        {/* Logo and Brand - aligned to bottom left of footer */}
        <div className="absolute bottom-0 left-[25px] flex items-center gap-[11px]">
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

        {/* Right Side Content - centered on the right */}
        <div className="absolute right-[15px] top-1/2 -translate-y-1/2 text-center">
          <p className="font-alliance text-[15px] leading-normal text-[#cfcfcf] mb-2">
            Github Repository
          </p>
          <div className="font-alliance text-[15px] leading-normal text-[#545454]">
            <p className="mb-0">Owen Skippen</p>
            <p className="mb-0">Martin Cam</p>
            <p className="mb-0">Krrish Kapoor</p>
            <p className="mb-0">Johnny Ho</p>
          </div>
          <p className="font-alliance text-[15px] leading-normal text-[#545454] mt-4">
            Powered by Google LLC. ©
          </p>
        </div>
      </div>
    </footer>
  );
}
