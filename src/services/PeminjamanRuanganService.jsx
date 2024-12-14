const apiUrl = import.meta.env.VITE_API_URL;

export const PeminjamanRuanganService = {
  createPeminjaman: async (peminjamanData) => {
    try {
      const url = `${apiUrl}/peminjaman-ruangan/`;
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
          startTime: peminjamanData.startTime,
          endTime: peminjamanData.endTime,
          keperluan: peminjamanData.keperluan,
          ruanganId: peminjamanData.ruanganId
        })
      });

      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  getAllPeminjaman: async (page = 1, limit = 15) => {
    try {
      const url = `${apiUrl}/peminjaman-ruangan?page=${page}&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  getPeminjamanById: async (id) => {
    try {
      const url = `${apiUrl}/peminjaman-ruangan/${id}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      handleError(error);
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

      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  updatePeminjaman: async (id, updateData) => {
    try {
      const url = `${apiUrl}/peminjaman-ruangan/status/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  selesaiPeminjaman: async (id) => {
    try {
      const url = `${apiUrl}/peminjaman-ruangan/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  checkRuanganAvailable: async (ruanganId) => {  
    try {
        const url = `${apiUrl}/peminjaman-ruangan/check/${ruanganId}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'Terjadi kesalahan saat memeriksa ruangan.'
            };
        }

        return data;
    } catch (error) {
        handleError(error);
    }
  },

  startAutoStatusCheck: (ruanganId, onStatusChange) => {
    PeminjamanRuanganService.checkRuanganAvailable(ruanganId)
      .then(onStatusChange)
      .catch(console.error);

    const intervalId = setInterval(() => {
      PeminjamanRuanganService.checkRuanganAvailable(ruanganId)
        .then(onStatusChange)
        .catch(console.error);
    }, 60000); 

    return () => clearInterval(intervalId);
  }
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'Ruangan sudah di-booking di waktu tersebut. Cek dashboard untuk jadwal.'
    };
  }

  return { success: true, data };
};

const handleError = (error) => {
  console.error('API Error:', error);
  
  if (error.message === 'Server returned non-JSON response') {
    throw {
      status: 500,
      message: 'Terjadi kesalahan pada server. Mohon coba lagi nanti.'
    };
  }
  
  throw {
    status: error.status || 500,
    message: error.message || 'Terjadi kesalahan pada server.'
  };
};