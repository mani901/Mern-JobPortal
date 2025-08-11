import { toast } from "react-hot-toast";

const useToastNotification = () => {
  const showSuccess = (title, description) => {
    toast.success(description || title || "Success");
  };

  const showError = (title, description) => {
    toast.error(
      description || title || "Something went wrong. Please try again."
    );
  };

  const showInfo = (title, description) => {
    toast(description || title || "Info");
  };

  const showWarning = (title, description) => {
    toast(description || title || "Warning");
  };

  return { showSuccess, showError, showInfo, showWarning };
};

export default useToastNotification;
