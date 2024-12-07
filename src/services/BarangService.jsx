const apiUrl = import.meta.env.VITE_API_URL;

export const BarangService = {
    createBarang: async (barangData) => {
        try {
            const url = `${apiUrl}/barang/create`;
            console.log('Request URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(barangData)
            });

            console.log('Response status:', response.status);

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan.'
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan.'
            };
        }
    },
    getAllBarang: async (page = 1, limit = 15) => {
        try {
            const url = `${apiUrl}/barang?page=${page}&limit=${limit}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat mengambil data barang.'
                };
            }

            return { success: true, data: data.barang };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat mengambil data barang.'
            };
        }
    },

    getBarangById: async (id) => {
        try {
            const url = `${apiUrl}/barang/${id}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Barang tidak ditemukan.'
                };
            }

            return { success: true, data: data.barang };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat mengambil data barang.'
            };
        }
    },

    getBarangByCode: async (codeBarang) => {
        try {
            const url = `${apiUrl}/barang/code/${codeBarang}`;
            console.log('Fetching barang with code:', codeBarang);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Barang tidak ditemukan');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    validateBarangAvailability: async (id) => {
        try {
            const url = `${apiUrl}/barang/${id}/status`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat memvalidasi barang.'
                };
            }

            return { 
                success: true, 
                isAvailable: data.barang.status === 'Tersedia',
                barang: data.barang 
            };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat memvalidasi barang.'
            };
        }
    },

    getCurrentPeminjaman: async (barangId) => {
        try {
            const url = `${apiUrl}/barang/${barangId}/peminjaman`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat mengambil data peminjaman.'
                };
            }

            return { 
                success: true, 
                data: data.peminjaman 
            };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat mengambil data peminjaman.'
            };
        }
    }
};