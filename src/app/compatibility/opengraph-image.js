import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Numeros — Совместимость по дате рождения';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0D0E14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow — rose for compatibility */}
        <div style={{
          position: 'absolute', top: -200, right: -200,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,63,94,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -150, left: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Top: logo + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '2px solid #D4AF37',
            background: '#1C1A10',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#D4AF37',
          }}>
            N
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#D4AF37', letterSpacing: 6 }}>
            NUMEROS
          </span>
        </div>

        {/* Center: main text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#fb7185',
            textTransform: 'uppercase', letterSpacing: 4,
          }}>
            Нумерология пары · Матрица Пифагора
          </div>
          <div style={{
            fontSize: 58, fontWeight: 800, color: '#FFFFFF',
            lineHeight: 1.1, maxWidth: 800,
          }}>
            Совместимость двух людей по дате рождения
          </div>
          <div style={{ fontSize: 24, color: '#9CA3AF', maxWidth: 700, lineHeight: 1.5 }}>
            6 сфер жизни, языки любви, конфликтные зоны — PDF-разбор пары на почту
          </div>
        </div>

        {/* Bottom: stats + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { value: '6', label: 'сфер жизни' },
              { value: '90', label: 'дней дат' },
              { value: 'PDF', label: 'на почту' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#fb7185' }}>{s.value}</span>
                <span style={{ fontSize: 14, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: '#f43f5e', color: '#fff',
            padding: '16px 36px', borderRadius: 16,
            fontSize: 20, fontWeight: 800,
            letterSpacing: 1,
          }}>
            2 990 тг
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
