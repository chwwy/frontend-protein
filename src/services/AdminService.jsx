const apiUrl = import.meta.env.VITE_API_URL;

export const AdminService = {
  createAdmin: async (adminData) => {
    try {
      const url = `${apiUrl}/admin/create`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(adminData)
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

  loginAdmin: async (credentials) => {
    try {
      const url = `${apiUrl}/admin/login`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Login gagal.'
        };
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat login.'
      };
    }
  },

  getAdminById: async (adminId) => {
    try {
      const url = `${apiUrl}/admin/${adminId}`;
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
          message: data.message || 'Admin tidak ditemukan.'
        };
      }

      return { success: true, data: data.admin };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data admin.'
      };
    }
  },

  updateAdmin: async (adminId, updatedData) => {
    try {
      const url = `${apiUrl}/admin/${adminId}`;
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
          message: data.message || 'Terjadi kesalahan saat memperbarui data admin.'
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat memperbarui data admin.'
      };
    }
  },

  deleteAdmin: async (adminId) => {
    try {
      const url = `${apiUrl}/admin/${adminId}`;
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
          message: response.message || 'Terjadi kesalahan saat menghapus data admin.'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('API Error:', error);
      
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat menghapus data admin.'
      };
    }
  }
};