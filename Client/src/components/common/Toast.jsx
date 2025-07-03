import { useToast } from "@/hooks/use-toast";

const useToastNotification = () => {
    const { toast } = useToast();

    const showSuccess = (title, description) => {
        toast({
            title: title || "Success",
            description: description || "Operation completed successfully!",
            variant: "default",
        });
    };

    const showError = (title, description) => {
        toast({
            title: title || "Error",
            description: description || "Something went wrong. Please try again.",
            variant: "destructive",
        });
    };

    const showInfo = (title, description) => {
        toast({
            title: title || "Info",
            description: description || "Information message",
            variant: "default",
        });
    };

    const showWarning = (title, description) => {
        toast({
            title: title || "Warning",
            description: description || "Warning message",
            variant: "default",
        });
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };
};

export default useToastNotification; 