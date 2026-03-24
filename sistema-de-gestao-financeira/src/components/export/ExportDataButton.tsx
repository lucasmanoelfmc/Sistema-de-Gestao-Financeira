'use client';

import { useMemo } from 'react';

type ExportRow = Record<string, string | number | boolean | null | undefined>;

type ExportDataButtonProps = {
  fileBaseName: string;
  rows: ExportRow[];
  title?: string;
};

function escapeCsv(value: string | number | boolean | null | undefined) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsv(rows: ExportRow[]) {
  if (rows.length === 0) {
    return 'Sem dados\n';
  }

  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(escapeCsv).join(',');
  const contentLines = rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','));

  return [headerLine, ...contentLines].join('\n');
}

function sanitizePdfText(input: string) {
  return input.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildSimplePdf(lines: string[]) {
  const safeLines = lines.length > 0 ? lines.slice(0, 40) : ['Sem dados'];
  const commands = ['BT', '/F1 12 Tf', '40 800 Td'];

  safeLines.forEach((line, index) => {
    const safeLine = sanitizePdfText(line);
    commands.push(`(${safeLine}) Tj`);
    if (index < safeLines.length - 1) {
      commands.push('0 -18 Td');
    }
  });

  commands.push('ET');

  const stream = commands.join('\n');
  const pdfParts: string[] = [];

  function pushPart(part: string) {
    pdfParts.push(part);
  }

  pushPart('%PDF-1.4\n');
  const offsets: number[] = [0];

  function addObject(content: string) {
    const currentOffset = pdfParts.join('').length;
    offsets.push(currentOffset);
    pushPart(content);
  }

  addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  addObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  addObject('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
  addObject('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  addObject(`5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);

  const xrefOffset = pdfParts.join('').length;
  pushPart(`xref\n0 ${offsets.length}\n`);
  pushPart('0000000000 65535 f \n');

  for (let index = 1; index < offsets.length; index += 1) {
    pushPart(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  }

  pushPart(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return pdfParts.join('');
}

function triggerDownload(content: BlobPart, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

export default function ExportDataButton({ fileBaseName, rows, title }: ExportDataButtonProps) {
  const defaultTitle = useMemo(() => title || `Exportação ${fileBaseName}`, [fileBaseName, title]);

  function handleExportCsv() {
    const csv = buildCsv(rows);
    triggerDownload(csv, `${fileBaseName}.csv`, 'text/csv;charset=utf-8;');
  }

  function handleExportPdf() {
    const csv = buildCsv(rows);
    const lines = [defaultTitle, '', ...csv.split('\n')];
    const pdf = buildSimplePdf(lines);
    triggerDownload(pdf, `${fileBaseName}.pdf`, 'application/pdf');
  }

  return (
    <details style={{ position: 'relative' }}>
      <summary
        style={{
          listStyle: 'none',
          cursor: 'pointer',
          border: '1px solid #d1d5db',
          borderRadius: 10,
          padding: '10px 14px',
          background: '#fff',
          fontWeight: 600,
        }}
      >
        Exportar
      </summary>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          minWidth: 150,
          background: '#fff',
          border: '1px solid #d1d5db',
          borderRadius: 10,
          padding: 8,
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          display: 'grid',
          gap: 6,
          zIndex: 10,
        }}
      >
        <button type="button" onClick={handleExportCsv} style={menuButtonStyle}>
          Exportar CSV
        </button>
        <button type="button" onClick={handleExportPdf} style={menuButtonStyle}>
          Exportar PDF
        </button>
      </div>
    </details>
  );
}

const menuButtonStyle = {
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '8px 10px',
  backgroundColor: '#f9fafb',
  cursor: 'pointer',
  textAlign: 'left',
} as const;