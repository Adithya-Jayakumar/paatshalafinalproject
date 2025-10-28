import React, { useState } from 'react';

function TaskRow({ task, onToggleStatus, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const save = async () => {
    if (!title.trim()) return alert('Title required');
    await onUpdate(task._id, { title: title.trim(), description: description.trim() });
    setEditing(false);
  };

  return (
    <tr>
      <td style={{ width: 40 }}>
        <input
          type="checkbox"
          checked={task.status === 'Completed'}
          onChange={() => onToggleStatus(task._id, task.status === 'Pending' ? 'Completed' : 'Pending')}
        />
      </td>
      <td>
        {editing ? (
          <>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="form-control mt-1" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}></textarea>
          </>
        ) : (
          <>
            <div style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
              <strong>{task.title}</strong>
            </div>
            <div><small>{task.description}</small></div>
          </>
        )}
      </td>
      <td style={{ width: 150 }}>
        <div>
          <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>{task.status}</span>
        </div>
        <div className="mt-2">
          {editing ? (
            <>
              <button className="btn btn-sm btn-primary me-1" onClick={save}>Save</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task._id)}>Delete</button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function taskList({ tasks, onUpdate, onDelete, loading }) {
  const onToggleStatus = async (id, newStatus) => {
    await onUpdate(id, { status: newStatus });
  };

  if (loading) return <div className="alert alert-info">Loading tasks...</div>;
  if (!tasks || tasks.length === 0) return <div className="alert alert-light">No tasks yet</div>;

  return (
    <div className="card p-3">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskRow
              key={task._id}
              task={task}
              onToggleStatus={onToggleStatus}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
