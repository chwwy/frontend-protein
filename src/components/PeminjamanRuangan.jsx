import React, { useState, useEffect } from 'react';
import { PeminjamanRuanganService } from '../services/PeminjamanRuanganService';
import { RuanganService } from '../services/RuanganService';

const FormPeminjamanRuangan = () => {
    const [ruanganList, setRuanganList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [minDateTime, setMinDateTime] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nomorTelepon: '',
        startTime: '',
        endTime: '',
        ruanganId: '',
        keperluan: ''
    });

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        setMinDateTime(formattedDateTime);
      }, []);

    useEffect(() => {
        fetchRuangan();
    }, []);

    const fetchRuangan = async () => {
        try {
            const response = await RuanganService.getAllRuangan();
            if (response.success) {
                setRuanganList(response.data);
            }
        } catch (err) {
            setError('Gagal mengambil data ruangan');
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(null);
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.nomorTelepon || 
            !formData.startTime || !formData.endTime || !formData.ruanganId || !formData.keperluan) {
            setError('Semua field harus diisi');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Format email tidak valid');
            return false;
        }

        const phoneRegex = /^[0-9\-+]{10,15}$/;
        if (!phoneRegex.test(formData.nomorTelepon)) {
            setError('Nomor telepon tidak valid');
            return false;
        }

        const now = new Date();
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);

        if (start < now) {
            setError('Waktu mulai tidak boleh kurang dari waktu sekarang');
            return false;
        }

        if (end <= start) {
            setError('Waktu selesai harus lebih besar dari waktu mulai');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const response = await PeminjamanRuanganService.createPeminjaman(formData);

            if (response.success) {
                alert('Peminjaman berhasil dibuat!');
                handleReset();
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat membuat peminjaman');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            nomorTelepon: '',
            startTime: '',
            endTime: '',
            ruanganId: '',
            keperluan: ''
        });
        setError(null);
    };

    return (
        <main className="flex-1 lg:ml-[300px] p-4 transition-all duration-500 bg-gray-100">
            <div className="flex flex-col items-start p-4 md:p-8 min-h-screen">
                <h2 className="text-2xl font-semibold mb-6 md:mb-10 text-gray-800">Form Peminjaman Ruangan</h2>

                {error && (
                    <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nama Peminjam</label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nomor Telepon</label>
                            <input 
                                type="text"
                                name="nomorTelepon"
                                value={formData.nomorTelepon}
                                onChange={handleInputChange}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Waktu Mulai</label>
                            <input 
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                min={minDateTime}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Waktu Selesai</label>
                            <input 
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                min={minDateTime}
                                className="border rounded w-full py-2 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Ruangan</label>
                            <select 
                                name="ruanganId"
                                value={formData.ruanganId}
                                onChange={handleInputChange}
                                className="border rounded w-full py-2 px-3"
                            >
                                <option value="">Pilih Ruangan</option>
                                {ruanganList.map((ruangan) => (
                                    <option key={ruangan._id} value={ruangan._id}>
                                        {ruangan.unit} - {ruangan.ruanganId}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Keperluan</label>
                        <textarea 
                            name="keperluan"
                            value={formData.keperluan}
                            onChange={handleInputChange}
                            rows="4"
                            className="border rounded w-full py-2 px-3"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {loading ? 'Loading...' : 'Submit'}
                        </button>
                        <button 
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default FormPeminjamanRuangan;