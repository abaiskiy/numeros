import React from 'react';
import path from 'path';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: path.join(process.cwd(), 'src/fonts/Roboto-Regular.ttf'), fontWeight: 400 },
    { src: path.join(process.cwd(), 'src/fonts/Roboto-Bold.ttf'),    fontWeight: 700 },
  ],
});

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  gold: '#C9A84C', goldFaint: '#1C1A10', goldBorder: '#3A3218',
  dark: '#08090D', surface: '#0D0E14', card: '#12131A', cardAlt: '#15161F',
  border: '#21222C',
  gray: '#6B6C7E', grayLight: '#9B9CAD', white: '#FFFFFF', text: '#D0D1E0',
  blue: '#5B9BD5', teal: '#3ABFB3', orange: '#D4874A', purple: '#9B7FCA',
  green: '#8ABF5A',
};

const s = StyleSheet.create({
  // Pages
  page: { backgroundColor: C.surface, fontFamily: 'Roboto', fontWeight: 400, fontSize: 10, color: C.text, lineHeight: 1.6 },
  coverPage: { backgroundColor: C.dark, padding: 0, justifyContent: 'space-between' },
  contentPage: { padding: 40, paddingTop: 32, paddingBottom: 44 },

  // Cover
  coverTop: { padding: 48, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: C.border },
  coverLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 52 },
  coverLogoDot: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: C.gold, backgroundColor: C.goldFaint, alignItems: 'center', justifyContent: 'center' },
  coverLogoDotText: { fontSize: 15, color: C.gold, fontFamily: 'Roboto', fontWeight: 700 },
  coverLogoText: { fontSize: 17, fontFamily: 'Roboto', fontWeight: 700, color: C.gold, letterSpacing: 3 },
  coverBadge: { alignSelf: 'flex-start', backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 18 },
  coverBadgeText: { fontSize: 7.5, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 2 },
  coverName: { fontSize: 30, fontFamily: 'Roboto', fontWeight: 700, color: C.white, marginBottom: 8, lineHeight: 1.2 },
  coverDate: { fontSize: 12, color: C.grayLight },
  coverMid: { padding: 48, paddingTop: 30, paddingBottom: 30, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  coverTocItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '47%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9 },
  coverTocNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center', justifyContent: 'center' },
  coverTocNumText: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 700, color: C.gold },
  coverTocText: { fontSize: 9, color: C.grayLight, flex: 1 },
  coverBottom: { padding: 48, paddingTop: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  coverBottomL: { fontSize: 8, color: C.gray },
  coverBottomR: { fontSize: 8, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 1 },

  // Page header / footer
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  pageHeaderLogo: { fontSize: 10, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 2 },
  pageHeaderRight: { fontSize: 8.5, color: C.gray },
  footer: { position: 'absolute', bottom: 16, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7, borderTopWidth: 1, borderTopColor: C.border },
  footerL: { fontSize: 7.5, color: C.gray },
  footerR: { fontSize: 7.5, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 1 },

  // Section label
  sectionLabel: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 700, color: C.gold, letterSpacing: 2, marginBottom: 12, marginTop: 2 },

  // Intro
  introCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderLeftWidth: 3, borderLeftColor: C.gold, borderRadius: 10, padding: 14, marginBottom: 18 },
  introText: { fontSize: 9.5, color: C.text, lineHeight: 1.75 },

  // Key numbers
  keyRow: { flexDirection: 'row', gap: 7, marginBottom: 16 },
  keyCard: { flex: 1, backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center' },
  keyLabel: { fontSize: 6, color: C.gold, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase', opacity: 0.7 },
  keyValue: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 700, color: C.gold },
  keyDesc: { fontSize: 7, color: C.grayLight, marginTop: 3 },

  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },

  // ─── Full matrix (matching website layout) ──────────────────────────────────
  matrixWrap: { backgroundColor: C.dark, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: C.border, marginBottom: 0 },

  // Row 1: Key numbers wide + Temperament
  matrixTopRow: { flexDirection: 'row', gap: 5, marginBottom: 5 },
  matrixKeyBlock: { flex: 3, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 8 },
  matrixKeyBlockLabel: { fontSize: 5.5, color: C.gray, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  matrixKeyInner: { flexDirection: 'row', gap: 4 },
  matrixKeyItem: { flex: 1, backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 6, paddingVertical: 7, alignItems: 'center' },
  matrixKeyItemVal: { fontSize: 15, fontFamily: 'Roboto', fontWeight: 700, color: C.white },
  matrixKeyItemLbl: { fontSize: 5, color: C.gold, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2, opacity: 0.8 },

  // 3×3 main cells
  matrixGrid: { flexDirection: 'column', gap: 5 },
  matrixRow: { flexDirection: 'row', gap: 5 },
  matrixCell: { flex: 3, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 7, paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center', gap: 3 },
  matrixCellHL: { backgroundColor: C.goldFaint, borderColor: C.gold, borderWidth: 1.5 },
  matrixCellTopBar: { position: 'absolute', top: 0, left: 10, right: 10, height: 1.5, backgroundColor: C.gold, borderRadius: 1 },
  matrixCellLabel: { fontSize: 5.5, color: C.gray, textTransform: 'uppercase', letterSpacing: 0.5 },
  matrixCellValue: { fontSize: 15, fontFamily: 'Roboto', fontWeight: 700, color: C.white },
  matrixCellValueHL: { color: C.gold },
  dotsRow: { flexDirection: 'row', gap: 2 },
  dot: { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: C.border },
  dotFill: { backgroundColor: C.gold },
  statusBadge: { borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1.5, marginTop: 2 },
  statusText: { fontSize: 5, fontFamily: 'Roboto', fontWeight: 700 },

  // Side cells (right column)
  sideCell: { flex: 1, backgroundColor: '#0F1220', borderWidth: 1, borderColor: '#1E2540', borderRadius: 7, paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', gap: 3 },
  sideCellTopBar: { position: 'absolute', top: 0, left: 6, right: 6, height: 1.5, backgroundColor: C.blue, borderRadius: 1, opacity: 0.7 },
  sideCellLabel: { fontSize: 5.5, color: '#5A7AAA', textTransform: 'uppercase', letterSpacing: 0.5 },
  sideCellValue: { fontSize: 15, fontFamily: 'Roboto', fontWeight: 700, color: '#7AAAD4' },

  // Bottom cells row
  matrixBottomRow: { flexDirection: 'row', gap: 5, marginTop: 5 },
  bottomCell: { flex: 1, backgroundColor: '#120F20', borderWidth: 1, borderColor: '#231840', borderRadius: 7, paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center', gap: 3 },
  bottomCellLeftBar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 1.5, backgroundColor: C.purple, borderRadius: 1, opacity: 0.7 },
  bottomCellLabel: { fontSize: 5.5, color: '#7A5AAA', textTransform: 'uppercase', letterSpacing: 0.5 },
  bottomCellValue: { fontSize: 15, fontFamily: 'Roboto', fontWeight: 700, color: '#B090D8' },

  // ─── Cell analysis cards ────────────────────────────────────────────────────
  cellCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 13, marginBottom: 8 },
  cellCardHL: { backgroundColor: C.goldFaint, borderColor: C.goldBorder },
  cellCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 9 },
  cellIconBox: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#1A1B26', borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  cellIconBoxHL: { backgroundColor: C.goldFaint, borderColor: C.goldBorder },
  cellIconSymbol: { fontSize: 13, color: C.grayLight },
  cellIconSymbolHL: { color: C.gold },
  cellTitleWrap: { flex: 1 },
  cellTitle: { fontSize: 10, fontFamily: 'Roboto', fontWeight: 700, color: C.white },
  cellTitleHL: { color: C.gold },
  cellSub: { fontSize: 7.5, color: C.gray, marginTop: 1.5 },
  cellBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2.5 },
  cellBadgeText: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 700 },
  cellBody: { fontSize: 9.5, color: C.text, lineHeight: 1.75 },

  // ─── Combinations ──────────────────────────────────────────────────────────
  combCard: { backgroundColor: '#0D0B14', borderWidth: 1, borderColor: '#221840', borderLeftWidth: 3, borderLeftColor: C.purple, borderRadius: 10, padding: 13, marginBottom: 8 },
  combHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  combChip: { backgroundColor: '#1E1530', borderWidth: 1, borderColor: '#3A2A50', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  combChipText: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 700, color: C.purple },
  combTitle: { fontSize: 10, fontFamily: 'Roboto', fontWeight: 700, color: '#C4A8E8', flex: 1 },
  combBody: { fontSize: 9.5, color: C.text, lineHeight: 1.75 },

  // ─── Special sections ────────────────────────────────────────────────────────
  moneyCard: { backgroundColor: '#0C100A', borderWidth: 1, borderColor: '#1E2A12', borderRadius: 12, padding: 16, marginBottom: 0 },
  relCard:   { backgroundColor: '#100A10', borderWidth: 1, borderColor: '#2A1228', borderRadius: 12, padding: 16, marginBottom: 0 },
  foreCard:  { backgroundColor: '#080F0F', borderWidth: 1, borderColor: '#102820', borderRadius: 12, padding: 16, marginBottom: 0 },
  specialIconRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  specialIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  specialTitle: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 700 },
  specialSub: { fontSize: 8, marginTop: 2 },
  specialBody: { fontSize: 9.5, lineHeight: 1.78 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  scoreBarBg: { flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3 },
  scoreBarFill: { height: 6, borderRadius: 3 },
  scoreNum: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 700, width: 32 },

  // Conclusion
  conclusionCard: { backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 12, padding: 20, marginBottom: 14 },
  conclusionTitle: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 700, color: C.gold, marginBottom: 10 },
  conclusionBody: { fontSize: 10, color: C.text, lineHeight: 1.82 },
  outroCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14 },
  outroText: { fontSize: 9, color: C.gray, lineHeight: 1.7, textAlign: 'center' },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CELL_ICONS = { 1:'◆', 2:'◈', 3:'◉', 4:'♡', 5:'◇', 6:'◎', 7:'★', 8:'◐', 9:'◑' };

function statusStyle(s2) {
  if (s2 === 'База')    return { bg: '#162030', color: C.blue };
  if (s2 === 'Усилено') return { bg: '#152520', color: C.teal };
  if (s2 === 'Импульс') return { bg: '#221A0F', color: C.orange };
  if (s2 === 'Экстра')  return { bg: C.goldFaint, color: C.gold };
  return null;
}

function Dots({ count }) {
  return (
    <View style={s.dotsRow}>
      {[0,1,2,3,4].map(i => (
        <View key={i} style={[s.dot, i < count && s.dotFill]} />
      ))}
    </View>
  );
}

// ─── Cover page ───────────────────────────────────────────────────────────────
function CoverPage({ name, birthDate }) {
  const dateFmt = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  const toc = [
    'Ключевые числа судьбы',
    'Психоматрица Пифагора',
    'Разбор всех 9 секторов',
    'Значимые комбинации',
    'Денежный потенциал',
    'Код отношений',
    `Прогноз на ${new Date().getFullYear()} год`,
    'Итог и рекомендации',
  ];
  return (
    <Page size="A4" style={[s.page, s.coverPage]}>
      <View style={s.coverTop}>
        <View style={s.coverLogoRow}>
          <View style={s.coverLogoDot}><Text style={s.coverLogoDotText}>N</Text></View>
          <Text style={s.coverLogoText}>NUMEROS</Text>
        </View>
        <View style={s.coverBadge}><Text style={s.coverBadgeText}>ПЕРСОНАЛЬНЫЙ РАЗБОР</Text></View>
        <Text style={s.coverName}>{name}</Text>
        <Text style={s.coverDate}>Дата рождения: {dateFmt}</Text>
      </View>
      <View style={s.coverMid}>
        {toc.map((item, i) => (
          <View key={i} style={s.coverTocItem}>
            <View style={s.coverTocNum}><Text style={s.coverTocNumText}>{i + 1}</Text></View>
            <Text style={s.coverTocText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={s.coverBottom}>
        <Text style={s.coverBottomL}>numeros.kz · Система А.Ф. Александрова</Text>
        <Text style={s.coverBottomR}>NUMEROS.KZ</Text>
      </View>
    </Page>
  );
}

function PageHeader({ name }) {
  return (
    <View style={s.pageHeader}>
      <Text style={s.pageHeaderLogo}>NUMEROS</Text>
      <Text style={s.pageHeaderRight}>{name} · Персональный разбор</Text>
    </View>
  );
}

function Footer({ name }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerL}>{name} · numeros.kz</Text>
      <Text style={s.footerR}>NUMEROS.KZ</Text>
    </View>
  );
}

// ─── Full matrix (matches website layout exactly) ─────────────────────────────
function FullMatrix({ matrix: m }) {
  const ROWS = [
    [{ key:'char', digit:1 }, { key:'health', digit:4 }, { key:'luck', digit:7 }],
    [{ key:'energy', digit:2 }, { key:'logic', digit:5 }, { key:'duty', digit:8 }],
    [{ key:'interest', digit:3 }, { key:'labor', digit:6 }, { key:'memory', digit:9 }],
  ];
  const SIDE = [
    { label:'Темперамент', val: m.temperament },
    { label:'Цель',        val: m.goal },
    { label:'Семья',       val: m.family },
    { label:'Стабильность',val: m.stability },
  ];
  const BOTTOM = [
    { label:'Самооценка', val: m.selfEsteem },
    { label:'Быт',        val: m.household },
    { label:'Талант',     val: m.talent },
    { label:'Духовность', val: m.spirituality },
  ];
  const CELL_LBL = { char:'Характер', health:'Здоровье', luck:'Удача', energy:'Энергия', logic:'Логика', duty:'Долг', interest:'Самооценка', labor:'Труд', memory:'Память' };

  return (
    <View style={s.matrixWrap}>
      {/* Row 0: key numbers + temperament */}
      <View style={s.matrixTopRow}>
        <View style={s.matrixKeyBlock}>
          <Text style={s.matrixKeyBlockLabel}>Доп. числа</Text>
          <View style={s.matrixKeyInner}>
            {[
              { l:'Судьба',  v: m.destiny },
              { l:'Душа',    v: m.soul },
              { l:'Карма',   v: m.karma },
              { l:'Скрытое', v: m.hidden },
            ].map(({ l, v }) => (
              <View key={l} style={s.matrixKeyItem}>
                <Text style={s.matrixKeyItemVal}>{v}</Text>
                <Text style={s.matrixKeyItemLbl}>{l}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={s.sideCell}>
          <View style={s.sideCellTopBar} />
          <Text style={s.sideCellLabel}>{SIDE[0].label}</Text>
          <Text style={s.sideCellValue}>{SIDE[0].val || '—'}</Text>
        </View>
      </View>

      {/* Rows 1–3: main 3×3 + side cells */}
      <View style={s.matrixGrid}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={s.matrixRow}>
            {row.map(({ key, digit }) => {
              const cell = m[key];
              const hl = cell?.h;
              const count = cell?.v === '—' ? 0 : (cell?.v?.length ?? 0);
              const st = statusStyle(cell?.s);
              return (
                <View key={key} style={[s.matrixCell, hl && s.matrixCellHL]}>
                  {hl && <View style={s.matrixCellTopBar} />}
                  <Text style={s.matrixCellLabel}>{CELL_LBL[key]}</Text>
                  <Text style={[s.matrixCellValue, hl && s.matrixCellValueHL]}>{cell?.v || '—'}</Text>
                  <Dots count={count} />
                  {st && (
                    <View style={[s.statusBadge, { backgroundColor: st.bg }]}>
                      <Text style={[s.statusText, { color: st.color }]}>{cell.s}</Text>
                    </View>
                  )}
                </View>
              );
            })}
            {/* Side cell for this row */}
            <View style={s.sideCell}>
              <View style={s.sideCellTopBar} />
              <Text style={s.sideCellLabel}>{SIDE[ri + 1].label}</Text>
              <Text style={s.sideCellValue}>{SIDE[ri + 1].val || '—'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Row 4: bottom cells */}
      <View style={s.matrixBottomRow}>
        {BOTTOM.map(({ label, val }) => (
          <View key={label} style={s.bottomCell}>
            <View style={s.bottomCellLeftBar} />
            <Text style={s.bottomCellLabel}>{label}</Text>
            <Text style={s.bottomCellValue}>{val || '—'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Cell card (wrap=false prevents page split) ───────────────────────────────
function CellCard({ cell }) {
  const hl = cell.status === 'Экстра' || cell.status === 'Импульс';
  const st = statusStyle(cell.status);
  return (
    <View wrap={false} style={[s.cellCard, hl && s.cellCardHL]}>
      <View style={s.cellCardHeader}>
        <View style={[s.cellIconBox, hl && s.cellIconBoxHL]}>
          <Text style={[s.cellIconSymbol, hl && s.cellIconSymbolHL]}>{CELL_ICONS[cell.digit] || '◆'}</Text>
        </View>
        <View style={s.cellTitleWrap}>
          <Text style={[s.cellTitle, hl && s.cellTitleHL]}>{cell.title}</Text>
          <Text style={s.cellSub}>Цифра {cell.digit} · {cell.value || '—'}</Text>
        </View>
        {st && (
          <View style={[s.cellBadge, { backgroundColor: st.bg }]}>
            <Text style={[s.cellBadgeText, { color: st.color }]}>{cell.status}</Text>
          </View>
        )}
      </View>
      <Text style={s.cellBody}>{cell.content}</Text>
    </View>
  );
}

function CombCard({ comb }) {
  return (
    <View wrap={false} style={s.combCard}>
      <View style={s.combHeader}>
        <View style={s.combChip}><Text style={s.combChipText}>{comb.digits}</Text></View>
        <Text style={s.combTitle}>{comb.title}</Text>
      </View>
      <Text style={s.combBody}>{comb.content}</Text>
    </View>
  );
}

// ─── Main document ────────────────────────────────────────────────────────────
export function NumerologyPDF({ name, birthDate, matrix, analysis }) {
  const cells    = analysis?.cells ?? [];
  const combs    = analysis?.combinations ?? [];
  const money    = analysis?.money ?? {};
  const rel      = analysis?.relationships ?? {};
  const forecast = analysis?.forecast ?? {};
  const conc     = analysis?.conclusion ?? '';
  const intro    = analysis?.intro ?? '';
  const moneyPct = Math.min(100, ((money.score ?? 5) / 10) * 100);
  const curYear  = new Date().getFullYear();

  return (
    <Document title={`Нумерологический разбор — ${name}`}>

      {/* ── Cover ─────────────────────────────────────────────────────────── */}
      <CoverPage name={name} birthDate={birthDate} />

      {/* ── Page 2: Intro + Key numbers + Full matrix ─────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />

        {intro ? (
          <View wrap={false} style={s.introCard}>
            <Text style={s.introText}>{intro}</Text>
          </View>
        ) : null}

        <Text style={s.sectionLabel}>◆  КЛЮЧЕВЫЕ ЧИСЛА</Text>
        <View wrap={false} style={s.keyRow}>
          {[
            { label: 'Число судьбы', value: matrix.destiny, desc: 'Жизненный путь'   },
            { label: 'Число души',   value: matrix.soul,    desc: 'Внутренний мир'    },
            { label: 'Число кармы',  value: matrix.karma,   desc: 'Уроки прошлого'    },
            { label: 'Скрытое',      value: matrix.hidden,  desc: 'Тайный потенциал'  },
          ].map(({ label, value, desc }) => (
            <View key={label} style={s.keyCard}>
              <Text style={s.keyLabel}>{label}</Text>
              <Text style={s.keyValue}>{value}</Text>
              <Text style={s.keyDesc}>{desc}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        <Text style={s.sectionLabel}>◆  ПСИХОМАТРИЦА ПИФАГОРА</Text>
        <FullMatrix matrix={matrix} />

        <Footer name={name} />
      </Page>

      {/* ── Page 3+: Cell analysis (auto page-break, wrap=false per card) ─── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />
        <Text style={s.sectionLabel}>◆  РАЗБОР СЕКТОРОВ МАТРИЦЫ</Text>
        {cells.map((cell, i) => <CellCard key={i} cell={cell} />)}

        {combs.length > 0 && (
          <>
            <View style={s.divider} />
            <Text style={s.sectionLabel}>◆  ЗНАЧИМЫЕ КОМБИНАЦИИ ЦИФР</Text>
            {combs.map((comb, i) => <CombCard key={i} comb={comb} />)}
          </>
        )}

        <Footer name={name} />
      </Page>

      {/* ── Special sections page ─────────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />

        {/* Money */}
        <Text style={s.sectionLabel}>◆  ДЕНЕЖНЫЙ ПОТЕНЦИАЛ</Text>
        <View wrap={false} style={s.moneyCard}>
          <View style={s.specialIconRow}>
            <View style={[s.specialIconBox, { backgroundColor: '#182010' }]}>
              <Text style={{ fontSize: 16, color: C.green }}>◈</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.specialTitle, { color: C.green }]}>{money.title || 'Денежный потенциал'}</Text>
              <Text style={[s.specialSub, { color: '#6A8A4A' }]}>Финансовый код · Уровень {money.score ?? '?'}/10</Text>
            </View>
          </View>
          <View style={s.scoreBarRow}>
            <View style={s.scoreBarBg}>
              <View style={[s.scoreBarFill, { width: `${moneyPct}%`, backgroundColor: C.green }]} />
            </View>
            <Text style={[s.scoreNum, { color: C.green }]}>{money.score ?? '?'}/10</Text>
          </View>
          <Text style={[s.specialBody, { color: '#B0C898' }]}>{money.content}</Text>
        </View>

        <View style={s.divider} />

        {/* Relationships */}
        <Text style={s.sectionLabel}>◆  КОД ОТНОШЕНИЙ</Text>
        <View wrap={false} style={s.relCard}>
          <View style={s.specialIconRow}>
            <View style={[s.specialIconBox, { backgroundColor: '#1C0F18' }]}>
              <Text style={{ fontSize: 16, color: '#D48EC0' }}>♡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.specialTitle, { color: '#D48EC0' }]}>{rel.title || 'Код отношений'}</Text>
              <Text style={[s.specialSub, { color: '#8A5A7A' }]}>Любовь · Партнёрство · Семья</Text>
            </View>
          </View>
          <Text style={[s.specialBody, { color: '#E0B8D0' }]}>{rel.content}</Text>
        </View>

        <View style={s.divider} />

        {/* Forecast */}
        <Text style={s.sectionLabel}>◆  ПРОГНОЗ НА {forecast.year || curYear} ГОД</Text>
        <View wrap={false} style={s.foreCard}>
          <View style={s.specialIconRow}>
            <View style={[s.specialIconBox, { backgroundColor: '#081818' }]}>
              <Text style={{ fontSize: 16, color: C.teal }}>◎</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.specialTitle, { color: C.teal }]}>{forecast.title || `Прогноз на ${curYear}`}</Text>
              {forecast.personalYear
                ? <Text style={[s.specialSub, { color: '#3A8A80' }]}>Личный год: {forecast.personalYear} · Текущий цикл</Text>
                : null}
            </View>
          </View>
          <Text style={[s.specialBody, { color: '#A0D8D0' }]}>{forecast.content}</Text>
        </View>

        <Footer name={name} />
      </Page>

      {/* ── Conclusion ────────────────────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />
        <Text style={s.sectionLabel}>◆  ИТОГ И РЕКОМЕНДАЦИИ</Text>
        <View wrap={false} style={s.conclusionCard}>
          <Text style={s.conclusionTitle}>★  Ваш персональный итог</Text>
          <Text style={s.conclusionBody}>{conc}</Text>
        </View>
        <View wrap={false} style={s.outroCard}>
          <Text style={s.outroText}>
            Разбор составлен по системе А.Ф. Александрова · Психоматрица Пифагора{'\n'}
            Нумерология — инструмент самопознания. Используйте знания во благо.{'\n'}
            numeros.kz
          </Text>
        </View>
        <Footer name={name} />
      </Page>

    </Document>
  );
}
