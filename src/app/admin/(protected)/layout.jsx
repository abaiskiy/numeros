import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, COOKIE_NAME } from '@/lib/adminAuth';

export const metadata = { title: 'Admin — Numeros', robots: 'noindex,nofollow' };

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!verifyToken(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#0D0E14] text-white">
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center gap-3">
        <span className="text-[#D4AF37] font-black tracking-widest text-sm">NUMEROS</span>
        <span className="text-gray-600 text-xs">/ admin</span>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
