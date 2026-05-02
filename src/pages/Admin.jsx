import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { entrepreneurs as mockEntrepreneurs } from '../data/mockData';
import { parseCSVToEntrepreneurs, generateTemplateCSV } from '../utils/agencyScore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  Users, Upload, Database, Trash2, Edit3, X, Check,
  FileText, Download, AlertCircle, CheckCircle, ShieldCheck,
} from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Upload state
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [venturesSnap, fundersSnap] = await Promise.all([
        getDocs(collection(db, 'entrepreneurs')),
        getDocs(collection(db, 'funders')),
      ]);
      const v = venturesSnap.docs.map(d => ({ id: d.id, type: 'venture', ...d.data() }));
      const f = fundersSnap.docs.map(d => ({ id: d.id, type: 'funder', ...d.data() }));
      setUsers([...v, ...f]);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Seed ──────────────────────────────────────────────────────────
  const handleSeedData = async () => {
    try {
      await Promise.all(
        mockEntrepreneurs.map(ent => setDoc(doc(db, 'entrepreneurs', ent.id), ent))
      );
      fetchUsers();
    } catch (err) {
      console.error('Error seeding data:', err);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, type === 'venture' ? 'entrepreneurs' : 'funders', id));
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name ?? '',
      businessName: user.businessName ?? '',
      email: user.email ?? '',
      sector: user.sector ?? '',
      location: user.location ?? '',
      state: user.state ?? '',
      age: user.age ?? '',
      fundingNeeded: user.fundingNeeded ?? '',
      monthlyRevenue: user.monthlyRevenue ?? '',
    });
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const collName = editingUser.type === 'venture' ? 'entrepreneurs' : 'funders';
      const cleaned = Object.fromEntries(
        Object.entries(editForm).filter(([, v]) => v !== '')
      );
      await updateDoc(doc(db, collName, editingUser.id), cleaned);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── Upload ────────────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file) return;
    setUploadErrors([]);
    setUploadSuccess('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (file.name.endsWith('.csv')) {
        const result = parseCSVToEntrepreneurs(text);
        setPreview(result.valid);
        setUploadErrors(result.errors);
      } else if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(text);
          const arr = Array.isArray(data) ? data : [data];
          const valid = arr.filter(d => d && typeof d === 'object');
          setPreview(valid.map((d, i) => ({ ...d, id: d.id || `uc-upload-${Date.now()}-${i}` })));
          const skipped = arr.length - valid.length;
          if (skipped > 0) setUploadErrors([{ row: 0, message: `${skipped} invalid entries skipped.` }]);
        } catch {
          setUploadErrors([{ row: 0, message: 'Invalid JSON file' }]);
        }
      } else {
        setUploadErrors([{ row: 0, message: 'Please upload a .csv or .json file' }]);
      }
    };
    reader.readAsText(file);
  };

  const handleUploadToFirebase = async () => {
    if (!preview?.length) return;
    setUploading(true);
    try {
      await Promise.all(
        preview.map(ent => setDoc(doc(db, 'entrepreneurs', ent.id), ent))
      );
      setUploadSuccess(`${preview.length} entrepreneur(s) uploaded to Firebase!`);
      setPreview(null);
      fetchUsers();
    } catch (err) {
      console.error('Error uploading:', err);
      setUploadErrors([{ row: 0, message: 'Failed to upload to Firebase. Check console for details.' }]);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = generateTemplateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unseenceo_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-28 h-20 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Admin Control</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Manage users, upload data, and seed the platform</p>
          </div>
          <div className="anim-fade-in-up delay-300 shrink-0">
            <button
              onClick={handleSeedData}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Database size={13} />
              Seed Mock Data
            </button>
          </div>
        </div>
      </div>

      {/* Upload data section */}
      <Card title="Upload Entrepreneur Data" icon={Upload} className="anim-fade-in-up delay-100">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-warm-300 hover:border-primary-300 hover:bg-warm-50'}`}
        >
          <FileText size={36} className="mx-auto text-warm-400 mb-3" />
          <p className="text-sm text-warm-700 font-medium">
            {isDragging ? 'Drop file here' : 'Drag & drop CSV/JSON or click to browse'}
          </p>
          <p className="text-xs text-warm-400 mt-1">Supports .csv and .json files · Data is saved directly to Firebase</p>
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

        {uploadErrors.length > 0 && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium mb-1">
              <AlertCircle size={14} /> Errors found
            </div>
            {uploadErrors.map((err, i) => (
              <p key={i} className="text-xs text-red-500">Row {err.row}: {err.message}</p>
            ))}
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={14} /> {uploadSuccess}
          </div>
        )}

        {preview && preview.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-warm-700 mb-2">{preview.length} record(s) ready to upload:</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {preview.map((p, i) => (
                <div key={i} className="text-xs bg-warm-50 rounded-lg px-3 py-2 flex justify-between">
                  <span className="font-medium text-warm-800">{p.name}</span>
                  <span className="text-warm-500">{p.sector}</span>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={Upload}
              className="mt-3 w-full"
              onClick={handleUploadToFirebase}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : `Upload ${preview.length} record(s) to Firebase`}
            </Button>
          </div>
        )}
      </Card>

      {/* User management table */}
      <Card title="User Management" icon={Users} className="anim-fade-in-up delay-200">
        {loading ? (
          <div className="py-12 text-center text-warm-400 text-sm">Loading users…</div>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider">Name / Business</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-warm-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-warm-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-warm-900 text-sm">{user.name || user.businessName || 'Unknown'}</div>
                      {user.businessName && user.name && (
                        <div className="text-xs text-warm-400 mt-0.5">{user.businessName}</div>
                      )}
                      <div className="text-xs text-warm-400">{user.email || user.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${user.type === 'venture'
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-amber-100 text-amber-700'}`}>
                        {user.type === 'venture' ? 'Entrepreneur' : 'Funder'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-600">
                      {user.location || user.state || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" icon={Edit3} onClick={() => openEdit(user)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(user.id, user.type)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-warm-400 text-sm">
                      No users found. Seed mock data or upload a file to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg anim-fade-in-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200">
              <div>
                <h2 className="font-semibold text-warm-900">Edit User</h2>
                <p className="text-xs text-warm-500 mt-0.5">{editingUser.id}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-warm-400 hover:bg-warm-100 hover:text-warm-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', col: 2 },
                { key: 'businessName', label: 'Business Name', col: 2 },
                { key: 'email', label: 'Email', col: 2 },
                { key: 'sector', label: 'Sector', col: 1 },
                { key: 'location', label: 'Location', col: 1 },
                { key: 'state', label: 'State', col: 1 },
                { key: 'age', label: 'Age', col: 1 },
                { key: 'monthlyRevenue', label: 'Monthly Revenue (₹)', col: 1 },
                { key: 'fundingNeeded', label: 'Funding Needed (₹)', col: 1 },
              ].map(({ key, label, col }) => (
                <div key={key} className={col === 2 ? 'col-span-2' : 'col-span-1'}>
                  <label className="block text-xs font-medium text-warm-600 mb-1">{label}</label>
                  <input
                    type="text"
                    value={editForm[key] ?? ''}
                    onChange={(e) => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-warm-200 bg-warm-50 rounded-b-2xl">
              <Button variant="ghost" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={Check} onClick={handleEditSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
