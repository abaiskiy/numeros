import React from 'react';
import path from 'path';
import { readFileSync } from 'fs';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

const fontDir = path.join(process.cwd(), 'src/fonts');
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: `data:font/truetype;base64,${readFileSync(path.join(fontDir, 'Roboto-Regular.ttf')).toString('base64')}`,
      fontWeight: 'normal',
    },
    {
      src: `data:font/truetype;base64,${readFileSync(path.join(fontDir, 'Roboto-Bold.ttf')).toString('base64')}`,
      fontWeight: 'bold',
    },
  ],
});

const C = {
  gold: '#C9A84C', goldFaint: '#1C1A10', goldBorder: '#3A3218',
  dark: '#08090D', surface: '#0D0E14', card: '#12131A',
  border: '#21222C', gray: '#6B6C7E', grayLight: '#9B9CAD',
  white: '#FFFFFF', text: '#D0D1E0',
  p1: '#C9A84C', p1faint: '#1C1A10', p1border: '#3A3218',
  p2: '#5B9BD5', p2faint: '#0C1420', p2border: '#1E3050',
  rose: '#D48EC0', roseFaint: '#12080F', roseBorder: '#2A1025',
  green: '#8ABF5A', greenFaint: '#0C100A', greenBorder: '#1E2A12',
  teal: '#3ABFB3', tealFaint: '#080F0E', tealBorder: '#102A28',
  purple: '#9B7FCA', purpleFaint: '#0D0B14', purpleBorder: '#221840',
  amber: '#D4A03A', amberFaint: '#120D06', amberBorder: '#2A2010',
  blue: '#5B9BD5', blueFaint: '#080E16', blueBorder: '#182035',
};

const s = StyleSheet.create({
  page: { backgroundColor: C.surface, fontFamily: 'Roboto', fontWeight: 'normal', fontSize: 10, color: C.text, lineHeight: 1.6 },
  coverPage: { backgroundColor: C.dark, padding: 0 },
  contentPage: { padding: 40, paddingTop: 32, paddingBottom: 44 },

  // Cover
  coverTop: { padding: 36, paddingBottom: 0 },
  coverLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 48 },
  coverLogoDot: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: C.gold, backgroundColor: C.goldFaint, alignItems: 'center', justifyContent: 'center' },
  coverLogoDotText: { fontSize: 15, color: C.gold, fontFamily: 'Roboto', fontWeight: 'bold', lineHeight: 1, textAlign: 'center' },
  coverLogoText: { fontSize: 17, fontFamily: 'Roboto', fontWeight: 'bold', color: C.gold, letterSpacing: 3 },
  coverBadge: { alignSelf: 'flex-start', backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 20, paddingHorizontal: 12, height: 18, justifyContent: 'center', marginBottom: 32 },
  coverBadgeText: { fontSize: 7.5, color: C.rose, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2, textAlign: 'center', lineHeight: 1 },
  coverNamesRow: { flexDirection: 'row', alignItems: 'center', gap: 0, marginBottom: 16 },
  coverName1: { flex: 1, fontSize: 26, fontFamily: 'Roboto', fontWeight: 'bold', color: C.p1, lineHeight: 1.2 },
  coverHeart: { fontSize: 22, color: C.rose, paddingHorizontal: 12 },
  coverName2: { flex: 1, fontSize: 26, fontFamily: 'Roboto', fontWeight: 'bold', color: C.p2, lineHeight: 1.2, textAlign: 'right' },
  coverTitle: { fontSize: 12, color: C.grayLight, marginBottom: 48 },
  coverScoreBlock: { alignItems: 'center', paddingVertical: 28, borderTopWidth: 1, borderTopColor: C.border },
  coverScoreCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C.rose, alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: C.roseFaint },
  coverScoreNum: { fontSize: 38, fontFamily: 'Roboto', fontWeight: 'bold', color: C.white, lineHeight: 1, textAlign: 'center' },
  coverScoreLabel: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', color: C.rose, marginBottom: 6 },
  coverScoreDesc: { fontSize: 8.5, color: C.grayLight, textAlign: 'center', maxWidth: 280 },
  coverToc: { padding: 32, paddingTop: 0, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  coverTocItem: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '47%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  coverTocNum: { width: 15, height: 15, borderRadius: 8, backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, alignItems: 'center', justifyContent: 'center' },
  coverTocNumText: { fontSize: 6.5, fontFamily: 'Roboto', fontWeight: 'bold', color: C.rose, lineHeight: 1, textAlign: 'center' },
  coverTocText: { fontSize: 7.5, color: C.grayLight, flex: 1 },
  coverBottom: { paddingHorizontal: 48, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between' },
  coverBottomL: { fontSize: 8, color: C.gray },
  coverBottomR: { fontSize: 8, color: C.gold, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1 },

  // Page header / footer
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  pageHeaderLogo: { fontSize: 10, color: C.gold, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2 },
  pageHeaderRight: { fontSize: 8.5, color: C.gray },
  footer: { position: 'absolute', bottom: 16, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 7, borderTopWidth: 1, borderTopColor: C.border },
  footerL: { fontSize: 7.5, color: C.gray },
  footerR: { fontSize: 7.5, color: C.gold, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 1 },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12, marginTop: 2 },
  sectionLabelBar: { width: 3, height: 7, borderRadius: 2 },
  sectionLabelText: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 'bold', letterSpacing: 2, lineHeight: 1 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },

  // Intro
  introCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderLeftWidth: 3, borderLeftColor: C.rose, borderRadius: 10, padding: 10, marginBottom: 12 },
  introText: { fontSize: 9, color: C.text, lineHeight: 1.65 },

  // Two people side by side
  personsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  personCard: { flex: 1, borderRadius: 10, padding: 10, borderWidth: 1 },
  personCardP1: { backgroundColor: C.p1faint, borderColor: C.p1border },
  personCardP2: { backgroundColor: C.p2faint, borderColor: C.p2border },
  personName: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 6 },
  personNameP1: { color: C.p1 },
  personNameP2: { color: C.p2 },
  personDate: { fontSize: 7.5, color: C.gray, marginBottom: 7 },
  personNums: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  personNumItem: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6, paddingVertical: 5, borderWidth: 1 },
  personNumVal: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', lineHeight: 1, textAlign: 'center' },
  personNumLbl: { fontSize: 5.5, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  // Mini matrix
  miniMatrixWrap: { marginTop: 8 },
  miniMatrixTitle: { fontSize: 6, color: C.gray, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  miniGrid: { flexDirection: 'column', gap: 2 },
  miniRow: { flexDirection: 'row', gap: 2 },
  miniCell: { flex: 1, backgroundColor: '#0D0E14', borderWidth: 1, borderColor: C.border, borderRadius: 4, paddingVertical: 4, alignItems: 'center', justifyContent: 'center', gap: 1 },
  miniCellHL: { borderColor: C.p1, backgroundColor: C.goldFaint },
  miniCellHLP2: { borderColor: C.p2, backgroundColor: C.p2faint },
  miniCellLabel: { fontSize: 5, color: C.gray, textTransform: 'uppercase' },
  miniCellValue: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: C.white, lineHeight: 1, textAlign: 'center' },

  // Score overview
  scoreOverview: { alignItems: 'center', marginBottom: 18 },
  scoreBigCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C.rose, alignItems: 'center', justifyContent: 'center', backgroundColor: C.roseFaint, marginBottom: 8 },
  scoreBigNum: { fontSize: 36, fontFamily: 'Roboto', fontWeight: 'bold', color: C.white, lineHeight: 1, textAlign: 'center' },
  scoreLevelText: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 'bold', color: C.rose, marginBottom: 4 },
  scoreLevelDesc: { fontSize: 9, color: C.grayLight, textAlign: 'center', maxWidth: 300 },

  // Sphere cards
  sphereCard: { borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1 },
  sphereHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sphereIconBox: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  sphereIcon: { fontSize: 13 },
  sphereTitleWrap: { flex: 1 },
  sphereTitle: { fontSize: 10.5, fontFamily: 'Roboto', fontWeight: 'bold' },
  sphereScoreText: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', width: 38, textAlign: 'right' },
  barBg: { height: 5, backgroundColor: C.border, borderRadius: 3, marginBottom: 8 },
  barFill: { height: 5, borderRadius: 3 },
  sphereBody: { fontSize: 9, lineHeight: 1.75 },

  // Key numbers comparison
  keyNumRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  keyNumCard: { flex: 1, borderRadius: 9, padding: 12, borderWidth: 1 },
  keyNumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  keyNumLabel: { fontSize: 7, color: C.gray, textTransform: 'uppercase', letterSpacing: 1 },
  keyNumMatchBadge: { backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 8, paddingHorizontal: 6, height: 14, justifyContent: 'center' },
  keyNumMatchText: { fontSize: 6.5, color: C.gold, fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', lineHeight: 1 },
  keyNumVals: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  keyNumVal: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold' },
  keyNumVsText: { fontSize: 10, color: C.gray },
  keyNumBody: { fontSize: 8.5, color: C.text, lineHeight: 1.7 },

  // List cards (strengths/tensions/flags)
  listCard: { borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1 },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4, flexShrink: 0 },
  listText: { flex: 1, fontSize: 9.5, color: C.text, lineHeight: 1.7 },

  // Green flags / danger signals side by side
  flagsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  flagsCol: { flex: 1, borderRadius: 10, padding: 13, borderWidth: 1 },
  flagsColTitle: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  flagItem: { flexDirection: 'row', gap: 7, marginBottom: 7 },
  flagBullet: { width: 5, height: 5, borderRadius: 3, marginTop: 4, flexShrink: 0 },
  flagText: { flex: 1, fontSize: 9, lineHeight: 1.65 },

  // Love languages
  loveCard: { backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 11, padding: 15, marginBottom: 10 },
  loveRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  lovePersonCol: { flex: 1, backgroundColor: '#0D070B', borderWidth: 1, borderRadius: 9, padding: 12 },
  lovePrimaryBadge: { borderRadius: 8, paddingHorizontal: 8, height: 17, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 6 },
  lovePrimaryText: { fontSize: 8, fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', lineHeight: 1 },
  lovePersonName: { fontSize: 9, fontFamily: 'Roboto', fontWeight: 'bold', marginBottom: 5 },
  loveDesc: { fontSize: 9, color: C.grayLight, lineHeight: 1.65 },
  loveCompatNote: { fontSize: 9, color: '#E8B8D5', lineHeight: 1.7, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.roseBorder },

  // Personal years comparison
  pyCompCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 10 },
  pyCompRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
  pyCompRowLast: { borderBottomWidth: 0 },
  pyCompYear: { fontSize: 8.5, color: C.gray, width: 36, fontFamily: 'Roboto', fontWeight: 'bold' },
  pyCompCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pyCompNum: { fontSize: 10, fontFamily: 'Roboto', fontWeight: 'bold', lineHeight: 1, textAlign: 'center' },
  pyCompMid: { flex: 1, paddingHorizontal: 8 },
  pyCompMatch: { fontSize: 7.5, color: C.grayLight, lineHeight: 1.5 },
  pyCompNote: { fontSize: 9, color: C.grayLight, lineHeight: 1.65, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border },

  // Recommendations
  recCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 8 },
  recItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  recNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recNumText: { fontSize: 7, fontFamily: 'Roboto', fontWeight: 'bold', color: C.gold, lineHeight: 1, textAlign: 'center' },
  recText: { flex: 1, fontSize: 9.5, color: C.text, lineHeight: 1.7 },

  // Favorable dates
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dateCard: { width: '31%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 9 },
  dateCardSpecial: { backgroundColor: C.goldFaint, borderColor: C.goldBorder },
  dateNum: { fontSize: 18, fontFamily: 'Roboto', fontWeight: 'bold', color: C.gold, lineHeight: 1, textAlign: 'center', marginBottom: 3 },
  dateNumSpecial: { color: C.gold },
  dateDateText: { fontSize: 8.5, fontFamily: 'Roboto', fontWeight: 'bold', color: C.white, textAlign: 'center', marginBottom: 3 },
  dateLabelText: { fontSize: 7, color: C.gold, textAlign: 'center', marginBottom: 4 },
  dateTipText: { fontSize: 6.5, color: C.gray, lineHeight: 1.5, textAlign: 'center' },
  coupleNumNote: { backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 8, padding: 10, marginBottom: 10 },
  coupleNumNoteText: { fontSize: 8.5, color: '#E8B8D5', lineHeight: 1.65, textAlign: 'center' },

  // QR
  qrSection: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 10 },
  qrImage: { width: 60, height: 60, flexShrink: 0 },
  qrTextBlock: { flex: 1 },
  qrSiteText: { fontSize: 11, fontFamily: 'Roboto', fontWeight: 'bold', color: C.gold, marginBottom: 3 },
  qrDescText: { fontSize: 8.5, color: C.grayLight, lineHeight: 1.65 },

  // Conclusion
  conclusionCard: { backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 12, padding: 20, marginBottom: 14 },
  conclusionTitle: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', color: C.rose, marginBottom: 10 },
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
    { l: 'Карма', v: m.karma },   { l: 'Потенциал', v: m.hidden },
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

function SectionLabel({ text, gold }) {
  const color = gold ? C.gold : C.rose;
  return (
    <View style={s.sectionLabelRow}>
      <View style={[s.sectionLabelBar, { backgroundColor: color }]} />
      <Text style={[s.sectionLabelText, { color }]}>{text}</Text>
    </View>
  );
}

// ─── Love Languages ───────────────────────────────────────────────────────────
function LoveLanguagesSection({ loveLanguages, n1, n2 }) {
  if (!loveLanguages) return null;
  const { person1, person2, compatibility } = loveLanguages;
  return (
    <View wrap={false} style={s.loveCard}>
      <View style={s.loveRow}>
        <View style={[s.lovePersonCol, { borderColor: C.p1border }]}>
          <Text style={[s.lovePersonName, { color: C.p1 }]}>{n1}</Text>
          {person1?.primary ? (
            <View style={[s.lovePrimaryBadge, { backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder }]}>
              <Text style={[s.lovePrimaryText, { color: C.gold }]}>{person1.primary}</Text>
            </View>
          ) : null}
          <Text style={s.loveDesc}>{person1?.description || ''}</Text>
        </View>
        <View style={[s.lovePersonCol, { borderColor: C.p2border }]}>
          <Text style={[s.lovePersonName, { color: C.p2 }]}>{n2}</Text>
          {person2?.primary ? (
            <View style={[s.lovePrimaryBadge, { backgroundColor: C.p2faint, borderWidth: 1, borderColor: C.p2border }]}>
              <Text style={[s.lovePrimaryText, { color: C.p2 }]}>{person2.primary}</Text>
            </View>
          ) : null}
          <Text style={s.loveDesc}>{person2?.description || ''}</Text>
        </View>
      </View>
      {compatibility ? (
        <Text style={s.loveCompatNote}>♡  {compatibility}</Text>
      ) : null}
    </View>
  );
}

// ─── Green Flags / Danger Signals ────────────────────────────────────────────
function FlagsSection({ greenFlags, dangerSignals }) {
  return (
    <View wrap={false} style={s.flagsRow}>
      <View style={[s.flagsCol, { backgroundColor: C.greenFaint, borderColor: C.greenBorder }]}>
        <Text style={[s.flagsColTitle, { color: C.green }]}>Зелёные флаги</Text>
        {(greenFlags || []).map((item, i) => (
          <View key={i} style={s.flagItem}>
            <View style={[s.flagBullet, { backgroundColor: C.green }]} />
            <Text style={[s.flagText, { color: '#B0D090' }]}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={[s.flagsCol, { backgroundColor: '#0F0A0A', borderColor: '#2A1515' }]}>
        <Text style={[s.flagsColTitle, { color: '#D46060' }]}>Сигналы внимания</Text>
        {(dangerSignals || []).map((item, i) => (
          <View key={i} style={s.flagItem}>
            <View style={[s.flagBullet, { backgroundColor: '#D46060' }]} />
            <Text style={[s.flagText, { color: '#E0A0A0' }]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Personal years comparison ────────────────────────────────────────────────
function PersonalYearsComparison({ py1, py2, n1, n2, note }) {
  if (!py1 || !py2) return null;
  const curYear = new Date().getFullYear();
  return (
    <View wrap={false} style={s.pyCompCard}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={{ width: 36 }} />
        <Text style={{ flex: 1, fontSize: 7, color: C.p1, fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>{n1}</Text>
        <Text style={{ flex: 1, fontSize: 7, color: C.p2, fontFamily: 'Roboto', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>{n2}</Text>
        <View style={{ flex: 2 }} />
      </View>
      {py1.map((y, i) => {
        const y2 = py2[i];
        const match = y2 && y.personalYear === y2.personalYear;
        return (
          <View key={i} style={[s.pyCompRow, i === py1.length - 1 && s.pyCompRowLast, y.year === curYear && { backgroundColor: C.goldFaint + '80' }]}>
            <Text style={[s.pyCompYear, y.year === curYear && { color: C.gold }]}>{y.year}</Text>
            <View style={[s.pyCompCircle, { backgroundColor: C.p1faint, borderColor: C.p1border }]}>
              <Text style={[s.pyCompNum, { color: C.p1 }]}>{y.personalYear}</Text>
            </View>
            <View style={[s.pyCompCircle, { backgroundColor: C.p2faint, borderColor: C.p2border }]}>
              <Text style={[s.pyCompNum, { color: C.p2 }]}>{y2?.personalYear ?? '?'}</Text>
            </View>
            <View style={s.pyCompMid}>
              {match && <Text style={{ fontSize: 7, color: C.gold, fontFamily: 'Roboto', fontWeight: 'bold' }}>= Совпадение!</Text>}
            </View>
            <View style={{ flex: 3 }}>
              <Text style={s.pyCompMatch} numberOfLines={2}>{y.meaning}</Text>
            </View>
          </View>
        );
      })}
      {note ? <Text style={s.pyCompNote}>{note}</Text> : null}
    </View>
  );
}

// ─── Favorable dates ──────────────────────────────────────────────────────────
function FavorableDatesSection({ dates, coupleNum }) {
  if (!dates || dates.length === 0) return null;
  return (
    <View>
      {coupleNum ? (
        <View style={s.coupleNumNote}>
          <Text style={s.coupleNumNoteText}>
            Число вашей пары — {coupleNum}. Дни, отмеченные золотом, особенно сильны для вас двоих.
          </Text>
        </View>
      ) : null}
      <View style={s.datesGrid}>
        {dates.map((d, i) => (
          <View key={i} style={[s.dateCard, d.special && s.dateCardSpecial]}>
            <Text style={[s.dateNum, d.special && s.dateNumSpecial]}>{d.dayNum}</Text>
            <Text style={s.dateDateText}>{d.date}</Text>
            <Text style={s.dateLabelText}>{d.label}</Text>
            <Text style={s.dateTipText}>{d.tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── QR section ───────────────────────────────────────────────────────────────
function QRSection({ qrDataUrl }) {
  return (
    <View wrap={false} style={s.qrSection}>
      {qrDataUrl ? <Image src={qrDataUrl} style={s.qrImage} /> : null}
      <View style={s.qrTextBlock}>
        <Text style={s.qrSiteText}>numeros.kz</Text>
        <Text style={s.qrDescText}>
          Закажите персональный нумерологический разбор или подарите его близкому человеку
        </Text>
      </View>
    </View>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function CompatibilityPDF({ name1, date1, m1, name2, date2, m2, score, analysis, extras }) {
  const a = analysis ?? {};
  const spheres      = a.spheres ?? [];
  const keyNums      = a.keyNumbers ?? {};
  const strengths    = a.strengths ?? [];
  const tensions     = a.tensions ?? [];
  const recs         = a.recommendations ?? [];
  const bestYears    = a.bestYears ?? {};
  const loveLanguages = a.loveLanguages ?? null;
  const greenFlags    = a.greenFlags ?? [];
  const dangerSignals = a.dangerSignals ?? [];
  const personalYearNote = a.personalYearNote ?? '';

  const py1           = extras?.personalYears1  ?? [];
  const py2           = extras?.personalYears2  ?? [];
  const qrDataUrl     = extras?.qrDataUrl       ?? null;
  const favorableDates = extras?.favorableDates ?? [];
  const coupleNum     = extras?.coupleNum       ?? null;

  const levelLabel = score >= 85 ? 'Исключительная' : score >= 70 ? 'Высокая' : score >= 55 ? 'Хорошая' : 'Требует работы';
  const levelColor = score >= 85 ? C.gold : score >= 70 ? '#86efac' : score >= 55 ? C.blue : '#fca5a5';

  const n1 = name1 || 'Первый';
  const n2 = name2 || 'Второй';

  const toc = [
    'Матрицы и ключевые числа',
    'Общий балл совместимости',
    'Совместимость по 6 сферам',
    'Языки любви',
    'Зелёные флаги и сигналы',
    'Ключевые числа — сравнение',
    'Сильные стороны союза',
    'Личные годы пары',
    'Благоприятные периоды',
    'Благоприятные даты',
    'Рекомендации и итог',
  ];

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
            <Text style={[s.coverHeart, { fontFamily: 'Roboto', fontWeight: 'bold' }]}>&</Text>
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
          <Text style={s.coverBottomL}>numeros.kz · Психоматрица Пифагора</Text>
          <Text style={s.coverBottomR}>NUMEROS.KZ</Text>
        </View>
      </Page>

      {/* ── Page 2: Intro + Matrices + Score ──────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        {a.intro ? (
          <View wrap={false} style={s.introCard}>
            <Text style={s.introText}>{a.intro}</Text>
          </View>
        ) : null}

        <View wrap={false}>
          <SectionLabel text="МАТРИЦЫ И КЛЮЧЕВЫЕ ЧИСЛА" gold />
          <View style={s.personsRow}>
            <PersonCard name={n1} date={date1} m={m1} isP2={false} />
            <PersonCard name={n2} date={date2} m={m2} isP2={true} />
          </View>
        </View>

        <View wrap={false} style={{ backgroundColor: C.roseFaint, borderWidth: 1, borderColor: C.roseBorder, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <View style={[s.scoreBigCircle, { width: 72, height: 72, borderRadius: 36, borderColor: levelColor, backgroundColor: '#08090D' }]}>
              <Text style={[s.scoreBigNum, { fontSize: 26 }]}>{score}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Roboto', fontWeight: 'bold', color: levelColor, marginBottom: 4 }}>{levelLabel} совместимость</Text>
            <Text style={{ fontSize: 9, color: C.grayLight, lineHeight: 1.7 }}>{a.overallDesc || ''}</Text>
          </View>
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 3: Spheres ───────────────────────────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />
        <SectionLabel text="СОВМЕСТИМОСТЬ ПО 6 СФЕРАМ" />
        {spheres.map((sphere, i) => {
          const col = SPHERE_COLORS[sphere.color] ?? SPHERE_COLORS.rose;
          return (
            <View key={i} wrap={false} style={[s.sphereCard, { backgroundColor: col.bg, borderColor: col.border }]}>
              <View style={s.sphereHeader}>
                <View style={[s.sphereIconBox, { backgroundColor: C.dark, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={[s.sphereIcon, { color: col.icon, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 11, lineHeight: 1, textAlign: 'center' }]}>{sphere.icon}</Text>
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

      {/* ── Page 4: Love Languages + Green Flags ──────────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        <View wrap={false}>
          <SectionLabel text="ЯЗЫКИ ЛЮБВИ" />
          <LoveLanguagesSection loveLanguages={loveLanguages} n1={n1} n2={n2} />
        </View>

        <View style={s.divider} />

        <View wrap={false}>
          <SectionLabel text="ЗЕЛЁНЫЕ ФЛАГИ И СИГНАЛЫ ВНИМАНИЯ" />
          <FlagsSection greenFlags={greenFlags} dangerSignals={dangerSignals} />
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 5: Key numbers + Strengths/Tensions ─────────────────────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        <SectionLabel text="КЛЮЧЕВЫЕ ЧИСЛА — СРАВНЕНИЕ" />
        {Object.entries(keyNums).map(([key, kn]) => {
          const labels = { destiny: 'Число судьбы', soul: 'Число души', karma: 'Число кармы' };
          return (
            <View key={key} wrap={false} style={[s.keyNumCard, { backgroundColor: kn.match ? C.goldFaint : C.card, borderColor: kn.match ? C.goldBorder : C.border, marginBottom: 8 }]}>
              <View style={s.keyNumHeader}>
                <Text style={s.keyNumLabel}>{labels[key] || key}</Text>
                {kn.match && <View style={s.keyNumMatchBadge}><Text style={s.keyNumMatchText}>= Совпадение!</Text></View>}
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

        <View wrap={false}>
          <SectionLabel text="СИЛЬНЫЕ СТОРОНЫ СОЮЗА" />
          <View style={[s.listCard, { backgroundColor: C.greenFaint, borderColor: C.greenBorder }]}>
            {strengths.map((item, i) => (
              <View key={i} style={s.listItem}>
                <View style={[s.listDot, { backgroundColor: C.green }]} />
                <Text style={[s.listText, { color: '#C0D8A0' }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.divider} />

        <View wrap={false}>
          <SectionLabel text="ТОЧКИ НАПРЯЖЕНИЯ" />
          <View style={[s.listCard, { backgroundColor: '#0F0A0A', borderColor: '#2A1010' }]}>
            {tensions.map((item, i) => (
              <View key={i} style={s.listItem}>
                <View style={[s.listDot, { backgroundColor: '#D46060' }]} />
                <Text style={[s.listText, { color: '#E0A8A8' }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 6: Personal Years + Best Years + Recs + Conclusion ──────── */}
      <Page size="A4" style={[s.page, s.contentPage]}>
        <PageHeader name1={n1} name2={n2} />

        {py1.length > 0 && (
          <>
            <View wrap={false}>
              <SectionLabel text="ЛИЧНЫЕ ГОДЫ ПАРЫ" />
              <PersonalYearsComparison py1={py1} py2={py2} n1={n1} n2={n2} note={personalYearNote} />
            </View>
            <View style={s.divider} />
          </>
        )}

        <View wrap={false}>
          <SectionLabel text="БЛАГОПРИЯТНЫЕ ПЕРИОДЫ" />
          <View style={[s.listCard, { backgroundColor: C.tealFaint, borderColor: C.tealBorder, marginBottom: 14 }]}>
            <Text style={{ fontSize: 9.5, color: '#A0D8D0', lineHeight: 1.78 }}>{bestYears.content}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View wrap={false}>
          <SectionLabel text="РЕКОМЕНДАЦИИ ПАРЕ" gold />
          <View style={s.recCard}>
            {recs.map((rec, i) => (
              <View key={i} style={s.recItem}>
                <View style={s.recNum}><Text style={s.recNumText}>{i + 1}</Text></View>
                <Text style={s.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.divider} />

        <View wrap={false} style={s.conclusionCard}>
          <SectionLabel text="ИТОГ" gold />
          <Text style={s.conclusionTitle}>Ваш союз</Text>
          <Text style={s.conclusionBody}>{a.conclusion}</Text>
        </View>

        <Footer name1={n1} name2={n2} />
      </Page>

      {/* ── Page 7: Favorable dates ────────────────────────────────────────── */}
      {favorableDates.length > 0 && (
        <Page size="A4" style={[s.page, s.contentPage]}>
          <PageHeader name1={n1} name2={n2} />

          <View wrap={false}>
            <SectionLabel text="БЛАГОПРИЯТНЫЕ ДАТЫ ДЛЯ ПАРЫ" gold />
            <FavorableDatesSection dates={favorableDates} coupleNum={coupleNum} />
          </View>

          <View wrap={false} style={[s.outroCard, { marginTop: 16 }]}>
            <Text style={s.outroText}>
              Разбор составлен по системе психоматрицы Пифагора{'\n'}
              numeros.kz
            </Text>
          </View>

          <QRSection qrDataUrl={qrDataUrl} />

          <Footer name1={n1} name2={n2} />
        </Page>
      )}

    </Document>
  );
}
