// Fungsi helper untuk mendapatkan opsi status yang valid
const getValidStatusOptions = (currentStatus) => {
    const statusMap = {
        pending: [
            { value: 'paid', label: '💰 Sudah Dibayar (Paid)' },
            { value: 'processing', label: '📦 Diproses (Processing)' },
            { value: 'cancelled', label: '❌ Batalkan (Cancelled)' }
        ],
        paid: [
            { value: 'processing', label: '📦 Diproses (Processing)' },
            { value: 'cancelled', label: '❌ Batalkan (Cancelled)' }
        ],
        processing: [
            { value: 'shipped', label: '🚚 Kirim Paket (Shipped)' },
            { value: 'cancelled', label: '❌ Batalkan (Cancelled)' }
        ],
        shipped: [
            { value: 'completed', label: '✅ Tandai Selesai (Completed)' }
        ],
        completed: [],
        cancelled: []
    };

    return statusMap[currentStatus] || [];
};

// Fungsi helper untuk mendapatkan label status
const getStatusLabel = (status) => {
    const labels = {
        pending: '⏳ Menunggu Pembayaran',
        paid: '💰 Sudah Dibayar',
        processing: '📦 Diproses',
        shipped: '🚚 Dikirim',
        completed: '✅ Selesai',
        cancelled: '❌ Dibatalkan'
    };
    return labels[status] || status;
};

export { getValidStatusOptions, getStatusLabel };
