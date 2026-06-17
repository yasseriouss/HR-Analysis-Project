import React, { useState } from 'react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  options?: { value: string | number; label: string }[];
  required?: boolean;
}

interface PageCRUDProps<T extends { id?: string }> {
  title: string;
  fields: Field[];
  state: {
    items: T[];
    create: (item: T) => void;
    update: (id: string, patch: Partial<T>) => void;
    remove: (id: string) => void;
  };
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  lang: string;
}

export function PageCRUD<T extends { id?: string }>({ title, fields, state, getKey, getLabel, lang }: PageCRUDProps<T>) {
  const { items, create, update, remove } = state;
  const [form, setForm] = useState<Partial<T>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = items.filter((item) => {
    const text = String(getLabel(item)).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const start = (page - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      update(editId, form);
      setEditId(null);
    } else {
      create({ ...(form as T), id: `${Date.now()}` });
    }
    setForm({});
  };

  const startEdit = (item: T) => {
    setEditId(getKey(item));
    setForm({ ...item });
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      remove(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const fieldValue = (field: Field) => {
    const value = (form as any)[field.name];
    if (field.type === 'select') {
      return (
        <select
          className="input-select"
          value={value ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
        >
          <option value="">Select</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    if (field.type === 'textarea') {
      return <textarea value={String(value ?? '')} onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))} />;
    }
    return (
      <input
        type={field.type}
        value={String(value ?? '')}
        required={field.required}
        onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
      />
    );
  };

  return (
    <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel-noclick" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{title}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="input-select"
              style={{ width: '240px' }}
              placeholder="Search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <button
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
              onClick={() => { setEditId(null); setForm({}); }}
            >
              + New
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        <div className="glass-panel-noclick" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                {fields.map((field) => (
                  <th key={field.name} style={{ padding: '10px 12px', textAlign: 'left' }}>{field.label}</th>
                ))}
                <th style={{ padding: '10px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr><td colSpan={fields.length + 1} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>No data</td></tr>
              )}
              {pageData.map((item) => (
                <tr key={getKey(item)} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {fields.map((field) => (
                    <td key={field.name} style={{ padding: '10px 12px' }}>{String((item as any)[field.name] ?? '')}</td>
                  ))}
                  <td style={{ padding: '10px 12px' }}>
                    <button onClick={() => startEdit(item)} style={{ marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => setConfirmDeleteId(getKey(item))} style={{ color: 'var(--color-left)', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>{start + 1} - {Math.min(start + perPage, filtered.length)} of {filtered.length}</span>
            <span>
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ marginRight: '8px' }}>Prev</button>
              <button disabled={start + perPage >= filtered.length} onClick={() => setPage((p) => p + 1)}>Next</button>
            </span>
          </div>
        </div>

        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 700 }}>{editId ? 'Edit' : 'Add'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fields.map((field) => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{field.label}</label>
                {fieldValue(field)}
              </div>
            ))}
            <button type="submit" style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--gradient-primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
              {editId ? 'Save' : 'Create'}
            </button>
          </form>
        </div>
      </div>

      {confirmDeleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
          <div className="glass-panel" style={{ padding: '24px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginBottom: '8px' }}>Confirm delete</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Are you sure you want to delete this item?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'var(--color-left)', color: 'white', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}