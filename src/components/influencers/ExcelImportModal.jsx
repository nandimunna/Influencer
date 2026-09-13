import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export const ExcelImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setErrorMsg('');
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawJson = XLSX.utils.sheet_to_json(ws);

        if (rawJson.length === 0) {
          setErrorMsg('No data rows found in the uploaded spreadsheet.');
          return;
        }

        setParsedRows(rawJson);
      } catch (err) {
        console.error('File parsing error', err);
        setErrorMsg('Failed to parse Excel/CSV file. Please ensure valid spreadsheet format.');
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    try {
      setIsProcessing(true);
      setErrorMsg('');

      const res = await api.bulkImportInfluencers(parsedRows);
      if (res.success) {
        setSuccessMsg(`🎉 Successfully imported ${res.importedCount} new creators (${res.skippedCount} duplicates skipped)!`);
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Creators from Excel / CSV"
      subtitle="Upload creator media plans or influencer database spreadsheets"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="border-2 border-dashed border-slate-700/80 hover:border-purple-500/60 rounded-2xl p-6 text-center bg-slate-900/60 transition-colors">
          <input
            type="file"
            id="excel-file-input"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {file ? file.name : 'Click to upload or drag & drop Excel / CSV'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Supported formats: .xlsx, .xls, .csv (Auto-detects Name, IG Link, Followers, Avg Views, 1 reel + DR, Eng, F%, M%)
              </p>
            </div>
          </label>
        </div>

        {parsedRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-300">
                Detected <span className="text-purple-300 font-mono">{parsedRows.length}</span> Creator Records:
              </p>
              <span className="text-[11px] text-slate-400">Previewing first 5 rows</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">IG Link / Handle</th>
                    <th className="px-3 py-2">Followers</th>
                    <th className="px-3 py-2">Avg Views</th>
                    <th className="px-3 py-2">1 Reel + DR</th>
                    <th className="px-3 py-2">Eng %</th>
                    <th className="px-3 py-2">Female %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {parsedRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="px-3 py-2 font-bold text-white">{row.Name || row.name || 'N/A'}</td>
                      <td className="px-3 py-2 text-purple-300 font-mono text-[11px] truncate max-w-[150px]">
                        {row['IG Link'] || row.igLink || row.handle || 'N/A'}
                      </td>
                      <td className="px-3 py-2">{row['IG followers'] || row.followerCount || 'N/A'}</td>
                      <td className="px-3 py-2 text-emerald-400">{row['Avg Views'] || row.avgViews || 'N/A'}</td>
                      <td className="px-3 py-2 font-bold">{row['1 reel + DR'] || row.price || 'N/A'}</td>
                      <td className="px-3 py-2 text-purple-300 font-bold">{row.Eng || row.engagementRate || 'N/A'}</td>
                      <td className="px-3 py-2 text-pink-400">{row['F%'] || row.femalePct || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteImport}
            disabled={parsedRows.length === 0 || isProcessing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isProcessing ? (
              <span>Importing {parsedRows.length} Creators...</span>
            ) : (
              <>
                <span>Import {parsedRows.length} Creators</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
