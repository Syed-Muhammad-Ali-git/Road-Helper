/**
 * SweetAlert utility - use everywhere instead of native alert()
 * Now with theme support
 */
import Swal, { SweetAlertOptions } from "sweetalert2";

const getThemeConfig = (): SweetAlertOptions => {
  const isDark = document.documentElement.classList.contains("dark");

  return isDark
    ? {
        background: "#111827",
        color: "#f3f4f6",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        iconColor: "#ef4444",
        backdrop: "rgba(0, 0, 0, 0.5)",
      }
    : {
        background: "#ffffff",
        color: "#111827",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#d1d5db",
        iconColor: "#ef4444",
        backdrop: "rgba(0, 0, 0, 0.3)",
      };
};

export const showSuccess = (title: string, text?: string) =>
  Swal.fire({
    icon: "success",
    title,
    text: text ?? "",
    ...getThemeConfig(),
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      title: "text-lg font-bold",
    },
  });

export const showError = (title: string, text?: string) =>
  Swal.fire({
    icon: "error",
    title,
    text: text ?? "",
    ...getThemeConfig(),
  });

export const showInfo = (title: string, text?: string) =>
  Swal.fire({
    icon: "info",
    title,
    text: text ?? "",
    ...getThemeConfig(),
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      title: "text-xl font-bold",
      confirmButton: "px-6 py-2.5 rounded-xl font-semibold",
    },
  });

export const showWarning = (title: string, text?: string) =>
  Swal.fire({
    icon: "warning",
    title,
    text: text ?? "",
    ...getThemeConfig(),
  });

export const showConfirm = (
  title: string,
  text: string,
  confirmText = "Yes"
): Promise<{ isConfirmed: boolean }> =>
  Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "No",
    ...getThemeConfig(),
    customClass: {
      confirmButton: "px-4 py-2 rounded-lg font-semibold",
      cancelButton: "px-4 py-2 rounded-lg font-semibold",
    },
  });

export const showLoading = (title: string) =>
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: async () => {
      await Swal.showLoading();
    },
    ...getThemeConfig(),
  });

export const closeAlert = () => Swal.close();

export default Swal;
