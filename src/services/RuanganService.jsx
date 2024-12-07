const apiUrl = import.meta.env.VITE_API_URL;

export const RuanganService = {
  createRuangan: async (ruanganData) => {
    try {
      const url = `${apiUrl}/ruangan/create`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ruanganData)
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

  updateRuangan: async (ruanganId, updatedData) => {
    try {
      const url = `${apiUrl}/ruangan/${ruanganId}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Terjadi kesalahan saat memperbarui data ruangan.'
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat memperbarui data ruangan.'
      };
    }
  },

  deleteRuangan: async (ruanganId) => {
    try {
      const url = `${apiUrl}/ruangan/${ruanganId}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw {
          status: response.status,
          message: response.message || 'Terjadi kesalahan saat menghapus data ruangan.'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('API Error:', error);
      
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat menghapus data ruangan.'
      };
    }
  },

  getRuanganById: async (ruanganId) => {
    try {
      const url = `${apiUrl}/ruangan/${ruanganId}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Ruangan tidak ditemukan.'
        };
      }

      return { success: true, data: data.ruangan };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data ruangan.'
      };
    }
  },

  getRuanganByUnit: async (unit) => {
    try {
      const url = `${apiUrl}/ruangan/unit/${unit}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Ruangan tidak ditemukan.'
        };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data ruangan.'
      };
    }
  },

  getAllRuangan: async () => {
    try {
      const url = `${apiUrl}/ruangan`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Terjadi kesalahan saat mengambil data ruangan.'
        };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data ruangan.'
      };
    }
  }
};