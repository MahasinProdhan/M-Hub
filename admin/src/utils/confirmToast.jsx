import toast from "react-hot-toast";

/**
 * Reusable confirmation toast
 * @param {string} message - confirmation message
 * @param {Function} onConfirm - function to run on confirm
 */
export const confirmToast = (message, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-textPrimary">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm border rounded-md border-borderLight"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1 text-sm text-white rounded-md bg-danger"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
    },
  );
};
