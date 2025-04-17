'use client';

import { useState, useRef, useEffect } from 'react';

export default function AbsenForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingAbsensi, setExistingAbsensi] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [isCheckingWhatsapp, setIsCheckingWhatsapp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (whatsappNumber && whatsappNumber.length >= 10) {
      checkExistingAbsensi(whatsappNumber);
    } else {
      setExistingAbsensi('');
      setIsDisabled(false);
    }
  }, [whatsappNumber]);

  const checkExistingAbsensi = async (number: string) => {
    try {
      const response = await fetch(`/api/absen/check?whatsapp=${number}`);
      const data = await response.json();
      
      if (data.exists) {
        setExistingAbsensi(data.message);
        setIsDisabled(true);
      } else {
        setExistingAbsensi('');
        setIsDisabled(false);
      }
    } catch (error) {
      console.error('Error checking existing absensi:', error);
      setExistingAbsensi('');
      setIsDisabled(false);
    }
  };

  const checkWhatsappNumber = async (whatsapp: string) => {
    if (!whatsapp || whatsapp.length < 10) return;
    
    setIsCheckingWhatsapp(true);
    try {
      const response = await fetch(`/api/absen/check?whatsapp=${whatsapp}`);
      const data = await response.json();
      
      if (data.exists) {
        setMessage({
          type: 'warning',
          text: data.message
        });
      } else {
        setMessage(null);
      }
    } catch (error) {
      console.error('Error checking WhatsApp:', error);
    } finally {
      setIsCheckingWhatsapp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      nama: formData.get('nama'),
      whatsapp: formData.get('whatsapp'),
      grup: formData.get('grup')
    };

    try {
      const response = await fetch('/api/absen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan saat menyimpan absensi');
      }

      setSuccess(true);
      if (formRef.current) {
        formRef.current.reset();
      }
      setWhatsappNumber('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {success && (
        <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Berhasil!</h3>
              <p className="mt-1 text-sm text-green-700">
                Absensi Anda telah berhasil disimpan.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {existingAbsensi && (
        <div className="mb-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
              <p className="mt-1 text-sm text-yellow-700">{existingAbsensi}</p>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                className="appearance-none block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={whatsappNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setWhatsappNumber(value);
                  // Cek nomor WhatsApp setelah pengguna selesai mengetik
                  if (value.length >= 10) {
                    const timeoutId = setTimeout(() => checkWhatsappNumber(value), 500);
                    return () => clearTimeout(timeoutId);
                  }
                }}
                className="appearance-none block w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="+62 8xxxxxxxxx"
                required
              />
              {isCheckingWhatsapp && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">Contoh: 81234567890 (tanpa awalan 0/+62)</div>
            {message && (
              <p className={`mt-2 text-sm ${
                message.type === 'success' ? 'text-green-600' :
                message.type === 'error' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {message.text}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="grup" className="block text-sm font-medium text-gray-700 mb-2">
              Grup
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <select
                id="grup"
                name="grup"
                required
                className="appearance-none block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                defaultValue=""
              >
                <option value="" disabled>Pilih grup Anda</option>
                <option value="[1] Pejuang Cuan">[1] Pejuang Cuan</option>
                <option value="[2] Pejuang Cuan">[2] Pejuang Cuan</option>
                <option value="Keduanya saya join">Keduanya saya join</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isDisabled}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </div>
          ) : (
            'Simpan Absensi'
          )}
        </button>
      </form>
    </div>
  );
} 