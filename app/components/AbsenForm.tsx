'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaWhatsapp, FaUsers } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { BsCheck2Circle } from 'react-icons/bs';
import { ImSpinner8 } from 'react-icons/im';

export default function AbsenForm() {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isValidWhatsapp, setIsValidWhatsapp] = useState(true);
  const [domisili, setDomisili] = useState('');
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fade, setFade] = useState(false);
  const [existingAbsensi, setExistingAbsensi] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [isCheckingWhatsapp, setIsCheckingWhatsapp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [absensiClosed, setAbsensiClosed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Cek status absensi saat komponen dimuat
    checkAbsensiStatus();
  }, []);

  useEffect(() => {
    if (whatsapp && whatsapp.length >= 10) {
      checkExistingAbsensi(whatsapp);
    } else {
      setExistingAbsensi('');
      setIsDisabled(false);
    }
  }, [whatsapp]);

  const checkAbsensiStatus = async () => {
    try {
      const response = await fetch('/api/admin/status');
      const data = await response.json();
      
      if (data.status && data.status.isOpen === false) {
        setAbsensiClosed(true);
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
        setMessage({
          type: 'warning',
          text: data.message
        });
        setIsDisabled(true);
        return;
      }
      
      if (data.exists) {
        setExistingAbsensi(data.message);
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
        setMessage({
          type: 'warning',
          text: data.message
        });
        setIsDisabled(true);
        return;
      }
      
      if (data.exists) {
        setMessage({
          type: 'warning',
          text: data.message
        });
      } else if (!absensiClosed) {
        setMessage(null);
      }
    } catch (error) {
      console.error('Error checking WhatsApp:', error);
    } finally {
      setIsCheckingWhatsapp(false);
    }
  };

  const validateWhatsapp = (number: string) => {
    // Format harus dimulai dengan 628 dan minimal 10 digit, maksimal 15 digit
    const regex = /^628\d{8,13}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validasi nomor WhatsApp
    if (!validateWhatsapp(whatsapp)) {
      setIsValidWhatsapp(false);
      setError('Nomor WhatsApp harus dimulai dengan 628 dan berisi 10-15 digit');
      return;
    }

    // Validasi form
    if (!nama || !whatsapp || !domisili || !group) {
      setError('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/absen', {
        nama,
        whatsapp,
        domisili,
        group,
        tanggal: new Date().toISOString(),
      });

      if (response.status === 200) {
        setSuccess(true);
        setNama('');
        setWhatsapp('');
        setDomisili('');
        setGroup('');
        setFade(true);
        setTimeout(() => {
          setFade(false);
          setTimeout(() => {
            setSuccess(false);
          }, 300);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (whatsapp) {
      setIsValidWhatsapp(validateWhatsapp(whatsapp));
    } else {
      setIsValidWhatsapp(true);
    }
  }, [whatsapp]);

  return (
    <div className="max-w-md mx-auto">
      {success && (
        <div className={`bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center">
            <BsCheck2Circle className="flex-shrink-0 h-6 w-6 text-green-500 mr-3" />
            <p className="text-green-700 font-medium">
              Absensi berhasil disimpan! Terima kasih.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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

      {message && (
        <div className={`mb-6 ${
          message.type === 'success' ? 'bg-green-50 border-green-200' :
          message.type === 'error' ? 'bg-red-50 border-red-200' :
          'bg-yellow-50 border-yellow-200'
        } rounded-lg p-4 border`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' && (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message.type === 'error' && (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {message.type === 'warning' && (
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                {message.type === 'success' ? 'Berhasil' :
                 message.type === 'error' ? 'Terjadi Kesalahan' : 'Perhatian'}
              </h3>
              <p className={`mt-1 text-sm whitespace-pre-line ${
                message.type === 'success' ? 'text-green-600' :
                message.type === 'error' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="nama"
              name="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaWhatsapp className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={whatsapp}
              onChange={(e) => {
                const value = e.target.value;
                setWhatsapp(value);
                // Cek nomor WhatsApp setelah pengguna selesai mengetik
                if (value.length >= 10) {
                  const timeoutId = setTimeout(() => checkWhatsappNumber(value), 500);
                  return () => clearTimeout(timeoutId);
                }
              }}
              className={`block w-full pl-10 pr-3 py-3 border ${!isValidWhatsapp ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg transition-all shadow-sm`}
              placeholder="628xxxxxxxxxx"
              required
            />
          </div>
          {!isValidWhatsapp && whatsapp && (
            <p className="mt-1 text-sm text-red-600">
              Nomor harus dimulai dengan 628 dan berisi 10-15 digit
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Format: 628xxxxxxxxxx (Tanpa tanda +)
          </p>
        </div>

        <div>
          <label htmlFor="domisili" className="block text-sm font-medium text-gray-700 mb-1">
            Domisili
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdLocationOn className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="domisili"
              name="domisili"
              value={domisili}
              onChange={(e) => setDomisili(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Kota domisili"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
            Grup
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUsers className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="group"
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg appearance-none bg-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              required
            >
              <option value="" disabled>Pilih grup</option>
              <option value="Grup A">Grup A</option>
              <option value="Grup B">Grup B</option>
              <option value="Grup C">Grup C</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || isDisabled}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium"
          >
            {loading ? (
              <>
                <ImSpinner8 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Memproses...
              </>
            ) : (
              'Kirim Absensi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 