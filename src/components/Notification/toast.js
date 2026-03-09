import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    iconTheme: {
      primary: "#52f152ff",
      secondary: "#ffffff",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    iconTheme: {
      primary: "#dc2626",
      secondary: "#ffffff",
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const dismissToast = (id) => {
  toast.dismiss(id);
};
