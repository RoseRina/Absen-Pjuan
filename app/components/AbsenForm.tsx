'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaUserAlt, FaWhatsapp, FaUsers, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { MdWarning, MdInfo } from 'react-icons/md';

export default function AbsenForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingAbsensi, setExistingAbsensi] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [isCheckingWhatsapp, setIsCheckingWhatsapp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [absensiClosed, setAbsensiClosed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Maaf, absensi sedang ditutup. Silakan coba lagi nanti.');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Cek status absensi saat komponen dimuat
    checkAbsensiStatus();
  }, []);

  useEffect(() => {
    if (whatsappNumber && whatsappNumber.length >= 10) {
      checkExistingAbsensi(whatsappNumber);
    } else {
      setExistingAbsensi('');
      setIsDisabled(false);
    }
  }, [whatsappNumber]);

  const checkAbsensiStatus = async () => {
    try {
      const response = await fetch('/api/admin/status');
      const data = await response.json();
      
      if (data.status && data.status.isOpen === false) {
        setAbsensiClosed(true);
        setStatusMessage(data.status.message || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.');
        setMessage({
          type: 'warning',
          text: data.status.message || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.'
        });
        setIsDisabled(true);
      } else {
        setAbsensiClosed(false);
        setMessage(null);
      }
    } catch (error) {
      console.error('Error checking absensi status:', error);
    }
  };

  const checkExistingAbsensi = async (number: string) => {
    try {
      const response = await fetch(`/api/absen/check?whatsapp=${number}`);
      const data = await response.json();
      
      if (data.absensiClosed) {
        setAbsensiClosed(true);
        setStatusMessage(data.message || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.');
        setMessage({
          type: 'warning',
          text: data.message
        });
        setExistingAbsensi(''); // Reset existingAbsensi untuk menghindari duplikasi pesan
        setIsDisabled(true);
        return;
      }
      
      if (data.exists) {
        setExistingAbsensi(data.message);
        setMessage(null); // Reset message untuk menghindari duplikasi pesan
        setIsDisabled(true);
      } else {
        setExistingAbsensi('');
        setIsDisabled(false);
        if (!absensiClosed) {
          setMessage(null);
        }
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
      
      if (data.absensiClosed) {
        setAbsensiClosed(true);
        setStatusMessage(data.message || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.');
        setMessage({
          type: 'warning',
          text: data.message
        });
        setExistingAbsensi(''); // Reset existingAbsensi untuk menghindari duplikasi pesan
        setIsDisabled(true);
        return;
      }
      
      if (data.exists) {
        setExistingAbsensi(data.message); // Gunakan existingAbsensi daripada message
        setMessage(null); // Reset message untuk menghindari duplikasi pesan
      } else if (!absensiClosed) {
        setMessage(null);
        setExistingAbsensi('');
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
        if (result.absensiClosed) {
          setAbsensiClosed(true);
          throw new Error(result.error || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.');
        }
        throw new Error(result.error || 'Terjadi kesalahan saat menyimpan absensi');
      }

      setSuccess(true);
      if (formRef.current) {
        formRef.current.reset();
      }
      setWhatsappNumber('');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (absensiClosed) {
    // Tampilan full informasi ketika absensi ditutup
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-5 text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MdWarning className="text-4xl text-yellow-300 animate-pulse" />
            <h1 className="text-2xl font-bold">Perhatian</h1>
          </div>
          <p className="text-center text-lg font-medium">Absensi Ditutup</p>
        </div>
        
        <div className="p-6">
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0 text-orange-500 mr-3">
                <MdInfo className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-orange-800">Informasi</h3>
                <p className="mt-2 text-md text-orange-700 whitespace-pre-line">{statusMessage}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FaCalendarAlt className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Dibuka Kembali</p>
                <p className="text-gray-900 font-semibold">Bulan Mei 2025</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FaClock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Waktu</p>
                <p className="text-gray-900 font-semibold">Akan diinformasikan kemudian</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <FaUsers className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Grup</p>
                <p className="text-gray-900 font-semibold">Pejuang Cuan 1 & 2</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a href="https://t.me/+62Bz80xtc8g0MWJl" 
               className="inline-flex items-center px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
              <svg className="h-5 w-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7l-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1l114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4l-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/>
              </svg>
              Gabung Channel Telegram
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {success && (
        <div className="mb-6 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-green-500 mr-3">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700 font-medium">
              Absensi berhasil disimpan! Terima kasih.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0 text-red-500 mr-3">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {existingAbsensi && (
        <div className="mb-6 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
          <div className="flex">
            <div className="flex-shrink-0 text-yellow-500 mr-3">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Perhatian</h3>
              <p className="mt-1 text-sm text-yellow-700 whitespace-pre-line">{existingAbsensi}</p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`mb-6 ${
          message.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
          message.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
          'bg-yellow-50 border-l-4 border-yellow-500'
        } rounded-lg p-4`}>
          <div className="flex">
            <div className={`flex-shrink-0 mr-3 ${
              message.type === 'success' ? 'text-green-500' :
              message.type === 'error' ? 'text-red-500' :
              'text-yellow-500'
            }`}>
              {message.type === 'success' && (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message.type === 'error' && (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message.type === 'warning' && (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                {message.type === 'success' ? 'Berhasil' :
                 message.type === 'error' ? 'Terjadi Kesalahan' : 'Perhatian'}
              </h3>
              <p className={`mt-1 text-sm whitespace-pre-line ${
                message.type === 'success' ? 'text-green-700' :
                message.type === 'error' ? 'text-red-700' :
                'text-yellow-700'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaUserAlt className="h-5 w-5" />
            </div>
            <input
              type="text"
              id="nama"
              name="nama"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
            Nomor WhatsApp
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaWhatsapp className="h-5 w-5" />
            </div>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={whatsappNumber}
              onChange={(e) => {
                const value = e.target.value;
                setWhatsappNumber(value);
                // Nonaktifkan tombol jika nomor cukup panjang untuk divalidasi
                if (value.length >= 10) {
                  setIsCheckingWhatsapp(true);
                  const timeoutId = setTimeout(() => checkWhatsappNumber(value), 500);
                  return () => clearTimeout(timeoutId);
                }
              }}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="81234567890"
              required
            />
            {isCheckingWhatsapp && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Contoh: 81234567890 (tanpa awalan 0/+62)</p>
        </div>

        <div>
          <label htmlFor="grup" className="block text-sm font-medium text-gray-700 mb-1">
            Grup
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaUsers className="h-5 w-5" />
            </div>
            <select
              id="grup"
              name="grup"
              required
              className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              defaultValue=""
            >
              <option value="" disabled>Pilih grup</option>
              <option value="[1] Pejuang Cuan">[1] Pejuang Cuan</option>
              <option value="[2] Pejuang Cuan">[2] Pejuang Cuan</option>
              <option value="Keduanya saya join">Keduanya saya join</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isDisabled || isCheckingWhatsapp}
          className="w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : isCheckingWhatsapp ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memeriksa WhatsApp...
            </>
          ) : (
            'Simpan Absensi'
          )}
        </button>
      </form>
    </div>
  );
} 