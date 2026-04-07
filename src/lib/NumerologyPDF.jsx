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

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  gold:       '#C9A84C',
  goldLight:  '#E8C96A',
  goldFaint:  '#1C1A10',
  dark:       '#08090D',
  surface:    '#0D0E14',
  card:       '#12131A',
  cardAlt:    '#15161F',
  border:     '#21222C',
  borderGold: '#3A3218',
  gray:       '#6B6C7E',
  grayLight:  '#9B9CAD',
  white:      '#FFFFFF',
  text:       '#D8D9E8',
  blue:       '#4A90D9',
  teal:       '#3ABFB3',
  orange:     '#E8944A',
};

const BOLD = 'Roboto';

const s = StyleSheet.create({
  // ── Page ──────────────────────────────────────────────────────────────────
  page: {
    backgroundColor: C.surface,
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 10,
    color: C.text,
    lineHeight: 1.6,
  },

  // ── Cover page ────────────────────────────────────────────────────────────
  coverPage: {
    backgroundColor: C.dark,
    padding: 0,
    justifyContent: 'space-between',
  },
  coverTop: {
    backgroundColor: C.dark,
    padding: 48,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  coverLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 56,
  },
  coverLogoDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.gold,
    backgroundColor: C.goldFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverLogoDotText: { fontSize: 14, color: C.gold, fontFamily: BOLD, fontWeight: 700 },
  coverLogoText: { fontSize: 16, fontFamily: BOLD, fontWeight: 700, color: C.gold, letterSpacing: 3 },
  coverBadge: {
    alignSelf: 'flex-start',
    backgroundColor: C.goldFaint,
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 20,
  },
  coverBadgeText: { fontSize: 8, color: C.gold, fontFamily: BOLD, fontWeight: 700, letterSpacing: 2 },
  coverName: { fontSize: 32, fontFamily: BOLD, fontWeight: 700, color: C.white, marginBottom: 10, lineHeight: 1.2 },
  coverDate: { fontSize: 13, color: C.grayLight, letterSpacing: 0.5 },
  coverMid: {
    padding: 48,
    paddingTop: 36,
    paddingBottom: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  coverTocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '47%',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coverTocDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: C.gold,
  },
  coverTocText: { fontSize: 9, color: C.grayLight },
  coverBottom: {
    padding: 48,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverBottomLeft: { fontSize: 8, color: C.gray },
  coverBottomRight: { fontSize: 8, color: C.gold, fontFamily: BOLD, fontWeight: 700, letterSpacing: 1 },

  // ── Content pages ─────────────────────────────────────────────────────────
  contentPage: {
    padding: 40,
    paddingTop: 36,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pageHeaderLogo: { fontSize: 10, color: C.gold, fontFamily: BOLD, fontWeight: 700, letterSpacing: 2 },
  pageHeaderName: { fontSize: 9, color: C.gray },

  // ── Section titles ─────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 7,
    fontFamily: BOLD,
    fontWeight: 700,
    color: C.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginTop: 4,
  },

  // ── Intro text ─────────────────────────────────────────────────────────────
  introCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 3,
    borderLeftColor: C.gold,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  introText: { fontSize: 10, color: C.text, lineHeight: 1.7 },

  // ── Key numbers row ────────────────────────────────────────────────────────
  keyRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  keyCard: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  keyLabel: { fontSize: 6.5, color: C.gray, letterSpacing: 0.5, marginBottom: 5, textTransform: 'uppercase' },
  keyValue: { fontSize: 22, fontFamily: BOLD, fontWeight: 700, color: C.gold },
  keyDesc:  { fontSize: 7, color: C.grayLight, marginTop: 3 },

  // ── Matrix grid ────────────────────────────────────────────────────────────
  matrixWrap: { marginBottom: 20 },
  matrixGrid: { flexDirection: 'column', gap: 5 },
  matrixRow:  { flexDirection: 'row', gap: 5 },
  matrixCell: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minHeight: 64,
    justifyContent: 'center',
    gap: 3,
  },
  matrixCellHL: {
    backgroundColor: C.goldFaint,
    borderColor: C.gold,
    borderWidth: 1.5,
  },
  matrixCellTopLine: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 1.5,
    backgroundColor: C.gold,
    borderRadius: 1,
  },
  matrixCellLabel: { fontSize: 6, color: C.gray, textTransform: 'uppercase', letterSpacing: 0.5 },
  matrixCellValue: { fontSize: 16, fontFamily: BOLD, fontWeight: 700, color: C.white },
  matrixCellValueHL: { color: C.gold },
  matrixDotsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  matrixDot:     { width: 4, height: 4, borderRadius: 2, backgroundColor: C.border },
  matrixDotFill: { backgroundColor: C.gold },
  matrixBadge: {
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#1A2030',
  },
  matrixBadgeText: { fontSize: 5.5, fontFamily: BOLD, fontWeight: 700, color: C.blue },
  matrixBadgeBase:    { backgroundColor: '#161D2C', },
  matrixBadgeBaseT:   { color: C.blue },
  matrixBadgeStrong:  { backgroundColor: '#162520', },
  matrixBadgeStrongT: { color: C.teal },
  matrixBadgeImpulse: { backgroundColor: '#221A0F', },
  matrixBadgeImpulseT:{ color: C.orange },
  matrixBadgeExtra:   { backgroundColor: '#1C1A10', },
  matrixBadgeExtraT:  { color: C.gold },

  // Side numbers bar
  matrixSideBar:  { marginTop: 10, flexDirection: 'row', gap: 5 },
  matrixSideCard: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matrixSideLabel: { fontSize: 7, color: C.gray },
  matrixSideVal:   { fontSize: 10, fontFamily: BOLD, fontWeight: 700, color: C.grayLight },

  // ── Cell analysis cards ────────────────────────────────────────────────────
  cellCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  cellCardHL: {
    backgroundColor: C.goldFaint,
    borderColor: C.borderGold,
  },
  cellCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cellIconBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#1A1B24',
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIconBoxHL: { backgroundColor: C.goldFaint, borderColor: C.borderGold },
  cellIconText:  { fontSize: 11, color: C.grayLight },
  cellIconTextHL:{ color: C.gold },
  cellTitleBlock:{ flex: 1 },
  cellTitle:     { fontSize: 10.5, fontFamily: BOLD, fontWeight: 700, color: C.white },
  cellTitleHL:   { color: C.gold },
  cellValue:     { fontSize: 8, color: C.gray, marginTop: 1 },
  cellStatusBadge:{
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cellStatusText: { fontSize: 7, fontFamily: BOLD, fontWeight: 700 },
  cellBody:      { fontSize: 9.5, color: C.text, lineHeight: 1.7 },

  // ── Combinations ──────────────────────────────────────────────────────────
  combCard: {
    backgroundColor: '#0F1018',
    borderWidth: 1,
    borderColor: '#2A2040',
    borderLeftWidth: 3,
    borderLeftColor: '#7B5EA7',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  combHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  combDigits: {
    backgroundColor: '#1E1530',
    borderWidth: 1,
    borderColor: '#3A2A50',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  combDigitsText: { fontSize: 8, fontFamily: BOLD, fontWeight: 700, color: '#9B7FCA' },
  combTitle:  { fontSize: 10, fontFamily: BOLD, fontWeight: 700, color: '#C4A8E8' },
  combBody:   { fontSize: 9.5, color: C.text, lineHeight: 1.7 },

  // ── Special sections (money, relations, forecast) ─────────────────────────
  specialCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  specialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  specialIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialIcon:   { fontSize: 14 },
  specialTitle:  { fontSize: 12, fontFamily: BOLD, fontWeight: 700 },
  specialBody:   { fontSize: 9.5, lineHeight: 1.75 },

  // Money score bar
  scoreRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  scoreLabel:{ fontSize: 8, color: C.gray, width: 50 },
  scoreBarBg:{ flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3 },
  scoreBarFill:{ height: 6, borderRadius: 3, backgroundColor: C.gold },
  scoreNum:  { fontSize: 10, fontFamily: BOLD, fontWeight: 700, color: C.gold, width: 28 },

  // ── Conclusion ────────────────────────────────────────────────────────────
  conclusionCard: {
    backgroundColor: C.goldFaint,
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 12,
    padding: 20,
    marginTop: 4,
  },
  conclusionTitle: {
    fontSize: 13,
    fontFamily: BOLD,
    fontWeight: 700,
    color: C.gold,
    marginBottom: 10,
  },
  conclusionText: { fontSize: 10, color: C.text, lineHeight: 1.8 },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  footerText:  { fontSize: 7.5, color: C.gray },
  footerBrand: { fontSize: 7.5, color: C.gold, fontFamily: BOLD, fontWeight: 700, letterSpacing: 1 },

  divider: { height: 1, backgroundColor: C.border, marginVertical: 16 },
});

// ─── Icon map (Unicode symbols compatible with Roboto) ────────────────────────
const CELL_ICONS = {
  1: '◆', 2: '◈', 3: '◉', 4: '♡', 5: '◇', 6: '⬡', 7: '★', 8: '◎', 9: '◐',
};
const CELL_NAMES = {
  1: 'Характер и воля',    2: 'Энергия и биополе',  3: 'Самооценка',
  4: 'Здоровье и тело',    5: 'Логика и интуиция',  6: 'Труд и деньги',
  7: 'Удача и везение',    8: 'Чувство долга',       9: 'Память и интеллект',
};

// Status badge styles
function badgeStyle(status) {
  if (status === 'База')    return { bg: s.matrixBadgeBase,    txt: s.matrixBadgeBaseT };
  if (status === 'Усилено') return { bg: s.matrixBadgeStrong,  txt: s.matrixBadgeStrongT };
  if (status === 'Импульс') return { bg: s.matrixBadgeImpulse, txt: s.matrixBadgeImpulseT };
  if (status === 'Экстра')  return { bg: s.matrixBadgeExtra,   txt: s.matrixBadgeExtraT };
  return null;
}

function cellStatusStyle(status) {
  if (status === 'База')    return { bg: '#162030', color: C.blue };
  if (status === 'Усилено') return { bg: '#152520', color: C.teal };
  if (status === 'Импульс') return { bg: '#221A10', color: C.orange };
  if (status === 'Экстра')  return { bg: '#1C1A10', color: C.gold };
  return null;
}

// Dots indicator (0–5)
function Dots({ count }) {
  const max = 5;
  return (
    <View style={s.matrixDotsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <View key={i} style={[s.matrixDot, i < count && s.matrixDotFill]} />
      ))}
    </View>
  );
}

// ─── Cover page ───────────────────────────────────────────────────────────────
function CoverPage({ name, birthDate }) {
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  const toc = [
    'Ключевые числа судьбы',
    'Психоматрица Пифагора',
    'Разбор всех 9 секторов',
    'Значимые комбинации цифр',
    'Денежный потенциал',
    'Код отношений',
    `Прогноз на ${new Date().getFullYear()} год`,
    'Итог и рекомендации',
  ];

  return (
    <Page size="A4" style={[s.page, s.coverPage]}>
      <View style={s.coverTop}>
        {/* Logo */}
        <View style={s.coverLogoRow}>
          <View style={s.coverLogoDot}>
            <Text style={s.coverLogoDotText}>N</Text>
          </View>
          <Text style={s.coverLogoText}>NUMEROS</Text>
        </View>

        {/* Badge */}
        <View style={s.coverBadge}>
          <Text style={s.coverBadgeText}>ПЕРСОНАЛЬНЫЙ РАЗБОР</Text>
        </View>

        {/* Name */}
        <Text style={s.coverName}>{name}</Text>
        <Text style={s.coverDate}>Дата рождения: {dateFormatted}</Text>
      </View>

      {/* Table of contents */}
      <View style={s.coverMid}>
        {toc.map((item, i) => (
          <View key={i} style={s.coverTocItem}>
            <View style={s.coverTocDot} />
            <Text style={s.coverTocText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={s.coverBottom}>
        <Text style={s.coverBottomLeft}>numeros.kz · Система Александрова</Text>
        <Text style={s.coverBottomRight}>NUMEROS.KZ</Text>
      </View>
    </Page>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────────
function PageHeader({ name }) {
  return (
    <View style={s.pageHeader}>
      <Text style={s.pageHeaderLogo}>NUMEROS</Text>
      <Text style={s.pageHeaderName}>{name} · Нумерологический разбор</Text>
    </View>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ name }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{name} · numeros.kz</Text>
      <Text style={s.footerBrand}>NUMEROS.KZ</Text>
    </View>
  );
}

// ─── Matrix grid ──────────────────────────────────────────────────────────────
const MATRIX_LAYOUT = [
  [{ digit: 1, key: 'char' },    { digit: 4, key: 'health' }, { digit: 7, key: 'luck' }],
  [{ digit: 2, key: 'energy' },  { digit: 5, key: 'logic' },  { digit: 8, key: 'duty' }],
  [{ digit: 3, key: 'interest' },{ digit: 6, key: 'labor' },  { digit: 9, key: 'memory' }],
];
const CELL_LABEL = {
  char: 'Характер', health: 'Здоровье', luck: 'Удача',
  energy: 'Энергия', logic: 'Логика', duty: 'Долг',
  interest: 'Самооценка', labor: 'Труд', memory: 'Память',
};

function MatrixGrid({ matrix }) {
  return (
    <View style={s.matrixGrid}>
      {MATRIX_LAYOUT.map((row, ri) => (
        <View key={ri} style={s.matrixRow}>
          {row.map(({ digit, key }) => {
            const cell = matrix[key];
            const hl = cell?.h;
            const count = cell?.v === '—' ? 0 : (cell?.v?.length ?? 0);
            const badge = badgeStyle(cell?.s);

            return (
              <View key={key} style={[s.matrixCell, hl && s.matrixCellHL]}>
                {hl && <View style={s.matrixCellTopLine} />}
                <Text style={s.matrixCellLabel}>{CELL_LABEL[key]}</Text>
                <Text style={[s.matrixCellValue, hl && s.matrixCellValueHL]}>
                  {cell?.v || '—'}
                </Text>
                <Dots count={count} />
                {badge && (
                  <View style={[s.matrixBadge, badge.bg]}>
                    <Text style={[s.matrixBadgeText, badge.txt]}>{cell.s}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ─── Cell analysis card ───────────────────────────────────────────────────────
function CellCard({ cell }) {
  const hl = cell.status === 'Экстра' || cell.status === 'Импульс';
  const st = cellStatusStyle(cell.status);
  return (
    <View style={[s.cellCard, hl && s.cellCardHL]}>
      <View style={s.cellCardHeader}>
        <View style={[s.cellIconBox, hl && s.cellIconBoxHL]}>
          <Text style={[s.cellIconText, hl && s.cellIconTextHL]}>
            {CELL_ICONS[cell.digit] || '◆'}
          </Text>
        </View>
        <View style={s.cellTitleBlock}>
          <Text style={[s.cellTitle, hl && s.cellTitleHL]}>{cell.title}</Text>
          <Text style={s.cellValue}>Цифра {cell.digit} · {cell.value || '—'}</Text>
        </View>
        {st && (
          <View style={[s.cellStatusBadge, { backgroundColor: st.bg }]}>
            <Text style={[s.cellStatusText, { color: st.color }]}>{cell.status}</Text>
          </View>
        )}
      </View>
      <Text style={s.cellBody}>{cell.content}</Text>
    </View>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function NumerologyPDF({ name, birthDate, matrix, analysis }) {
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const cells   = analysis?.cells ?? [];
  const combs   = analysis?.combinations ?? [];
  const money   = analysis?.money ?? {};
  const rel     = analysis?.relationships ?? {};
  const forecast= analysis?.forecast ?? {};
  const conc    = analysis?.conclusion ?? '';
  const intro   = analysis?.intro ?? '';

  const moneyPct = Math.min(100, ((money.score ?? 5) / 10) * 100);

  return (
    <Document title={`Нумерологический разбор — ${name}`}>

      {/* ── Cover ─────────────────────────────────────────────────────────── */}
      <CoverPage name={name} birthDate={birthDate} />

      {/* ── Page 2: Key numbers + matrix ─────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />

        {/* Intro */}
        {intro ? (
          <View style={s.introCard}>
            <Text style={s.introText}>{intro}</Text>
          </View>
        ) : null}

        {/* Key numbers */}
        <Text style={s.sectionLabel}>◆  Ключевые числа</Text>
        <View style={s.keyRow}>
          {[
            { label: 'Число судьбы', value: matrix.destiny, desc: 'Жизненный путь' },
            { label: 'Число души',   value: matrix.soul,    desc: 'Внутренний мир' },
            { label: 'Число кармы',  value: matrix.karma,   desc: 'Уроки прошлого' },
            { label: 'Скрытое',      value: matrix.hidden,  desc: 'Тайный потенциал' },
          ].map(({ label, value, desc }) => (
            <View key={label} style={s.keyCard}>
              <Text style={s.keyLabel}>{label}</Text>
              <Text style={s.keyValue}>{value}</Text>
              <Text style={s.keyDesc}>{desc}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Matrix */}
        <Text style={s.sectionLabel}>◆  Психоматрица Пифагора</Text>
        <View style={s.matrixWrap}>
          <MatrixGrid matrix={matrix} />
          {/* Side indicators */}
          <View style={s.matrixSideBar}>
            {[
              { label: 'Целеустр.', val: matrix.goal },
              { label: 'Семья',     val: matrix.family },
              { label: 'Стабильн.', val: matrix.stability },
              { label: 'Духовн.',   val: matrix.spirituality },
              { label: 'Талант',    val: matrix.talent },
            ].map(({ label, val }) => (
              <View key={label} style={s.matrixSideCard}>
                <Text style={s.matrixSideLabel}>{label}</Text>
                <Text style={s.matrixSideVal}>{val || '—'}</Text>
              </View>
            ))}
          </View>
        </View>

        <Footer name={name} />
      </Page>

      {/* ── Page 3+: Cell analysis ───────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />
        <Text style={s.sectionLabel}>◆  Разбор секторов матрицы</Text>
        {cells.slice(0, 5).map((cell, i) => <CellCard key={i} cell={cell} />)}
        <Footer name={name} />
      </Page>

      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />
        <Text style={s.sectionLabel}>◆  Разбор секторов матрицы (продолжение)</Text>
        {cells.slice(5).map((cell, i) => <CellCard key={i} cell={cell} />)}

        {/* Combinations */}
        {combs.length > 0 && (
          <>
            <View style={s.divider} />
            <Text style={s.sectionLabel}>◆  Значимые комбинации цифр</Text>
            {combs.map((comb, i) => (
              <View key={i} style={s.combCard}>
                <View style={s.combHeader}>
                  <View style={s.combDigits}>
                    <Text style={s.combDigitsText}>{comb.digits}</Text>
                  </View>
                  <Text style={s.combTitle}>{comb.title}</Text>
                </View>
                <Text style={s.combBody}>{comb.content}</Text>
              </View>
            ))}
          </>
        )}

        <Footer name={name} />
      </Page>

      {/* ── Page: Money + Relations + Forecast + Conclusion ──────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />

        {/* Money */}
        <Text style={s.sectionLabel}>◆  Денежный потенциал</Text>
        <View style={[s.specialCard, { backgroundColor: '#0F1108', borderWidth: 1, borderColor: '#2A3010' }]}>
          <View style={s.specialHeader}>
            <View style={[s.specialIconBox, { backgroundColor: '#1A2010' }]}>
              <Text style={s.specialIcon}>◈</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.specialTitle, { color: '#B8D060' }]}>{money.title || 'Денежный потенциал'}</Text>
            </View>
          </View>
          <View style={s.scoreRow}>
            <Text style={s.scoreLabel}>Потенциал</Text>
            <View style={s.scoreBarBg}>
              <View style={[s.scoreBarFill, { width: `${moneyPct}%`, backgroundColor: '#B8D060' }]} />
            </View>
            <Text style={[s.scoreNum, { color: '#B8D060' }]}>{money.score ?? '?'}/10</Text>
          </View>
          <Text style={[s.specialBody, { color: '#C8D8A0' }]}>{money.content}</Text>
        </View>

        <View style={s.divider} />

        {/* Relationships */}
        <Text style={s.sectionLabel}>◆  Код отношений</Text>
        <View style={[s.specialCard, { backgroundColor: '#120810', borderWidth: 1, borderColor: '#2A1030' }]}>
          <View style={s.specialHeader}>
            <View style={[s.specialIconBox, { backgroundColor: '#1C1020' }]}>
              <Text style={s.specialIcon}>♡</Text>
            </View>
            <Text style={[s.specialTitle, { color: '#D48EC0' }]}>{rel.title || 'Код отношений'}</Text>
          </View>
          <Text style={[s.specialBody, { color: '#E0B8D0' }]}>{rel.content}</Text>
        </View>

        <View style={s.divider} />

        {/* Forecast */}
        <Text style={s.sectionLabel}>◆  Прогноз на {forecast.year || new Date().getFullYear()} год</Text>
        <View style={[s.specialCard, { backgroundColor: '#08100F', borderWidth: 1, borderColor: '#103028' }]}>
          <View style={s.specialHeader}>
            <View style={[s.specialIconBox, { backgroundColor: '#102020' }]}>
              <Text style={s.specialIcon}>◎</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.specialTitle, { color: '#60C8B8' }]}>{forecast.title || 'Прогноз'}</Text>
              {forecast.personalYear ? (
                <Text style={{ fontSize: 8, color: C.gray, marginTop: 2 }}>
                  Личный год: {forecast.personalYear}
                </Text>
              ) : null}
            </View>
          </View>
          <Text style={[s.specialBody, { color: '#A8E0D8' }]}>{forecast.content}</Text>
        </View>

        <Footer name={name} />
      </Page>

      {/* ── Conclusion page ───────────────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name={name} />

        <Text style={s.sectionLabel}>◆  Итог и рекомендации</Text>
        <View style={s.conclusionCard}>
          <Text style={s.conclusionTitle}>★  Ваш персональный итог</Text>
          <Text style={s.conclusionText}>{conc}</Text>
        </View>

        {/* Outro */}
        <View style={{ marginTop: 20, padding: 16, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 9, color: C.gray, lineHeight: 1.7, textAlign: 'center' }}>
            Этот разбор составлен по системе А.Ф. Александрова с применением психоматрицы Пифагора.{'\n'}
            Нумерология — инструмент самопознания. Используйте знания во благо.{'\n'}
            {'  '}numeros.kz
          </Text>
        </View>

        <Footer name={name} />
      </Page>

    </Document>
  );
}
