const apiUrl = import.meta.env.VITE_API_URL;

export const PeminjamanBarangService = {
    createPeminjaman: async (barangId, peminjamanData) => {
        try {
            const url = `${apiUrl}/peminjaman/create/${barangId}`;
            console.log('Making request to:', url);
            console.log('With data:', peminjamanData);
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: peminjamanData.name,
                    nip: peminjamanData.nip,
                    division: peminjamanData.division,
                    durasi: parseInt(peminjamanData.durasi),
                    keterangan: peminjamanData.keterangan
                })
            });
    
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);
    
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat membuat peminjaman.'
                };
            }
    
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat membuat peminjaman.'
            };
        }
    },

    getPeminjamanByCode: async (codeBarang) => {
        try {
            const url = `${apiUrl}/peminjaman/code/${codeBarang}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Peminjaman tidak ditemukan'
                };
            }
    
            return { success: true, data: data.peminjaman };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getAllPeminjaman: async (page = 1, limit = 15) => {
        try {
            const url = `${apiUrl}/peminjaman?page=${page}&limit=${limit}`;
            const response = await fetch(url, {
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat mengambil data peminjaman.'
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat mengambil data peminjaman.'
            };
        }
    },

    pengembalianBarang: async (peminjamanId) => {
        try {
            const url = `${apiUrl}/peminjaman/pengembalian/${peminjamanId}`;
            console.log('Making request to:', url);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat mengembalikan barang.'
                };
            }
    
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat mengembalikan barang.'
            };
        }
    },

    resetPengembalianBarang: async () => {
        try {
            const url = `${apiUrl}/peminjaman/reset`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan saat mereset pengembalian barang.'
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat mereset pengembalian barang.'
            };
        }
    }
};