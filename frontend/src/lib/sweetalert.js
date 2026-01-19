// Lazy-loaded SweetAlert2 wrapper for better performance
import dynamic from 'next/dynamic';

// This will be loaded only when needed
const loadSwal = () => import('sweetalert2');

export const showAlert = async (options) => {
    const Swal = (await loadSwal()).default;
    return Swal.fire(options);
};

export const showSuccess = async (title, text) => {
    const Swal = (await loadSwal()).default;
    return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#002B50',
    });
};

export const showError = async (title, text) => {
    const Swal = (await loadSwal()).default;
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#002B50',
    });
};

export const showConfirm = async (title, text) => {
    const Swal = (await loadSwal()).default;
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#002B50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
    });
};

export const showLoading = async (title = 'Loading...') => {
    const Swal = (await loadSwal()).default;
    return Swal.fire({
        title,
        allowOutsideClick: false,
        customClass: {
            loader: 'custom-loader'
        },
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const closeAlert = async () => {
    const Swal = (await loadSwal()).default;
    Swal.close();
};
