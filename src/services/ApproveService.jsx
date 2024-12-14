const apiUrl = import.meta.env.VITE_API_URL;

export const ApproveService = {
    approveBooking: async (bookingId, approvalData) => {
        try {
            const url = `${apiUrl}/approve/${bookingId}`;
            console.log('Request URL:', url);
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(approvalData)
            });
    
            // Add debugging logs
            const responseText = await response.text();
            console.log('Raw response:', responseText);
    
            // Try to parse the response
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response:', parseError);
                throw new Error('Invalid JSON response from server');
            }
    
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.error || 'Terjadi kesalahan saat menyetujui peminjaman.'
                };
            }
    
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Terjadi kesalahan saat menyetujui peminjaman.'
            };
        }
    },

  getAllApprovedBookings: async () => {
    try {
      const url = `${apiUrl}/approve`;
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
          message: data.error || 'Terjadi kesalahan saat mengambil data peminjaman.'
        };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data peminjaman.'
      };
    }
  },

  getApprovedBooking: async (bookingId) => {
    try {
      const url = `${apiUrl}/approve/${bookingId}`;
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
          message: data.error || 'Peminjaman tidak ditemukan.'
        };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data peminjaman.'
      };
    }
  },

  updateApprovedBookingStatus: async (bookingId, statusData) => {
    try {
      const url = `${apiUrl}/approve/${bookingId}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(statusData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || 'Terjadi kesalahan saat memperbarui status peminjaman.'
        };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat memperbarui status peminjaman.'
      };
    }
  },

  getApprovedBookingsByRoom: async (ruanganId) => {
    try {
      const url = `${apiUrl}/approve/room/${ruanganId}`;
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
          message: data.error || 'Terjadi kesalahan saat mengambil data peminjaman ruangan.'
        };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('API Error:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Terjadi kesalahan saat mengambil data peminjaman ruangan.'
      };
    }
  }
};