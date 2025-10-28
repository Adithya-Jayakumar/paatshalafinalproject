import React, { useState } from 'react';

export default function taskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { alert('Title is required'); return; }
    setSubmitting(true);
    await onAdd({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
    setSubmitting(false);
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Add Task</h5>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting} />
        </div>
        <div className="mb-2">
          <textarea className="form-control" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={submitting} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}
