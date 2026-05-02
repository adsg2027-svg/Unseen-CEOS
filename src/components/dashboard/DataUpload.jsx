import { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { parseCSVToEntrepreneurs, generateTemplateCSV } from '../../utils/agencyScore';
import Card from '../common/Card';
import Button from '../common/Button';

export default function DataUpload() {
  const { dispatch } = useData();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  function handleFile(file) {
    if (!file) return;
    setErrors([]);
    setSuccess('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (file.name.endsWith('.csv')) {
        const result = parseCSVToEntrepreneurs(text);
        setPreview(result.valid);
        setErrors(result.errors);
      } else if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(text);
          const arr = Array.isArray(data) ? data : [data];
          const valid = arr.filter(d => d && typeof d === 'object');
          setPreview(valid.map((d, i) => ({ ...d, id: d.id || `uc-upload-${Date.now()}-${i}` })));
          const skipped = arr.length - valid.length;
          if (skipped > 0) setErrors([{ row: 0, message: `${skipped} null/invalid entr${skipped > 1 ? 'ies' : 'y'} in JSON were skipped.` }]);
        } catch {
          setErrors([{ row: 0, message: 'Invalid JSON file' }]);
        }
      } else {
        setErrors([{ row: 0, message: 'Please upload a .csv or .json file' }]);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function handleAdd() {
    if (preview && preview.length > 0) {
      dispatch({ type: 'ADD_UPLOADED_DATA', payload: preview });
      setSuccess(`${preview.length} entrepreneur(s) added successfully!`);
      setPreview(null);
    }
  }

  function handleDownloadTemplate() {
    const csv = generateTemplateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unseenceo_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card title="Upload Data" icon={Upload}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-warm-300 hover:border-primary-300 hover:bg-warm-50'}`}
      >
        <FileText size={32} className="mx-auto text-warm-400 mb-2" />
        <p className="text-sm text-warm-600 font-medium">
          {isDragging ? 'Drop file here' : 'Drag & drop CSV/JSON or click to browse'}
        </p>
        <p className="text-xs text-warm-400 mt-1">Supports .csv and .json files</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />
      </div>

      <div className="mt-3">
        <Button variant="ghost" size="sm" icon={Download} onClick={handleDownloadTemplate}>
          Download Template CSV
        </Button>
      </div>

      {errors.length > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-600 text-sm font-medium mb-1">
            <AlertCircle size={14} />
            Errors found
          </div>
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-500">Row {err.row}: {err.message}</p>
          ))}
        </div>
      )}

      {success && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle size={14} />
          {success}
        </div>
      )}

      {preview && preview.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-warm-700 mb-2">{preview.length} record(s) ready to add:</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {preview.map((p, i) => (
              <div key={i} className="text-xs bg-warm-50 rounded px-3 py-2 flex justify-between">
                <span className="font-medium">{p.name}</span>
                <span className="text-warm-500">{p.sector}</span>
              </div>
            ))}
          </div>
          <Button variant="primary" size="sm" className="mt-3 w-full" onClick={handleAdd}>
            Add to Dataset
          </Button>
        </div>
      )}
    </Card>
  );
}
