import axios from '../../utils/axios';

const API_URL = 'http://localhost:3000/api'; // Sesuaikan dengan URL API Anda

export const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data.data; // Misalnya: { accessToken, refreshToken, user: { id, email, role } }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login gagal');
    }
  },

  register: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/seller`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Misalnya: { message: 'Registrasi berhasil' }
    } catch (error) {
      // Tangani error dari express-validator
      if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.map(err => err.msg).join(', '));
      }
      throw new Error(error.response?.data?.message || 'Registrasi gagal');
    }
  },

  logout: () => {
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('AdminRefreshToken');
    localStorage.removeItem('AdminUser');
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
      return response.data; // Misalnya: { accessToken, refreshToken }
    } catch (error) {
      throw new Error('Gagal memperbarui token');
    }
  },

  getProducts: async () => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.get(`${API_URL}/product/my-product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat produk');
    }
  },
  
  addProduct: async (productData) => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.post(`${API_URL}/product`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // jika mengunggah file/gambar
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menambahkan produk');
    }
  },
  
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat order');
    }
  },

  updatePaymentStatus: async (paymentId) => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.put(
        `${API_URL}/payment/confirm-cod/${paymentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memperbarui status pembayaran');
    }
  },  

  updateOrderStatus: async (orderId, newStatus) => {
    const token = localStorage.getItem('Admintoken'); // atau 'Sellertoken' jika yang login seller
  
    try {
      const response = await axios.patch(
        `${API_URL}/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengubah status pesanan');
    }
  },  

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat kategori');
    }
  },

  getSellerMe: async () => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.get(`${API_URL}/seller/me` ,{
        headers: {
          Authorization : `Bearer ${token}`,
        },
      })
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || `Gagal membuat data seller`)
    }
  },

  getCustomers: async (sellerId) => {
    try {
      const response = await axios.get(`${API_URL}/chats`, {
        params: { sellerId, timestamp: new Date().getTime() },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat pelanggan');
    }
  },

  getVouchers: async () => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.get(`${API_URL}/vouchers`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat voucher');
    }
  },

  addVoucher: async (voucherData) => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.post(`${API_URL}/vouchers`, voucherData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // karena data dikirim JSON, bukan multipart
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menambahkan voucher');
    }
  },  

  updateVoucher: async (voucherId, updateData) => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.put(`${API_URL}/vouchers/${voucherId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memperbarui voucher');
    }
  },
  
  deleteVoucher: async (voucherId) => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.delete(`${API_URL}/vouchers/${voucherId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus voucher');
    }
  },  

  getSeller: async () => {
    const token = localStorage.getItem('Admintoken');
    try {
      const response = await axios.get(`${API_URL}/seller/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat data penjual');
    }
  },

  getChats: async (sellerId) => {
    try {
      const response = await axios.get(`${API_URL}/chats`, {
        params: { sellerId, timestamp: new Date().getTime() },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat daftar chat');
    }
  },

  getChatMessages: async (userId, sellerId) => {
    try {
      const response = await axios.get(`${API_URL}/chats`, {
        params: { userId, sellerId, timestamp: new Date().getTime() },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat pesan');
    }
  },

  sendMessage: async (chatId, senderId, senderType, content) => {
    try {
      const response = await axios.post(`${API_URL}/messages`, {
        chatId,
        senderId,
        senderType,
        content,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengirim pesan');
    }
  },

  updateSellerProfile: async (sellerId, data) => {
    const token = localStorage.getItem('Admintoken');
    const response = await axios.put(`${API_URL}/seller/${sellerId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
  
};