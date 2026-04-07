import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 700 },
  ],
});

const GOLD  = '#C9A84C';
const DARK  = '#0D0E14';
const CARD  = '#14151C';
const BORDER = '#2A2B35';
const GRAY  = '#888899';

const s = StyleSheet.create({
  page: {
    backgroundColor: DARK,
    fontFamily: 'Inter',
    padding: 40,
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 1.5,
  },

  // Header
  header: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logo: { fontSize: 18, fontWeight: 700, color: GOLD, letterSpacing: 2 },
  headerSub: { fontSize: 8, color: GRAY },

  // Title block
  titleBlock: { marginBottom: 24 },
  name: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: GRAY },

  // Key numbers row
  keyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  keyCard: {
    flex: 1,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  keyLabel: { fontSize: 7, color: GRAY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  keyValue: { fontSize: 20, fontWeight: 700, color: GOLD },

  // Matrix grid
  matrixSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 10, letterSpacing: 0.5 },
  grid: { flexDirection: 'column', gap: 4 },
  gridRow: { flexDirection: 'row', gap: 4 },
  cell: {
    flex: 1,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  cellHighlight: {
    borderColor: GOLD,
    backgroundColor: '#1C1A0F',
  },
  cellLabel: { fontSize: 6, color: GRAY, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  cellValue: { fontSize: 14, fontWeight: 700 },
  cellValueHL: { color: GOLD },

  // Analysis sections
  analysisSection: { marginBottom: 20 },
  analysisCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  analysisTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6 },
  analysisTitleGold: { color: GOLD },
  analysisText: { fontSize: 9, color: '#C8C8D8', lineHeight: 1.7 },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: GRAY },
  footerBrand: { fontSize: 8, color: GOLD, fontWeight: 700 },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 16 },
});

const CELL_LABELS = {
  char: 'Характер', energy: 'Энергия', interest: 'Самооценка',
  health: 'Здоровье', logic: 'Логика', labor: 'Труд',
  luck: 'Удача', duty: 'Долг', memory: 'Память',
};

function MatrixGrid({ matrix }) {
  const rows = [
    ['char', 'health', 'luck'],
    ['energy', 'logic', 'duty'],
    ['interest', 'labor', 'memory'],
  ];

  return (
    <View style={s.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={s.gridRow}>
          {row.map((key) => {
            const cell = matrix[key];
            const highlight = cell?.h;
            return (
              <View key={key} style={[s.cell, highlight && s.cellHighlight]}>
                <Text style={s.cellLabel}>{CELL_LABELS[key]}</Text>
                <Text style={[s.cellValue, highlight && s.cellValueHL]}>
                  {cell?.v || '—'}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function NumerologyPDF({ name, birthDate, matrix, analysis }) {
  const dateFormatted = new Date(birthDate + 'T00:00:00')
    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const sections = analysis?.sections ?? [];
  const conclusion = analysis?.conclusion ?? '';

  return (
    <Document title={`Нумерологический разбор — ${name}`}>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>NUMEROS</Text>
          <Text style={s.headerSub}>numeros.kz</Text>
        </View>

        {/* Person info */}
        <View style={s.titleBlock}>
          <Text style={s.name}>{name}</Text>
          <Text style={s.subtitle}>Дата рождения: {dateFormatted} · Нумерологический разбор</Text>
        </View>

        {/* Key numbers */}
        <View style={s.keyRow}>
          {[
            { label: 'Число судьбы', value: matrix.destiny },
            { label: 'Число души',   value: matrix.soul    },
            { label: 'Число кармы',  value: matrix.karma   },
            { label: 'Скрытое',      value: matrix.hidden  },
          ].map(({ label, value }) => (
            <View key={label} style={s.keyCard}>
              <Text style={s.keyLabel}>{label}</Text>
              <Text style={s.keyValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Matrix */}
        <View style={s.matrixSection}>
          <Text style={s.sectionTitle}>Психоматрица Пифагора</Text>
          <MatrixGrid matrix={matrix} />
        </View>

        <View style={s.divider} />

        {/* Analysis */}
        <View style={s.analysisSection}>
          <Text style={s.sectionTitle}>Персональный разбор</Text>
          {sections.map((sec, i) => (
            <View key={i} style={s.analysisCard}>
              <Text style={[s.analysisTitle, sec.highlight && s.analysisTitleGold]}>
                {sec.title}
              </Text>
              <Text style={s.analysisText}>{sec.content}</Text>
            </View>
          ))}
        </View>

        {conclusion ? (
          <View style={[s.analysisCard, { borderColor: GOLD + '60' }]}>
            <Text style={[s.analysisTitle, s.analysisTitleGold]}>Итог</Text>
            <Text style={s.analysisText}>{conclusion}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            Составлено {new Date().toLocaleDateString('ru-RU')} · Система нумерологии Александрова
          </Text>
          <Text style={s.footerBrand}>NUMEROS.KZ</Text>
        </View>

      </Page>
    </Document>
  );
}
