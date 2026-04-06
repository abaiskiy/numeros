import {
  Document, Page, Text, View, StyleSheet, Font, Svg,
  Rect, G, Line,
} from '@react-pdf/renderer';
import { BOOK, PDF_SECTIONS } from '@/data/numerology-book.js';

// Регистрируем шрифт (встроенный Helvetica как fallback — заменить на Manrope при наличии файлов)
Font.registerHyphenationCallback(word => [word]);

// ─── Цвета (в стиле сайта) ────────────────────────────────────────────────────
const C = {
  bg:        '#08090D',
  bgCard:    '#0D0E14',
  bgCard2:   '#111218',
  gold:      '#D4AF37',
  goldLight: '#E8C84A',
  goldDim:   'rgba(212,175,55,0.15)',
  white:     '#FFFFFF',
  gray1:     '#E5E7EB',
  gray2:     '#9CA3AF',
  gray3:     '#4B5563',
  gray4:     '#1F2937',
  border:    'rgba(255,255,255,0.08)',
  borderGold:'rgba(212,175,55,0.3)',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    padding: 0,
    fontFamily: 'Helvetica',
  },

  // ─── Обложка ──────────────────────────────────────────────────────────────
  coverPage: {
    backgroundColor: C.bg,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  coverBadge: {
    backgroundColor: C.goldDim,
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 32,
  },
  coverBadgeText: {
    color: C.gold,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  coverTitle: {
    color: C.white,
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  coverSubtitle: {
    color: C.gold,
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  coverDate: {
    color: C.gray2,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 2,
  },
  coverDivider: {
    width: 80,
    height: 1,
    backgroundColor: C.gold,
    marginBottom: 48,
    opacity: 0.5,
  },
  coverDescription: {
    color: C.gray2,
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 380,
    lineHeight: 1.7,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    color: C.gray3,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // ─── Оглавление ──────────────────────────────────────────────────────────
  tocPage: {
    backgroundColor: C.bg,
    flex: 1,
    padding: 48,
  },
  tocTitle: {
    color: C.gold,
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  tocHeading: {
    color: C.white,
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tocNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.goldDim,
    borderWidth: 1,
    borderColor: C.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tocNumberText: {
    color: C.gold,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  tocItemTitle: {
    color: C.white,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  tocItemPage: {
    color: C.gray3,
    fontSize: 10,
  },

  // ─── Общая страница ───────────────────────────────────────────────────────
  contentPage: {
    backgroundColor: C.bg,
    flex: 1,
    padding: 48,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pageHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginRight: 10,
  },
  pageHeaderText: {
    color: C.gray3,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    color: C.gold,
    fontSize: 9,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTitle: {
    color: C.white,
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  sectionText: {
    color: C.gray1,
    fontSize: 11,
    lineHeight: 1.8,
    marginBottom: 24,
  },

  // ─── Матрица ──────────────────────────────────────────────────────────────
  matrixContainer: {
    marginVertical: 20,
  },
  matrixLabel: {
    color: C.gold,
    fontSize: 9,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 16,
    textAlign: 'center',
  },
  // Дополнительные числа
  keyNumbersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  keyNumberCard: {
    flex: 1,
    backgroundColor: C.goldDim,
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  keyNumberValue: {
    color: C.white,
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  keyNumberLabel: {
    color: C.gold,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Сетка 3×3 + правая колонка
  matrixGrid: {
    flexDirection: 'column',
    gap: 6,
  },
  matrixRow: {
    flexDirection: 'row',
    gap: 6,
  },
  matrixCell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    minHeight: 64,
  },
  matrixCellHighlight: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderColor: C.borderGold,
  },
  matrixCellSide: {
    backgroundColor: C.bgCard2,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  matrixCellLabel: {
    color: C.gray3,
    fontSize: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  matrixCellValue: {
    color: C.white,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  matrixCellValueHighlight: {
    color: C.gold,
  },
  matrixCellStatus: {
    color: C.gray3,
    fontSize: 5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },
  // Нижний ряд
  bottomRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },

  // ─── Поле разбора ─────────────────────────────────────────────────────────
  fieldCard: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.gold,
    marginRight: 10,
    opacity: 0.6,
  },
  fieldTitle: {
    color: C.gold,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    flex: 1,
  },
  fieldValue: {
    color: C.white,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: C.goldDim,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fieldDescription: {
    color: C.gray2,
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  fieldInterpretation: {
    color: C.gray1,
    fontSize: 10,
    lineHeight: 1.7,
  },

  // ─── Секция с AI текстом ──────────────────────────────────────────────────
  aiCard: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.borderGold,
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
  },
  aiCardLabel: {
    color: C.gold,
    fontSize: 7,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  aiCardText: {
    color: C.gray1,
    fontSize: 11,
    lineHeight: 1.85,
  },

  // ─── Финальная страница ───────────────────────────────────────────────────
  summaryPage: {
    backgroundColor: C.bg,
    flex: 1,
    padding: 48,
    alignItems: 'center',
  },
  summaryLabel: {
    color: C.gold,
    fontSize: 9,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryTitle: {
    color: C.white,
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  summaryDivider: {
    width: 60,
    height: 1,
    backgroundColor: C.gold,
    marginBottom: 24,
    opacity: 0.4,
  },
  summaryText: {
    color: C.gray1,
    fontSize: 11,
    lineHeight: 1.85,
    textAlign: 'center',
    maxWidth: 420,
    marginBottom: 32,
  },
  recommendationCard: {
    width: '100%',
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.goldDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  recommendationNumText: {
    color: C.gold,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  recommendationText: {
    color: C.gray1,
    fontSize: 10,
    lineHeight: 1.7,
    flex: 1,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: C.gray3,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

// ─── Компонент: ячейка матрицы ────────────────────────────────────────────────
function MatrixCell({ label, value, status, highlight, side }) {
  return (
    <View style={[styles.matrixCell, highlight && styles.matrixCellHighlight, side && styles.matrixCellSide]}>
      <Text style={styles.matrixCellLabel}>{label}</Text>
      <Text style={[styles.matrixCellValue, highlight && styles.matrixCellValueHighlight]}>
        {value || '—'}
      </Text>
      {status && <Text style={styles.matrixCellStatus}>{status}</Text>}
    </View>
  );
}

// ─── Компонент: матрица Пифагора ─────────────────────────────────────────────
function MatrixView({ data }) {
  const d = data;
  return (
    <View style={styles.matrixContainer}>
      <Text style={styles.matrixLabel}>Матрица Пифагора</Text>

      {/* Дополнительные числа */}
      <View style={styles.keyNumbersRow}>
        {[
          { label: 'Судьба', value: d.destiny },
          { label: 'Душа',   value: d.soul    },
          { label: 'Карма',  value: d.karma   },
          { label: 'Скрытое',value: d.hidden  },
        ].map(k => (
          <View key={k.label} style={styles.keyNumberCard}>
            <Text style={styles.keyNumberValue}>{k.value}</Text>
            <Text style={styles.keyNumberLabel}>{k.label}</Text>
          </View>
        ))}
      </View>

      {/* Сетка 4 колонки: 3×3 + правая */}
      <View style={styles.matrixGrid}>
        <View style={styles.matrixRow}>
          <MatrixCell label="Характер" value={d.char.v}     status={d.char.s}     highlight={d.char.h} />
          <MatrixCell label="Здоровье" value={d.health.v}   status={d.health.s}   highlight={d.health.h} />
          <MatrixCell label="Удача"    value={d.luck.v}     status={d.luck.s}     highlight={d.luck.h} />
          <MatrixCell label="Цель"     value={d.goal}       side />
        </View>
        <View style={styles.matrixRow}>
          <MatrixCell label="Энергия"  value={d.energy.v}   status={d.energy.s}   highlight={d.energy.h} />
          <MatrixCell label="Логика"   value={d.logic.v}    status={d.logic.s}    highlight={d.logic.h} />
          <MatrixCell label="Долг"     value={d.duty.v}     status={d.duty.s}     highlight={d.duty.h} />
          <MatrixCell label="Семья"    value={d.family}     side />
        </View>
        <View style={styles.matrixRow}>
          <MatrixCell label="Интерес"  value={d.interest.v} status={d.interest.s} highlight={d.interest.h} />
          <MatrixCell label="Труд"     value={d.labor.v}    status={d.labor.s}    highlight={d.labor.h} />
          <MatrixCell label="Память"   value={d.memory.v}   status={d.memory.s}   highlight={d.memory.h} />
          <MatrixCell label="Стабил."  value={d.stability}  side />
        </View>
      </View>

      {/* Нижний ряд */}
      <View style={styles.bottomRow}>
        <MatrixCell label="Самооценка" value={d.selfEsteem}    side />
        <MatrixCell label="Быт"        value={d.household}     side />
        <MatrixCell label="Талант"     value={d.talent}        side />
        <MatrixCell label="Духовность" value={d.spirituality}  side />
      </View>
    </View>
  );
}

// ─── Компонент: разбор поля ───────────────────────────────────────────────────
function FieldCard({ fieldKey, matrixData }) {
  const entry = BOOK[fieldKey];
  if (!entry) return null;

  const isMainCell = matrixData[fieldKey]?.v !== undefined;
  const value = isMainCell ? matrixData[fieldKey].v : (matrixData[fieldKey] || '—');
  const count = isMainCell ? (matrixData[fieldKey]?.v?.length || 0) : 0;
  const interpretation = entry.interpretations
    ? (entry.interpretations[count >= 4 ? 4 : count] ?? entry.interpretations['default'] ?? '')
    : '';

  return (
    <View style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldDot} />
        <Text style={styles.fieldTitle}>{entry.title}</Text>
        <Text style={styles.fieldValue}>{value || '—'}</Text>
      </View>
      {entry.description && (
        <Text style={styles.fieldDescription}>{entry.description}</Text>
      )}
      {interpretation && (
        <Text style={styles.fieldInterpretation}>{interpretation}</Text>
      )}
    </View>
  );
}

// ─── Компонент: страница секции ───────────────────────────────────────────────
function SectionPage({ section, matrixData, aiText, name, pageNum, totalPages }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.contentPage}>
        {/* Хедер страницы */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderDot} />
          <Text style={styles.pageHeaderText}>
            Персональный разбор · {name} · NUMEROS
          </Text>
        </View>

        {/* Заголовок секции */}
        <Text style={styles.sectionLabel}>{`Раздел ${pageNum - 2}`}</Text>
        <Text style={styles.sectionTitle}>{section.title}</Text>

        {/* Поля из книги */}
        {section.fields.map(key => (
          <FieldCard key={key} fieldKey={key} matrixData={matrixData} />
        ))}

        {/* AI-текст */}
        {aiText && (
          <View style={styles.aiCard}>
            <Text style={styles.aiCardLabel}>Персональный анализ</Text>
            <Text style={styles.aiCardText}>{aiText}</Text>
          </View>
        )}
      </View>

      {/* Футер */}
      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>NUMEROS · Премиальный нумерологический сервис</Text>
        <Text style={styles.footerText}>{pageNum} / {totalPages}</Text>
      </View>
    </Page>
  );
}

// ─── Главный компонент PDF ────────────────────────────────────────────────────
export function NumerologyPDF({ matrixData, name, birthDate, reportSections, summary }) {
  const totalPages = 2 + PDF_SECTIONS.length + 1; // обложка + оглавление + секции + резюме

  // Парсим рекомендации из summary (ожидаем "1. ... 2. ... 3. ...")
  const recommendations = [];
  if (summary) {
    const matches = summary.match(/\d+\.\s+([^\d]+?)(?=\d+\.|$)/g) || [];
    matches.forEach(m => {
      const text = m.replace(/^\d+\.\s+/, '').trim();
      if (text) recommendations.push(text);
    });
  }
  const summaryIntro = summary?.split(/\d+\./)[0]?.trim() || summary || '';

  return (
    <Document
      title={`Нумерологический разбор — ${name}`}
      author="NUMEROS"
      subject="Персональный разбор матрицы Пифагора"
    >
      {/* ── Обложка ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>Персональный разбор · NUMEROS</Text>
          </View>
          <Text style={styles.coverTitle}>Матрица Пифагора</Text>
          <Text style={styles.coverSubtitle}>{name}</Text>
          <Text style={styles.coverDate}>{birthDate}</Text>
          <View style={styles.coverDivider} />
          <Text style={styles.coverDescription}>
            Этот отчёт составлен на основе вашей даты рождения с использованием 
            классического метода нумерологии — Квадрата Пифагора. 
            Каждое число несёт уникальное послание о вашей природе, 
            потенциале и жизненном пути.
          </Text>
          <Text style={styles.coverFooter}>
            © 2026 NUMEROS · Премиальный нумерологический сервис
          </Text>
        </View>
      </Page>

      {/* ── Оглавление ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.tocPage}>
          <Text style={styles.tocTitle}>Содержание</Text>
          <Text style={styles.tocHeading}>Ваш разбор</Text>

          {[
            'Матрица Пифагора',
            ...PDF_SECTIONS.map(s => s.title),
            'Итоги и рекомендации',
          ].map((title, idx) => (
            <View key={idx} style={styles.tocItem}>
              <View style={styles.tocNumber}>
                <Text style={styles.tocNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.tocItemTitle}>{title}</Text>
              <Text style={styles.tocItemPage}>{idx + 3}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>NUMEROS · Персональный нумерологический разбор</Text>
          <Text style={styles.footerText}>2 / {totalPages}</Text>
        </View>
      </Page>

      {/* ── Страница с матрицей ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderDot} />
            <Text style={styles.pageHeaderText}>
              Персональный разбор · {name} · NUMEROS
            </Text>
          </View>
          <Text style={styles.sectionLabel}>Раздел 1</Text>
          <Text style={styles.sectionTitle}>Ваша Матрица Пифагора</Text>
          <MatrixView data={matrixData} />
        </View>
        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>NUMEROS · Персональный нумерологический разбор</Text>
          <Text style={styles.footerText}>3 / {totalPages}</Text>
        </View>
      </Page>

      {/* ── Секции с разбором ── */}
      {PDF_SECTIONS.map((section, idx) => {
        const aiText = reportSections?.find(s => s.id === section.id)?.text;
        return (
          <SectionPage
            key={section.id}
            section={section}
            matrixData={matrixData}
            aiText={aiText}
            name={name}
            pageNum={4 + idx}
            totalPages={totalPages}
          />
        );
      })}

      {/* ── Резюме и рекомендации ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.summaryPage}>
          <Text style={styles.summaryLabel}>Итоги</Text>
          <Text style={styles.summaryTitle}>Резюме и рекомендации</Text>
          <View style={styles.summaryDivider} />
          {summaryIntro && (
            <Text style={styles.summaryText}>{summaryIntro}</Text>
          )}
          {recommendations.length > 0 && recommendations.map((rec, i) => (
            <View key={i} style={styles.recommendationCard}>
              <View style={styles.recommendationNum}>
                <Text style={styles.recommendationNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
          {recommendations.length === 0 && summary && (
            <View style={styles.aiCard}>
              <Text style={styles.aiCardText}>{summary}</Text>
            </View>
          )}
        </View>
        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>NUMEROS · Персональный нумерологический разбор</Text>
          <Text style={styles.footerText}>{totalPages} / {totalPages}</Text>
        </View>
      </Page>
    </Document>
  );
}
