import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '10px',
        backgroundColor: isSuccess ? '#ecfdf5' : '#fef2f2',
        color: isSuccess ? '#065f46' : '#991b1b',
        border: `1px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '420px',
        animation: 'slideUp 0.3s ease-out forwards',
      }}
    >
      {isSuccess ? (
        <CheckCircle size={20} color="#059669" />
      ) : (
        <AlertCircle size={20} color="#dc2626" />
      )}
      <span style={{ fontSize: '14px', fontWeight: 500, flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: 'inherit',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
