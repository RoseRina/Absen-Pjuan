'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AbsenForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    grup: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/absen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Absensi berhasil disimpan!');
        setFormData({ nama: '', whatsapp: '', grup: '' });
      } else {
        alert('Terjadi kesalahan saat menyimpan absensi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan pada sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Form Absensi</h2>
      
      <div className="mb-4">
        <label htmlFor="nama" className="block text-gray-700 font-medium mb-2">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="nama"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="whatsapp" className="block text-gray-700 font-medium mb-2">
          Nomor WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.whatsapp}
          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="grup" className="block text-gray-700 font-medium mb-2">
          Pilih Grup
        </label>
        <select
          id="grup"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.grup}
          onChange={(e) => setFormData({ ...formData, grup: e.target.value })}
        >
          <option value="">Pilih Grup</option>
          <option value="Pejuang Cuan">Pejuang Cuan</option>
          <option value="Pejuang Cuan 2">Pejuang Cuan 2</option>
          <option value="Keduanya">Keduanya saya Join</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? 'Menyimpan...' : 'Kirim Absensi'}
      </button>
    </form>
  );
};

export default AbsenForm; 