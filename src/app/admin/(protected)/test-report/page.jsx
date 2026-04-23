'use client';

import { useState } from 'react';

// ─── Shared ───────────────────────────────────────────────────────────────────

const STATUS = { idle: 'idle', loading: 'loading', ok: 'ok', error: 'error' };

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 w-full';

function StatusBar({ status, error }) {
  if (status === STATUS.loading)
    return <p className="text-yellow-400 text-sm">Генерация... это займёт ~30–60 секунд</p>;
  if (status === STATUS.ok)
    return <p className="text-green-400 text-sm">✓ PDF отправлен на почту</p>;
  if (status === STATUS.error)
    return <p className="text-red-400 text-sm">✗ {error}</p>;
  return null;
}

// ─── Personal form ────────────────────────────────────────────────────────────

function PersonalForm() {
  const [fields, setFields] = useState({ name: '', birthDate: '', email: '', gender: 'female' });
  const [status, setStatus] = useState(STATUS.idle);
  const [error, setError] = useState('');

  function set(k, v) { setFields(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(STATUS.loading);
    setError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus(STATUS.ok);
    } catch (err) {
      setError(err.message);
      setStatus(STATUS.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Имя">
        <input className={inputCls} placeholder="Айгерим" value={fields.name} onChange={e => set('name', e.target.value)} required />
      </Field>
      <Field label="Дата рождения">
        <input className={inputCls} type="date" value={fields.birthDate} onChange={e => set('birthDate', e.target.value)} required />
      </Field>
      <Field label="Пол">
        <select className={inputCls} value={fields.gender} onChange={e => set('gender', e.target.value)}>
          <option value="female">Женский</option>
          <option value="male">Мужской</option>
        </select>
      </Field>
      <Field label="Email (куда отправить PDF)">
        <input className={inputCls} type="email" placeholder="test@example.com" value={fields.email} onChange={e => set('email', e.target.value)} required />
      </Field>

      <StatusBar status={status} error={error} />

      <button
        type="submit"
        disabled={status === STATUS.loading}
        className="bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-[0.2em] py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === STATUS.loading ? 'Генерация...' : 'Сгенерировать личный разбор'}
      </button>
    </form>
  );
}

// ─── Compatibility form ───────────────────────────────────────────────────────

function CompatibilityForm() {
  const [fields, setFields] = useState({ name1: '', date1: '', name2: '', date2: '', email: '' });
  const [status, setStatus] = useState(STATUS.idle);
  const [error, setError] = useState('');

  function set(k, v) { setFields(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(STATUS.loading);
    setError('');
    try {
      const res = await fetch('/api/order-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus(STATUS.ok);
    } catch (err) {
      setError(err.message);
      setStatus(STATUS.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Имя 1">
          <input className={inputCls} placeholder="Алия" value={fields.name1} onChange={e => set('name1', e.target.value)} />
        </Field>
        <Field label="Дата рождения 1">
          <input className={inputCls} type="date" value={fields.date1} onChange={e => set('date1', e.target.value)} required />
        </Field>
        <Field label="Имя 2">
          <input className={inputCls} placeholder="Нурсултан" value={fields.name2} onChange={e => set('name2', e.target.value)} />
        </Field>
        <Field label="Дата рождения 2">
          <input className={inputCls} type="date" value={fields.date2} onChange={e => set('date2', e.target.value)} required />
        </Field>
      </div>
      <Field label="Email (куда отправить PDF)">
        <input className={inputCls} type="email" placeholder="test@example.com" value={fields.email} onChange={e => set('email', e.target.value)} required />
      </Field>

      <StatusBar status={status} error={error} />

      <button
        type="submit"
        disabled={status === STATUS.loading}
        className="bg-rose-500 text-white font-black uppercase text-[11px] tracking-[0.2em] py-3 rounded-xl hover:bg-rose-400 transition-colors disabled:opacity-50"
      >
        {status === STATUS.loading ? 'Генерация...' : 'Сгенерировать разбор совместимости'}
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTestReportPage() {
  const [tab, setTab] = useState('personal');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold mb-1">Тестирование PDF</h1>
        <p className="text-gray-500 text-sm">
          Дёргает реальные эндпоинты. Оплата не нужна. PDF придёт на указанный email.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'personal', label: 'Личный разбор' },
          { id: 'compatibility', label: 'Совместимость' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
              tab === t.id
                ? 'bg-[#D4AF37] text-black'
                : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.07]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        {tab === 'personal' ? <PersonalForm /> : <CompatibilityForm />}
      </div>

      <p className="mt-6 text-gray-700 text-xs text-center">
        Страница недоступна для поисковиков (noindex). Сессия длится 8 часов.
      </p>
    </div>
  );
}
