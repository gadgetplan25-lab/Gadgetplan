"use client";
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 border-t border-[#002B50]/20 mt-8 sm:mt-12 md:mt-[50px]" role="contentinfo">
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="max-w-[300px]">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="relative w-[70px] sm:w-[88px] h-[45px] sm:h-[56px]">
                  <Image
                    src="/logo-gadgetplan-biru.png"
                    alt="Logo GadgetPlan"
                    fill
                    sizes="(max-width: 640px) 70px, 88px"
                    className="object-contain"
                    loading="lazy"
                    quality={85}
                  />
                </div>
              </div>
              <p className="text-sm sm:text-base text-[#002B50]/80 leading-relaxed">
                Tujuan satu pintu untuk iPhone, aksesori, dan layanan perbaikan profesional.
              </p>
            </div>
            <nav className="sm:ml-[30px] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" aria-label="Footer navigation">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-[#002B50]">Belanja</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><a href="/products" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Semua Produk</a></li>
                  <li><a href="/products?category=iphone" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">iPhone</a></li>
                  <li><a href="/products?category=accessories" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Aksesori</a></li>
                  <li><a href="/products?category=case" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Casing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-[#002B50]">Layanan</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><a href="/servicego" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Layanan Perbaikan</a></li>
                  <li><a href="/servicego#screen-repair" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Perbaikan Layar</a></li>
                  <li><a href="/servicego#battery-repair" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Ganti Baterai</a></li>
                  <li><a href="/servicego#water-damage" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Kerusakan Air</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-[#002B50]">Dukungan</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  <li><a href="/contact" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Hubungi Kami</a></li>
                  <li><a href="/faq" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">FAQ</a></li>
                  <li><a href="/shipping" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Info Pengiriman</a></li>
                  <li><a href="/warranty" className="text-xs sm:text-sm text-gray-600 hover:text-blue-700 block">Garansi</a></li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="border-t border-[#002B50]/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-[#002B50]/70">
            <p>&copy; {new Date().getFullYear()} GadgetPlan. Semua hak dilindungi.</p>
          </div>
        </div>
      </section>
    </footer>
  );
}