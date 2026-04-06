'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gem, Menu, X } from 'lucide-react';

const BTN_NAV = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/10 to-transparent text-[#D4AF37] text-[11px] normal-case tracking-wide font-black hover:from-[#D4AF37]/20 transition-all';

export default function NavBar({ activePage = 'home' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = (page) =>
    `hover:text-[#D4AF37] transition-colors ${activePage === page ? 'text-[#D4AF37]' : ''}`;

  const mobileLinkClass = (page) =>
    `text-left text-sm normal-case font-bold transition-colors ${activePage === page ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'}`;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'py-4 bg-[#08090D]/90 backdrop-blur-md border-b border-white/10' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Лого */}
        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-gradient-to-tr from-[#D4AF37]/20 to-transparent group-hover:rotate-180 transition-transform duration-700">
            <Gem size={18} className="text-[#D4AF37]" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#D4AF37] uppercase font-black text-xl tracking-[0.1em]">
            Numeros
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-10 text-[13px] font-bold text-gray-400">
          <Link href="/" className={linkClass('home')}>
            Личная матрица
          </Link>
          <Link href="/compatibility" className={linkClass('compatibility')}>
            Совместимость
          </Link>
          <Link href="/#testimonials-section" className={linkClass('testimonials')}>
            Отзывы
          </Link>
          <Link href="/#faq-section" className={linkClass('faq')}>
            FAQ
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/" className={BTN_NAV}>
            Получить разбор
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-[#08090D]/95 backdrop-blur-md border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          <Link href="/" onClick={() => setMenuOpen(false)} className={mobileLinkClass('home')}>
            Личная матрица
          </Link>
          <Link href="/compatibility" onClick={() => setMenuOpen(false)} className={mobileLinkClass('compatibility')}>
            Совместимость
          </Link>
          <Link href="/#testimonials-section" onClick={() => setMenuOpen(false)} className={mobileLinkClass('testimonials')}>
            Отзывы
          </Link>
          <Link href="/#faq-section" onClick={() => setMenuOpen(false)} className={mobileLinkClass('faq')}>
            FAQ
          </Link>
          <div className="pt-2 border-t border-white/10">
            <Link href="/" onClick={() => setMenuOpen(false)} className={`${BTN_NAV} w-full justify-center`}>
              Получить разбор
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
