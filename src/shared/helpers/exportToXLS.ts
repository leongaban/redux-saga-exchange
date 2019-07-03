import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

function exportToXLS<T>(data: T[], fileName: string) {
  /* make the worksheet */
  const ws = XLSX.utils.json_to_sheet(data);

  /* add to workbook */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, fileName);

  /* write workbook (use type 'binary') */
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  /* generate a download */
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
}

export { exportToXLS };
