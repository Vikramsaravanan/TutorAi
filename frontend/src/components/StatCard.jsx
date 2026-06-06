// src/components/StatCard.jsx
import React from 'react';

export default function StatCard({ title, value, icon, description, progress, color = 'var(--primary)' }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{title}</h3>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{value}</p>
        </div>
        <div style={{ background: `rgba(${color === 'var(--primary)' ? '99, 102, 241' : '34, 197, 94'}, 0.2)`, padding: '0.75rem', borderRadius: '50%', color: color }}>
          {icon}
        </div>
      </div>
      
      {progress !== undefined && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
            <span>Progress</span>
            <span>{typeof progress === 'number' ? `${progress}%` : progress}</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: typeof progress === 'number' ? `${progress}%` : progress || '0%', height: '100%', background: color, borderRadius: '999px', transition: 'width 1s ease-out' }} />
          </div>
        </div>
      )}
      
      {description && (
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{description}</p>
      )}
    </div>
  );
}
