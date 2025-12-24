import "./ConfirmModal.css";

export function ConfirmModal({
  show,
  title = "Are you sure?",
  message = "Changes you made may not be saved.",
  confirmText = "Leave",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button style={{width:'73px'}} className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
          <button style={{width:'73px'}} className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
