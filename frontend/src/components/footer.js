import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#002B50]/10 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo-gadgetplan-biru.png"
                alt="GadgetPlan Logo"
                width={220}
                height={64}
                style={{ width: 'auto', height: '64px' }}
                priority
              />
            </div>
            <p className="text-xs sm:text-sm text-[#002B50]/80">
              Tujuan satu pintu untuk iPhone, aksesori, dan layanan perbaikan profesional.
            </p>
          </div>

          {/* Belanja */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-[#002B50]">Belanja</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="/products" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Semua Produk
                </a>
              </li>
              <li>
                <a href="/products?category=iphone" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  iPhone
                </a>
              </li>
              <li>
                <a href="/products?category=accessories" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Aksesori
                </a>
              </li>
              <li>
                <a href="/products?category=case" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Casing
                </a>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-[#002B50]">Layanan</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="/servicego" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Layanan Perbaikan
                </a>
              </li>
              <li>
                <a href="/servicego#screen-repair" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Perbaikan Layar
                </a>
              </li>
              <li>
                <a href="/servicego#battery-repair" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Ganti Baterai
                </a>
              </li>
              <li>
                <a href="/servicego#water-damage" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Kerusakan Air
                </a>
              </li>
            </ul>
          </div>

          {/* Dukungan */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-[#002B50]">Dukungan</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a href="/contact" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="/faq" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Info Pengiriman
                </a>
              </li>
              <li>
                <a href="/warranty" className="text-xs sm:text-sm text-gray-600 inline-block relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#002B50] after:transition-all after:duration-200 hover:after:w-full">
                  Garansi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#002B50]/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-[#002B50]/70">
          <p>&copy; {new Date().getFullYear()} GadgetPlan. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}