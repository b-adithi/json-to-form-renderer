import { FormData, FormSubmission } from '../types/schema';

export function exportToJSON(data: FormSubmission): string {
  return JSON.stringify(data, null, 2);
}

export function exportToCSV(data: FormSubmission): string {
  const headers = ['Field', 'Value'];
  const rows: string[][] = [headers];
  
  Object.entries(data.data).forEach(([key, value]) => {
    let valueStr = '';
    if (Array.isArray(value)) {
      valueStr = value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      valueStr = JSON.stringify(value);
    } else {
      valueStr = String(value);
    }
    rows.push([key, valueStr]);
  });
  
  return rows.map(row => 
    row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}

export function exportToXML(data: FormSubmission): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<submission>\n';
  xml += `  <id>${escapeXml(data.submissionId)}</id>\n`;
  xml += `  <timestamp>${escapeXml(data.timestamp)}</timestamp>\n`;
  
  if (data.userIdentifier) {
    xml += `  <userIdentifier>${escapeXml(data.userIdentifier)}</userIdentifier>\n`;
  }
  
  if (data.totalMarks !== undefined) {
    xml += `  <totalMarks>${data.totalMarks}</totalMarks>\n`;
  }
  
  if (data.maxMarks !== undefined) {
    xml += `  <maxMarks>${data.maxMarks}</maxMarks>\n`;
  }
  
  xml += '  <data>\n';
  Object.entries(data.data).forEach(([key, value]) => {
    xml += `    <field name="${escapeXml(key)}">`;
    if (Array.isArray(value)) {
      xml += '\n';
      value.forEach(item => {
        xml += `      <item>${escapeXml(String(item))}</item>\n`;
      });
      xml += '    ';
    } else if (typeof value === 'object' && value !== null) {
      xml += escapeXml(JSON.stringify(value));
    } else {
      xml += escapeXml(String(value));
    }
    xml += '</field>\n';
  });
  xml += '  </data>\n';
  xml += '</submission>';
  
  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSubmission(
  submission: FormSubmission,
  format: 'json' | 'csv' | 'xml'
): void {
  let content: string;
  let filename: string;
  let mimeType: string;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  switch (format) {
    case 'json':
      content = exportToJSON(submission);
      filename = `form-submission-${timestamp}.json`;
      mimeType = 'application/json';
      break;
    case 'csv':
      content = exportToCSV(submission);
      filename = `form-submission-${timestamp}.csv`;
      mimeType = 'text/csv';
      break;
    case 'xml':
      content = exportToXML(submission);
      filename = `form-submission-${timestamp}.xml`;
      mimeType = 'application/xml';
      break;
  }
  
  downloadFile(content, filename, mimeType);
}
