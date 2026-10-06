import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-warning-icon">
            <AlertTriangle size={24} color="#dc2626" />
          </div>
          <h3>Confirm Post Deletion</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to delete <strong>"{title}"</strong>?
          </p>
          <p className="modal-subtext">
            This action cannot be undone and will permanently remove this blog post.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
