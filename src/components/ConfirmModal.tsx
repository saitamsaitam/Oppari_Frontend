// src/components/ConfirmModal.tsx

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({message, onConfirm, onCancel}) => (
    <div className="modal-overlay">
    <div className="modal">
      <p>{message}</p>
      <div className="modal-buttons">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
)

export default ConfirmModal;