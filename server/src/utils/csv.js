/**
 * CSV helpers with spreadsheet formula-injection protection.
 * Any cell beginning with = + - @ TAB or CR is prefixed with a single quote so that
 * Excel / Sheets / LibreOffice treat it as text rather than a formula.
 */
export function csvCell(value) {
    if (value === null || value === undefined)
        return '';
    let s = value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.join('; ') : String(value);
    if (/^[=+\-@\t\r]/.test(s))
        s = `'${s}`;
    if (/[",\n\r]/.test(s))
        s = `"${s.replace(/"/g, '""')}"`;
    return s;
}
export function toCsv(headers, rows) {
    const lines = [headers.map(csvCell).join(',')];
    for (const row of rows)
        lines.push(row.map(csvCell).join(','));
    return lines.join('\r\n') + '\r\n';
}
