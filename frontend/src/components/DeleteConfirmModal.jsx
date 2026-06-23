import { AlertTriangleIcon, Loader2Icon } from "lucide-react";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box border border-error/15 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-full bg-error/10 flex items-center justify-center animate-subtle-bounce">
            <AlertTriangleIcon className="size-6 text-error" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Delete Problem</h3>
            <p className="text-base-content/60 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <p className="py-2">
          Are you sure you want to delete <span className="font-semibold text-error">"{title}"</span>?
        </p>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default DeleteConfirmModal;
