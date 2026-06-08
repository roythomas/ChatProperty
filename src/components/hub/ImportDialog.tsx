import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { Apartment, ApartmentStatus } from '../../types/hub';

interface Props { onClose: () => void; onImport: (apts: Apartment[]) => void; }

interface ParseResult { total: number; imported: number; skipped: number; preview: Apartment[]; }

const BUILDING_DEFAULTS: Record<string, string> = {
  'ST': 'Serdal Tower', 'DT': 'Dareen Building', 'AR': 'Areen Residence',
  'CG': 'Castle Garden', 'TV': 'The Village',
};

function detectDelimiter(raw: string): string {
  const sample = raw.slice(0, 2000);
  const commas = (sample.match(/,/g) ?? []).length;
  const semicolons = (sample.match(/;/g) ?? []).length;
  const tabs = (sample.match(/\t/g) ?? []).length;
  if (tabs > commas && tabs > semicolons) return '\t';
  if (semicolons > commas) return ';';
  return ',';
}

function findHeaderRow(rows: string[][]): number {
  const keywords = ['building', 'unit', 'apartment', 'room', 'type', 'status', 'code', 'floor', 'tenant'];
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const rowStr = rows[i].join(' ').toLowerCase();
    const matches = keywords.filter(k => rowStr.includes(k)).length;
    if (matches >= 2) return i;
  }
  return 0;
}

function inferFloor(name: string): number {
  const m = name.match(/^(\d+)/);
  if (m) return Math.floor(parseInt(m[1]) / 100) || 1;
  const m2 = name.match(/(\d+)[A-Z](\d+)/);
  if (m2) return parseInt(m2[1]);
  return 1;
}

function mapStatus(raw: string): ApartmentStatus {
  const v = raw.toLowerCase();
  if (v.includes('complet') || v.includes('done') || v.includes('finish')) return 'Completed';
  if (v.includes('overdue') || v.includes('delayed') || v.includes('behind')) return 'Overdue';
  if (v.includes('progress') || v.includes('ongoing') || v.includes('active')) return 'In Progress';
  return 'Vacant';
}

function parseRows(rows: string[][], headers: string[]): Apartment[] {
  const lower = headers.map(h => h.toLowerCase().trim());
  const col = (aliases: string[]) => {
    for (const a of aliases) {
      const idx = lower.findIndex(h => h.includes(a));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const nameIdx = col(['unit', 'room', 'apartment', 'apt', 'name']);
  const buildingIdx = col(['building', 'compound', 'property', 'block']);
  const typeIdx = col(['type', 'layout', 'config', 'unit type']);
  const statusIdx = col(['status', 'state', 'condition']);
  const codeIdx = col(['short code', 'fm code', 'code', 'ref']);
  const tenantIdx = col(['tenant', 'occupant', 'resident']);
  const budgetIdx = col(['budget', 'total', 'allocation']);
  const spentIdx = col(['spent', 'actual', 'expended']);
  const progressIdx = col(['progress', 'completion', '%']);

  return rows.filter(r => r.some(c => c.trim())).map((row, i): Apartment => {
    const get = (idx: number) => idx >= 0 ? (row[idx] ?? '').trim() : '';
    const name = get(nameIdx) || `Unit ${i + 1}`;
    const rawBuilding = get(buildingIdx);
    const code = get(codeIdx);
    const buildingCode = code.split('-')[0] || 'GEN';
    const building = rawBuilding || BUILDING_DEFAULTS[buildingCode] || rawBuilding || 'General';
    const rawStatus = get(statusIdx);

    return {
      id: `import-${Date.now()}-${i}`,
      name, building, buildingCode,
      type: get(typeIdx) || 'Unit',
      status: rawStatus ? mapStatus(rawStatus) : 'Vacant',
      progress: progressIdx >= 0 ? parseInt(get(progressIdx)) || 0 : 0,
      budget: {
        total: budgetIdx >= 0 ? parseInt(get(budgetIdx).replace(/[^0-9]/g, '')) || 0 : 0,
        spent: spentIdx >= 0 ? parseInt(get(spentIdx).replace(/[^0-9]/g, '')) || 0 : 0,
      },
      shortCode: code || undefined,
      tenantName: get(tenantIdx) || undefined,
      floor: inferFloor(name),
      bedrooms: 1, furnished: false,
      checklist: [], floorPlanPins: [],
    };
  });
}

export function ImportDialog({ onClose, onImport }: Props) {
  const [phase, setPhase] = useState<'drop' | 'preview' | 'done'>('drop');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const raw = e.target?.result as string;
        const delim = detectDelimiter(raw);
        const parsed = Papa.parse<string[]>(raw, { delimiter: delim, skipEmptyLines: true });
        const rows = parsed.data as string[][];
        const headerIdx = findHeaderRow(rows);
        const headers = rows[headerIdx];
        const dataRows = rows.slice(headerIdx + 1);
        const apts = parseRows(dataRows, headers);
        const valid = apts.filter(a => a.name && a.name !== 'Unit 1' || apts.length === 1);
        setResult({ total: dataRows.length, imported: apts.length, skipped: dataRows.length - apts.length, preview: apts.slice(0, 5) });
        setPhase('preview');
      } catch {
        setError('Failed to parse file. Please ensure it is a valid CSV or TSV file.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Import CSV / Excel</h3>
              <p className="text-xs text-slate-400 mt-0.5">Auto-detects delimiters, headers, and field mappings</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {phase === 'drop' && (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                  dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                }`}
              >
                <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-indigo-500' : 'text-slate-400'}`} />
                <p className="font-semibold text-slate-700 mb-1">Drop your CSV or TSV here</p>
                <p className="text-slate-400 text-sm mb-4">or click to browse</p>
                <label className="cursor-pointer px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
                  Browse Files
                  <input type="file" accept=".csv,.tsv,.txt,.xlsx" onChange={handleFileInput} className="hidden" />
                </label>
                {error && (
                  <p className="mt-3 text-red-600 text-sm flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />{error}
                  </p>
                )}
              </div>
            )}

            {phase === 'preview' && result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Rows Found', val: result.total, color: 'text-slate-800' },
                    { label: 'To Import', val: result.imported, color: 'text-emerald-700' },
                    { label: 'Skipped', val: result.skipped, color: 'text-amber-700' },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                      <p className={`font-mono-data text-xl font-bold ${s.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Preview (first 5 rows)</p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          {['Code', 'Building', 'Unit', 'Type', 'Status'].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.preview.map(a => (
                          <tr key={a.id}>
                            <td className="px-3 py-2 font-mono-data text-indigo-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{a.shortCode ?? '—'}</td>
                            <td className="px-3 py-2 text-slate-700 truncate max-w-24">{a.building}</td>
                            <td className="px-3 py-2 text-slate-800 font-medium">{a.name}</td>
                            <td className="px-3 py-2 text-slate-600">{a.type}</td>
                            <td className="px-3 py-2"><span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{a.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-sm text-blue-700">
                  <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Fields auto-mapped from headers. Delimiter auto-detected. Floor computed from unit codes.</span>
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-slate-800">Import Successful</p>
                <p className="text-slate-500 text-sm mt-1">{result?.imported} units added to the directory</p>
              </div>
            )}
          </div>

          {phase === 'preview' && result && (
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setPhase('drop')} className="flex-1 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                Re-upload
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { onImport(result.preview); setPhase('done'); }}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Confirm Import
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
