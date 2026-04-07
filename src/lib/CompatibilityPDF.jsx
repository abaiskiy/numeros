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

const C = {
  gold: '#C9A84C', goldFaint: '#1C1A10', goldBorder: '#3A3218',
  dark: '#08090D', surface: '#0D0E14', card: '#12131A',
  border: '#21222C', gray: '#6B6C7E', grayLight: '#9B9CAD',
  white: '#FFFFFF', text: '#D0D1E0',
  p1: '#C9A84C', p1faint: '#1C1A10', p1border: '#3A3218',   // gold for person 1
  p2: '#5B9BD5', p2faint: '#0C1420', p2border: '#1E3050',   // blue for person 2
  rose: '#D48EC0', roseFaint: '#12080F', roseBorder: '#2A1025',
  green: '#8ABF5A', greenFaint: '#0C100A', greenBorder: '#1E2A12',
  teal: '#3ABFB3', tealFaint: '#080F0E', tealBorder: '#102A28',
  purple: '#9B7FCA', purpleFaint: '#0D0B14', purpleBorder: '#221840',
  amber: '#D4A03A', amberFaint: '#120D06', amberBorder: '#2A2010',
  blue: '#5B9BD5', blueFaint: '#080E16', blueBorder: '#182035',
};

const s = StyleSheet.create({
  page: { backgroundColor: C.surface, fontFamily: 'Roboto', fontWeight: 400, fontSize: 10, color: C.text, lineHeight: 1.6 },
  coverPage: { backgroundColor: C.dark, padding: 0 },
  contentPage: { padding: 40, paddingTop: 32, paddingBottom: 44 },

  // Cover
  coverTop: { padding: 48, paddingBottom: 0 },
  coverLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 48 },
  coverLogoDot: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: C.gold, backgroundColor: C.goldFaint, alignItems: 'center', justifyContent: 'center' },
  coverLogoDotText: { fontSize: 15, color: C.gold, fontFamily: 'Roboto', fontWeight: 700 },
  coverLogoText: { fontSize: 17, fontFamily: 'Roboto', fontWeight: 700, color: C.gold, letterSpacing: 3 },
  coverBadge: { alignSelf: 'flex-start', backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 32 },
  coverBadgeText: { fontSize: 7.5, color: C.rose, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 2 },

  // Names row on cover
  coverNamesRow: { flexDirection: 'row', alignItems: 'center', gap: 0, marginBottom: 16 },
  coverName1: { flex: 1, fontSize: 26, fontFamily: 'Roboto', fontWeight: 700, color: C.p1, lineHeight: 1.2 },
  coverHeart: { fontSize: 22, color: C.rose, paddingHorizontal: 12 },
  coverName2: { flex: 1, fontSize: 26, fontFamily: 'Roboto', fontWeight: 700, color: C.p2, lineHeight: 1.2, textAlign: 'right' },
  coverTitle: { fontSize: 12, color: C.grayLight, marginBottom: 48 },

  // Score on cover
  coverScoreBlock: { alignItems: 'center', paddingVertical: 48, borderTopWidth: 1, borderTopColor: C.border },
  coverScoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: C.rose, alignItems: 'center', justifyContent: 'center', marginBottom: 12, backgroundColor: C.roseFaint },
  coverScoreNum: { fontSize: 44, fontFamily: 'Roboto', fontWeight: 700, color: C.white },
  coverScoreLabel: { fontSize: 14, fontFamily: 'Roboto', fontWeight: 700, color: C.rose, marginBottom: 8 },
  coverScoreDesc: { fontSize: 9.5, color: C.grayLight, textAlign: 'center', maxWidth: 280 },

  // Toc on cover
  coverToc: { padding: 48, paddingTop: 0, flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  coverTocItem: { flexDirection: 'row', alignItems: 'center', gap: 7, width: '47%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 9, paddingHorizontal: 11, paddingVertical: 8 },
  coverTocNum: { width: 17, height: 17, borderRadius: 9, backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, alignItems: 'center', justifyContent: 'center' },
  coverTocNumText: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 700, color: C.rose },
  coverTocText: { fontSize: 8.5, color: C.grayLight, flex: 1 },
  coverBottom: { paddingHorizontal: 48, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between' },
  coverBottomL: { fontSize: 8, color: C.gray },
  coverBottomR: { fontSize: 8, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 1 },

  // Page header / footer
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  pageHeaderLogo: { fontSize: 10, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 2 },
  pageHeaderRight: { fontSize: 8.5, color: C.gray },
  footer: { position: 'absolute', bottom: 16, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7, borderTopWidth: 1, borderTopColor: C.border },
  footerL: { fontSize: 7.5, color: C.gray },
  footerR: { fontSize: 7.5, color: C.gold, fontFamily: 'Roboto', fontWeight: 700, letterSpacing: 1 },

  sectionLabel: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 700, color: C.rose, letterSpacing: 2, marginBottom: 12, marginTop: 2 },
  sectionLabelGold: { color: C.gold },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },

  // Intro
  introCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderLeftWidth: 3, borderLeftColor: C.rose, borderRadius: 10, padding: 14, marginBottom: 18 },
  introText: { fontSize: 9.5, color: C.text, lineHeight: 1.75 },

  // Two people side by side
  personsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  personCard: { flex: 1, borderRadius: 10, padding: 14, borderWidth: 1 },
  personCardP1: { backgroundColor: C.p1faint, borderColor: C.p1border },
  personCardP2: { backgroundColor: C.p2faint, borderColor: C.p2border },
  personName: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 10 },
  personNameP1: { color: C.p1 },
  personNameP2: { color: C.p2 },
  personDate: { fontSize: 8, color: C.gray, marginBottom: 10 },
  personNums: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  personNumItem: { flex: 1, alignItems: 'center', borderRadius: 7, paddingVertical: 7, borderWidth: 1 },
  personNumVal: { fontSize: 14, fontFamily: 'Roboto', fontWeight: 700 },
  personNumLbl: { fontSize: 6, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  // Mini matrix
  miniMatrixWrap: { marginTop: 10 },
  miniMatrixTitle: { fontSize: 6.5, color: C.gray, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  miniGrid: { flexDirection: 'column', gap: 3 },
  miniRow: { flexDirection: 'row', gap: 3 },
  miniCell: { flex: 1, backgroundColor: '#0D0E14', borderWidth: 1, borderColor: C.border, borderRadius: 5, paddingVertical: 5, alignItems: 'center', gap: 1 },
  miniCellHL: { borderColor: C.p1, backgroundColor: C.goldFaint },
  miniCellHLP2: { borderColor: C.p2, backgroundColor: C.p2faint },
  miniCellLabel: { fontSize: 5, color: C.gray, textTransform: 'uppercase' },
  miniCellValue: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 700, color: C.white },

  // Score overview
  scoreOverview: { alignItems: 'center', marginBottom: 18 },
  scoreBigCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C.rose, alignItems: 'center', justifyContent: 'center', backgroundColor: C.roseFaint, marginBottom: 8 },
  scoreBigNum: { fontSize: 36, fontFamily: 'Roboto', fontWeight: 700, color: C.white },
  scoreLevelText: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 700, color: C.rose, marginBottom: 4 },
  scoreLevelDesc: { fontSize: 9, color: C.grayLight, textAlign: 'center', maxWidth: 300 },

  // Sphere cards
  sphereCard: { borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1 },
  sphereHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sphereIconBox: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sphereIcon: { fontSize: 13 },
  sphereTitleWrap: { flex: 1 },
  sphereTitle: { fontSize: 10.5, fontFamily: 'Roboto', fontWeight: 700 },
  sphereScoreText: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 700, width: 38, textAlign: 'right' },
  barBg: { height: 5, backgroundColor: C.border, borderRadius: 3, marginBottom: 8 },
  barFill: { height: 5, borderRadius: 3 },
  sphereBody: { fontSize: 9, lineHeight: 1.75 },

  // Key numbers comparison
  keyNumRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  keyNumCard: { flex: 1, borderRadius: 9, padding: 12, borderWidth: 1 },
  keyNumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  keyNumLabel: { fontSize: 7, color: C.gray, textTransform: 'uppercase', letterSpacing: 1 },
  keyNumMatchBadge: { backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  keyNumMatchText: { fontSize: 6.5, color: C.gold, fontFamily: 'Roboto', fontWeight: 700 },
  keyNumVals: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  keyNumVal: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 700 },
  keyNumVsText: { fontSize: 10, color: C.gray },
  keyNumBody: { fontSize: 8.5, color: C.text, lineHeight: 1.7 },

  // Strengths / tensions
  listCard: { borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1 },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4, flexShrink: 0 },
  listText: { flex: 1, fontSize: 9.5, color: C.text, lineHeight: 1.7 },

  // Recommendations
  recCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 8 },
  recItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  recNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recNumText: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 700, color: C.gold },
  recText: { flex: 1, fontSize: 9.5, color: C.text, lineHeight: 1.7 },

  // Conclusion
  conclusionCard: { backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 12, padding: 20, marginBottom: 14 },
  conclusionTitle: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 700, color: C.rose, marginBottom: 10 },
  conclusionBody: { fontSize: 10, color: C.text, lineHeight: 1.82 },
  outroCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14 },
  outroText: { fontSize: 9, color: C.gray, lineHeight: 1.7, textAlign: 'center' },
});

// ─── Colour map for spheres ───────────────────────────────────────────────────
const SPHERE_COLORS = {
  rose:   { bg: C.roseFaint,   border: C.roseBorder,   icon: C.rose,   bar: C.rose,   text: '#E8B8D5' },
  amber:  { bg: C.amberFaint,  border: C.amberBorder,  icon: C.amber,  bar: C.amber,  text: '#E0C090' },
  blue:   { bg: C.blueFaint,   border: C.blueBorder,   icon: C.blue,   bar: C.blue,   text: '#A0C0E8' },
  green:  { bg: C.greenFaint,  border: C.greenBorder,  icon: C.green,  bar: C.green,  text: '#B0D090' },
  purple: { bg: C.purpleFaint, border: C.purpleBorder, icon: C.purple, bar: C.purple, text: '#C0A8E0' },
  teal:   { bg: C.tealFaint,   border: C.tealBorder,   icon: C.teal,   bar: C.teal,   text: '#90D0C8' },
};

const MINI_LAYOUT = [
  ['char','health','luck'], ['energy','logic','duty'], ['interest','labor','memory']
];
const MINI_LBL = { char:'Хар', health:'Здор', luck:'Удача', energy:'Энерг', logic:'Логика', duty:'Долг', interest:'Интер', labor:'Труд', memory:'Память' };

function MiniMatrix({ m, isP2 }) {
  return (
    <View style={s.miniMatrixWrap}>
      <Text style={s.miniMatrixTitle}>Матрица Пифагора</Text>
      <View style={s.miniGrid}>
        {MINI_LAYOUT.map((row, ri) => (
          <View key={ri} style={s.miniRow}>
            {row.map(key => {
              const cell = m[key];
              const hl = cell?.h;
              return (
                <View key={key} style={[s.miniCell, hl && (isP2 ? s.miniCellHLP2 : s.miniCellHL)]}>
                  <Text style={s.miniCellLabel}>{MINI_LBL[key]}</Text>
                  <Text style={s.miniCellValue}>{cell?.v || '—'}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

function PersonCard({ name, date, m, isP2 }) {
  const col = isP2 ? C.p2 : C.p1;
  const dateFmt = new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric' });
  const nums = [
    { l: 'Судьба', v: m.destiny }, { l: 'Душа', v: m.soul },
    { l: 'Карма', v: m.karma },   { l: 'Скрытое', v: m.hidden },
  ];
  return (
    <View style={[s.personCard, isP2 ? s.personCardP2 : s.personCardP1]}>
      <Text style={[s.personName, isP2 ? s.personNameP2 : s.personNameP1]}>{name || (isP2 ? 'Второй' : 'Первый')}</Text>
      <Text style={s.personDate}>{dateFmt}</Text>
      <View style={s.personNums}>
        {nums.map(({ l, v }) => (
          <View key={l} style={[s.personNumItem, { backgroundColor: isP2 ? C.p2faint : C.goldFaint, borderColor: isP2 ? C.p2border : C.goldBorder }]}>
            <Text style={[s.personNumVal, { color: col }]}>{v}</Text>
            <Text style={[s.personNumLbl, { color: isP2 ? '#4A7AAA' : '#8A6A2A' }]}>{l}</Text>
          </View>
        ))}
      </View>
      <MiniMatrix m={m} isP2={isP2} />
    </View>
  );
}

function PageHeader({ name1, name2 }) {
  return (
    <View style={s.pageHeader}>
      <Text style={s.pageHeaderLogo}>NUMEROS</Text>
      <Text style={s.pageHeaderRight}>{name1 || 'Первый'} & {name2 || 'Второй'} · Совместимость</Text>
    </View>
  );
}

function Footer({ name1, name2 }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerL}>{name1 || 'Первый'} & {name2 || 'Второй'} · numeros.kz</Text>
      <Text style={s.footerR}>NUMEROS.KZ</Text>
    </View>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function CompatibilityPDF({ name1, date1, m1, name2, date2, m2, score, analysis }) {
  const a = analysis ?? {};
  const spheres = a.spheres ?? [];
  const keyNums = a.keyNumbers ?? {};
  const strengths = a.strengths ?? [];
  const tensions = a.tensions ?? [];
  const recs = a.recommendations ?? [];
  const bestYears = a.bestYears ?? {};

  const levelLabel = score >= 85 ? 'Исключительная' : score >= 70 ? 'Высокая' : score >= 55 ? 'Хорошая' : 'Требует работы';
  const levelColor = score >= 85 ? C.gold : score >= 70 ? '#86efac' : score >= 55 ? C.blue : '#fca5a5';

  const n1 = name1 || 'Первый';
  const n2 = name2 || 'Второй';

  const toc = ['Матрицы и ключевые числа','Общий балл совместимости','Совместимость по 6 сферам','Ключевые числа — сравнение','Сильные стороны союза','Точки напряжения','Благоприятные периоды','Итог и рекомендации'];

  return (
    <Document title={`Совместимость: ${n1} & ${n2}`}>

      {/* ── Cover ─────────────────────────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.coverPage]}>
        <View style={s.coverTop}>
          <View style={s.coverLogoRow}>
            <View style={s.coverLogoDot}><Text style={s.coverLogoDotText}>N</Text></View>
            <Text style={s.coverLogoText}>NUMEROS</Text>
          </View>
          <View style={s.coverBadge}><Text style={s.coverBadgeText}>НУМЕРОЛОГИЧЕСКАЯ СОВМЕСТИМОСТЬ</Text></View>
          <View style={s.coverNamesRow}>
            <Text style={s.coverName1}>{n1}</Text>
            <Text style={s.coverHeart}>♡</Text>
            <Text style={s.coverName2}>{n2}</Text>
          </View>
          <Text style={s.coverTitle}>Персональный разбор совместимости</Text>
        </View>

        <View style={[s.coverScoreBlock, { borderColor: levelColor }]}>
          <View style={[s.coverScoreCircle, { borderColor: levelColor, backgroundColor: score >= 85 ? C.goldFaint : C.roseFaint }]}>
            <Text style={s.coverScoreNum}>{score}</Text>
          </View>
          <Text style={[s.coverScoreLabel, { color: levelColor }]}>{levelLabel} совместимость</Text>
          <Text style={s.coverScoreDesc}>{a.overallDesc || ''}</Text>
        </View>

        <View style={s.coverToc}>
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

      {/* ── Page 2: Intro + Matrices ──────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        {a.intro ? (
          <View wrap={false} style={s.introCard}>
            <Text style={s.introText}>{a.intro}</Text>
          </View>
        ) : null}

        <Text style={[s.sectionLabel, s.sectionLabelGold]}>◆  МАТРИЦЫ И КЛЮЧЕВЫЕ ЧИСЛА</Text>
        <View style={s.personsRow}>
          <PersonCard name={n1} date={date1} m={m1} isP2={false} />
          <PersonCard name={n2} date={date2} m={m2} isP2={true} />
        </View>

        {/* Score summary */}
        <View wrap={false} style={{ backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={[s.scoreBigCircle, { width: 72, height: 72, borderRadius: 36, borderColor: levelColor, backgroundColor: '#08090D' }]}>
              <Text style={[s.scoreBigNum, { fontSize: 26 }]}>{score}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Roboto', fontWeight: 700, color: levelColor, marginBottom: 4 }}>{levelLabel} совместимость</Text>
            <Text style={{ fontSize: 9, color: C.grayLight, lineHeight: 1.7 }}>{a.overallDesc || ''}</Text>
          </View>
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 3: Spheres ───────────────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />
        <Text style={s.sectionLabel}>◆  СОВМЕСТИМОСТЬ ПО 6 СФЕРАМ</Text>
        {spheres.map((sphere, i) => {
          const col = SPHERE_COLORS[sphere.color] ?? SPHERE_COLORS.rose;
          return (
            <View key={i} wrap={false} style={[s.sphereCard, { backgroundColor: col.bg, borderColor: col.border }]}>
              <View style={s.sphereHeader}>
                <View style={[s.sphereIconBox, { backgroundColor: C.dark }]}>
                  <Text style={[s.sphereIcon, { color: col.icon }]}>{sphere.icon}</Text>
                </View>
                <View style={s.sphereTitleWrap}>
                  <Text style={[s.sphereTitle, { color: col.icon }]}>{sphere.title}</Text>
                </View>
                <Text style={[s.sphereScoreText, { color: col.icon }]}>{sphere.score}%</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${sphere.score}%`, backgroundColor: col.bar }]} />
              </View>
              <Text style={[s.sphereBody, { color: col.text }]}>{sphere.content}</Text>
            </View>
          );
        })}
        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 4: Key numbers + Strengths/Tensions ─────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        {/* Key numbers */}
        <Text style={s.sectionLabel}>◆  КЛЮЧЕВЫЕ ЧИСЛА — СРАВНЕНИЕ</Text>
        {Object.entries(keyNums).map(([key, kn]) => {
          const labels = { destiny: 'Число судьбы', soul: 'Число души', karma: 'Число кармы' };
          return (
            <View key={key} wrap={false} style={[s.keyNumCard, { backgroundColor: kn.match ? C.goldFaint : C.card, borderColor: kn.match ? C.goldBorder : C.border, marginBottom: 8 }]}>
              <View style={s.keyNumHeader}>
                <Text style={s.keyNumLabel}>{labels[key] || key}</Text>
                {kn.match && <View style={s.keyNumMatchBadge}><Text style={s.keyNumMatchText}>★ Совпадение!</Text></View>}
              </View>
              <View style={s.keyNumVals}>
                <Text style={[s.keyNumVal, { color: C.p1 }]}>{kn.v1}</Text>
                <Text style={s.keyNumVsText}>{kn.match ? '=' : '/'}</Text>
                <Text style={[s.keyNumVal, { color: C.p2 }]}>{kn.v2}</Text>
              </View>
              <Text style={s.keyNumBody}>{kn.content}</Text>
            </View>
          );
        })}

        <View style={s.divider} />

        {/* Strengths */}
        <Text style={s.sectionLabel}>◆  СИЛЬНЫЕ СТОРОНЫ СОЮЗА</Text>
        <View wrap={false} style={[s.listCard, { backgroundColor: C.greenFaint, borderColor: C.greenBorder }]}>
          {strengths.map((item, i) => (
            <View key={i} style={s.listItem}>
              <View style={[s.listDot, { backgroundColor: C.green }]} />
              <Text style={[s.listText, { color: '#C0D8A0' }]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Tensions */}
        <Text style={s.sectionLabel}>◆  ТОЧКИ НАПРЯЖЕНИЯ</Text>
        <View wrap={false} style={[s.listCard, { backgroundColor: '#0F0A0A', borderColor: '#2A1010' }]}>
          {tensions.map((item, i) => (
            <View key={i} style={s.listItem}>
              <View style={[s.listDot, { backgroundColor: '#D46060' }]} />
              <Text style={[s.listText, { color: '#E0A8A8' }]}>{item}</Text>
            </View>
          ))}
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 5: Best years + Recommendations + Conclusion ────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        <Text style={s.sectionLabel}>◆  БЛАГОПРИЯТНЫЕ ПЕРИОДЫ</Text>
        <View wrap={false} style={[s.listCard, { backgroundColor: C.tealFaint, borderColor: C.tealBorder, marginBottom: 14 }]}>
          <Text style={{ fontSize: 9.5, color: '#A0D8D0', lineHeight: 1.78 }}>{bestYears.content}</Text>
        </View>

        <View style={s.divider} />

        <Text style={[s.sectionLabel, s.sectionLabelGold]}>◆  РЕКОМЕНДАЦИИ ПАРЕ</Text>
        <View wrap={false} style={s.recCard}>
          {recs.map((rec, i) => (
            <View key={i} style={s.recItem}>
              <View style={s.recNum}><Text style={s.recNumText}>{i + 1}</Text></View>
              <Text style={s.recText}>{rec}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        <Text style={[s.sectionLabel, s.sectionLabelGold]}>◆  ИТОГ</Text>
        <View wrap={false} style={s.conclusionCard}>
          <Text style={s.conclusionTitle}>♡  Ваш союз</Text>
          <Text style={s.conclusionBody}>{a.conclusion}</Text>
        </View>

        <View wrap={false} style={s.outroCard}>
          <Text style={s.outroText}>
            Разбор составлен по системе А.Ф. Александрова · Психоматрица Пифагора{'\n'}
            numeros.kz
          </Text>
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

    </Document>
  );
}
