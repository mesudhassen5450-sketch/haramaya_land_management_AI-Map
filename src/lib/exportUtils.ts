// Export utilities for PDF and Excel

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? "" : String(value);
        // Escape quotes and wrap in quotes if contains comma
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    ),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  // Create a simple XML-based Excel file
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  
  let xmlContent = '<?xml version="1.0"?>\n';
  xmlContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
  xmlContent += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
  xmlContent += '<Worksheet ss:Name="Report">\n<Table>\n';

  // Header row
  xmlContent += "<Row>\n";
  headers.forEach((header) => {
    xmlContent += `<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>\n`;
  });
  xmlContent += "</Row>\n";

  // Data rows
  data.forEach((row) => {
    xmlContent += "<Row>\n";
    headers.forEach((header) => {
      const value = row[header];
      const type = typeof value === "number" ? "Number" : "String";
      const stringValue = value === null || value === undefined ? "" : String(value);
      xmlContent += `<Cell><Data ss:Type="${type}">${escapeXml(stringValue)}</Data></Cell>\n`;
    });
    xmlContent += "</Row>\n";
  });

  xmlContent += "</Table>\n</Worksheet>\n</Workbook>";

  downloadFile(xmlContent, `${filename}.xls`, "application/vnd.ms-excel");
}

export function exportToPDF(title: string, data: Record<string, unknown>[]) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  
  // Create a printable HTML document
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #4a5568; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 20px; font-size: 10px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${data.map((row) => `
            <tr>${headers.map((h) => `<td>${row[h] ?? ""}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
      <div class="footer">
        <p>Total Records: ${data.length}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
