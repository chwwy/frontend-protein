const apiUrl = import.meta.env.VITE_API_URL;

export const PeminjamanRuanganService = {
  createPeminjaman: async (peminjamanData) => {
    try {
      // Adjust the endpoint structure
      const url = `${apiUrl}/peminjaman-ruangan/create`;
      console.log('Request URL:', url);
      console.log('Request Data:', peminjamanData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: peminjamanData.name,
          email: peminjamanData.email,
          nomorTelepon: peminjamanData.nomorTelepon,
          tanggalPeminjaman: peminjamanData.tanggalPeminjaman,
          WaktuPeminjaman: peminjamanData.WaktuPeminjaman,
          durasi: parseInt(peminjamanData.durasi),
          keperluan: peminjamanData.keperluan,
          ruanganId: peminjamanData.ruanganId
        })
      });

      console.log('Response status:', response.status);
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Terjadi kesalahan saat membuat peminjaman ruangan.'
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message === 'Server returned non-JSON response') {
        throw {
          status: 500,
          message: 'Terjadi kesalahan pada server. Mohon coba lagi nanti.'
        };
      }
      
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat membuat peminjaman ruangan.'
      };
    }
  },

  checkRuanganAvailable: async (ruanganId) => {  
    try {
      const url = `${apiUrl}/ruangan/${ruanganId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Terjadi kesalahan saat memeriksa ruangan.'
        };
      }

      return { 
        success: true, 
        isAvailable: data.status !== 'Dipakai'
      };
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message === 'Server returned non-JSON response') {
        throw {
          status: 500,
          message: 'Terjadi kesalahan pada server. Mohon coba lagi nanti.'
        };
      }

      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat memeriksa ruangan.'
      };
    }
  },

  getPeminjamanByRuanganId: async (ruanganId) => {
    try {
      const url = `${apiUrl}/peminjaman-ruangan/ruangan/${ruanganId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Peminjaman ruangan tidak ditemukan.'
        };
      }

      return { success: true, data: data.peminjaman };
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message === 'Server returned non-JSON response') {
        throw {
          status: 500,
          message: 'Terjadi kesalahan pada server. Mohon coba lagi nanti.'
        };
      }

      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data peminjaman ruangan.'
      };
    }
  }
};