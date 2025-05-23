'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AbsenEntry {
  _id: string;
  timestamp: string;
  nama: string;
  whatsapp: string;
  grup: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [absenData, setAbsenData] = useState<AbsenEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'selected' | 'all' | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [selectedGrup, setSelectedGrup] = useState<string>('all');
  const [copySuccessGrup, setCopySuccessGrup] = useState<string | null>(null);
  const [absenStatus, setAbsenStatus] = useState<{isOpen: boolean, message?: string, updatedAt: string}|null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomMessageForm, setShowCustomMessageForm] = useState(false);
  const [isSavingMessage, setIsSavingMessage] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = Cookies.get('adminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    fetchData();
    fetchAbsenStatus();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin');
      const data = await response.json();
      setAbsenData(data.entries || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAbsenStatus = async () => {
    try {
      const response = await fetch('/api/admin/status');
      const data = await response.json();
      
      if (data.status) {
        const formattedDate = new Date(data.status.updatedAt).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta'
        });
        
        setAbsenStatus({
          isOpen: data.status.isOpen,
          message: data.status.message,
          updatedAt: formattedDate
        });
        
        setCustomMessage(data.status.message || '');
      }
    } catch (error) {
      console.error('Error fetching absen status:', error);
    }
  };
  
  const toggleAbsenStatus = async () => {
    try {
      if (!absenStatus) return;
      
      setStatusLoading(true);
      setStatusMessage('');
      
      const newStatus = !absenStatus.isOpen;
      
      const response = await fetch('/api/admin/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isOpen: newStatus,
          message: customMessage 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const formattedDate = new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta'
        });
        
        setAbsenStatus({
          isOpen: newStatus,
          message: customMessage,
          updatedAt: formattedDate
        });
        
        setStatusMessage(`Absensi berhasil ${newStatus ? 'dibuka' : 'ditutup'}`);
        
        // Tidak perlu otomatis menghilangkan pesan
        // setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error toggling absen status:', error);
      setStatusMessage('Terjadi kesalahan saat mengubah status absensi');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('adminLoggedIn');
    router.push('/admin/login');
  };

  const getTotalByGrup = (grupName: string) => {
    return absenData.filter(entry => entry.grup.includes(grupName)).length;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEntries(absenData.map(entry => entry._id));
    } else {
      setSelectedEntries([]);
    }
  };

  const handleSelectEntry = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };

  const copyAllWhatsApp = () => {
    const numbers = absenData.map(entry => entry.whatsapp);
    // Format untuk WhatsApp: tambahkan 62 di depan
    const formattedNumbers = numbers.map(num => `62${num}`).join('\n');
    
    navigator.clipboard.writeText(formattedNumbers).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const confirmDelete = (type: 'selected' | 'all') => {
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteType(null);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      
      const endpoint = deleteType === 'all' 
        ? '/api/admin/delete-all' 
        : '/api/admin/delete';
      
      const body = deleteType === 'selected' 
        ? JSON.stringify({ ids: selectedEntries }) 
        : undefined;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setDeleteMessage(`Berhasil menghapus ${deleteType === 'all' ? 'semua' : 'data terpilih'}`);
        // Refresh data
        fetchData();
        // Reset selected entries
        setSelectedEntries([]);
      } else {
        setDeleteMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting entries:', error);
      setDeleteMessage('Terjadi kesalahan saat menghapus data');
    } finally {
      setIsLoading(false);
      closeModal();
      // Tidak perlu otomatis menghilangkan pesan
      // setTimeout(() => setDeleteMessage(''), 3000);
    }
  };

  const getTotalKeduanya = () => {
    return absenData.filter(entry => entry.grup === 'Keduanya saya join').length;
  };

  const filteredData = useMemo(() => {
    if (selectedGrup === 'all') return absenData;
    return absenData.filter(entry => entry.grup === selectedGrup);
  }, [absenData, selectedGrup]);

  const copyWhatsAppByGrup = (grup: string) => {
    const numbers = absenData
      .filter(entry => entry.grup === grup)
      .map(entry => `62${entry.whatsapp}`);
    
    if (numbers.length === 0) {
      alert('Tidak ada nomor WhatsApp untuk grup ini');
      return;
    }
    
    navigator.clipboard.writeText(numbers.join('\n')).then(() => {
      setCopySuccessGrup(grup);
      setTimeout(() => setCopySuccessGrup(null), 3000);
    });
  };

  const saveCustomMessage = async () => {
    try {
      if (!absenStatus) return;
      
      setIsSavingMessage(true);
      setStatusMessage('');
      
      const response = await fetch('/api/admin/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isOpen: absenStatus.isOpen,
          message: customMessage 
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const formattedDate = new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta'
        });
        
        setAbsenStatus({
          ...absenStatus,
          message: customMessage,
          updatedAt: formattedDate
        });
        
        setStatusMessage('Pesan berhasil disimpan');
        
        // Tidak perlu otomatis menghilangkan pesan
        // setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving custom message:', error);
      setStatusMessage('Terjadi kesalahan saat menyimpan pesan');
    } finally {
      setIsSavingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification messages */}
        {copySuccess && (
          <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Nomor WhatsApp berhasil disalin!</span>
            </div>
          </div>
        )}
        
        {statusMessage && (
          <div className={`mt-4 text-sm ${
            statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'
          } flex justify-between items-center`}>
            <span>{statusMessage}</span>
            <button 
              onClick={() => setStatusMessage('')}
              className="text-gray-500 hover:text-gray-700 ml-2"
              title="Hapus pesan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {absenStatus && !absenStatus.isOpen && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Pesan yang ditampilkan kepada pengguna:</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              "{absenStatus.message || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.'}"
            </p>
          </div>
        )}
        
        {deleteMessage && (
          <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{deleteMessage}</span>
              </div>
              <button 
                onClick={() => setDeleteMessage('')}
                className="text-gray-500 hover:text-gray-700"
                title="Hapus pesan"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Status Absensi Card */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Absensi</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-full mr-2 ${absenStatus?.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">
                  Status: <span className="font-medium">{absenStatus?.isOpen ? 'Terbuka' : 'Tertutup'}</span>
                </span>
              </div>
              {absenStatus && (
                <p className="text-sm text-gray-500 mt-1">
                  Terakhir diubah: {absenStatus.updatedAt}
                </p>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowCustomMessageForm(!showCustomMessageForm)}
                className="text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {showCustomMessageForm ? 'Sembunyikan pesan' : 'Kustomisasi pesan'}
              </button>
              
              <button
                onClick={toggleAbsenStatus}
                disabled={statusLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  absenStatus?.isOpen
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                }`}
              >
                {statusLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : absenStatus?.isOpen ? (
                  'Tutup Absensi'
                ) : (
                  'Buka Absensi'
                )}
              </button>
            </div>
          </div>
          
          {showCustomMessageForm && (
            <div className="mt-4 border-t pt-4">
              <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-2">
                Pesan saat absensi ditutup:
              </label>
              <textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                rows={3}
                placeholder="Masukkan pesan yang akan ditampilkan ketika absensi ditutup"
              />
              <p className="mt-1 text-xs text-gray-500">
                Pesan ini akan ditampilkan kepada pengguna saat mencoba melakukan absensi ketika absensi ditutup.
              </p>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={saveCustomMessage}
                  disabled={isSavingMessage}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  {isSavingMessage ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Pesan'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Absensi</h3>
            <p className="text-3xl font-bold text-blue-600">{absenData.length}</p>
            <button
              onClick={copyAllWhatsApp}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              {copySuccess ? 'Tersalin!' : 'Salin Semua No. WA'}
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">[1] Pejuang Cuan</h3>
            <p className="text-3xl font-bold text-green-600">
              {getTotalByGrup('[1] Pejuang Cuan')}
            </p>
            <button
              onClick={() => copyWhatsAppByGrup('[1] Pejuang Cuan')}
              className="mt-2 text-sm text-green-600 hover:text-green-800"
            >
              {copySuccessGrup === '[1] Pejuang Cuan' ? 'Tersalin!' : 'Salin No. WA'}
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">[2] Pejuang Cuan</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {getTotalByGrup('[2] Pejuang Cuan')}
            </p>
            <button
              onClick={() => copyWhatsAppByGrup('[2] Pejuang Cuan')}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              {copySuccessGrup === '[2] Pejuang Cuan' ? 'Tersalin!' : 'Salin No. WA'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Keduanya</h3>
            <p className="text-3xl font-bold text-purple-600">
              {getTotalKeduanya()}
            </p>
            <button
              onClick={() => copyWhatsAppByGrup('Keduanya saya join')}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              {copySuccessGrup === 'Keduanya saya join' ? 'Tersalin!' : 'Salin No. WA'}
            </button>
          </div>
        </div>

        {/* Filter Grup */}
        <div className="mb-6">
          <select
            value={selectedGrup}
            onChange={(e) => setSelectedGrup(e.target.value)}
            className="mt-1 block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">Semua Grup</option>
            <option value="[1] Pejuang Cuan">Pejuang Cuan 1</option>
            <option value="[2] Pejuang Cuan">Pejuang Cuan 2</option>
            <option value="Keduanya saya join">Keduanya</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyAllWhatsApp}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
              Salin Semua Nomor WA
            </button>
            
            <button
              onClick={() => confirmDelete('selected')}
              disabled={selectedEntries.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Hapus Terpilih ({selectedEntries.length})
            </button>
          </div>
          
          <button
            onClick={() => confirmDelete('all')}
            disabled={absenData.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Hapus Semua Data
          </button>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Data Absensi</h2>
              <p className="mt-1 text-sm text-gray-500">
                {selectedGrup === 'all' 
                  ? 'Daftar lengkap absensi peserta Pejuang Cuan'
                  : `Menampilkan data untuk grup ${selectedGrup}`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedEntries.length === absenData.length && absenData.length > 0}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Grup
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedEntries.includes(entry._id)}
                          onChange={() => handleSelectEntry(entry._id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="mr-2">+62{entry.whatsapp}</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`62${entry.whatsapp}`);
                            }}
                            className="text-gray-400 hover:text-blue-600"
                            title="Salin nomor"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.grup === '[1] Pejuang Cuan' 
                            ? 'bg-green-100 text-green-800' 
                            : entry.grup === '[2] Pejuang Cuan'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}>
                          {entry.grup}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                        {selectedGrup === 'all' 
                          ? 'Tidak ada data absensi'
                          : `Tidak ada data absensi untuk grup ${selectedGrup}`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {deleteType === 'all' ? 'Hapus Semua Data' : 'Hapus Data Terpilih'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {deleteType === 'all' 
                          ? 'Apakah Anda yakin ingin menghapus semua data absensi? Tindakan ini tidak dapat dibatalkan.' 
                          : `Apakah Anda yakin ingin menghapus ${selectedEntries.length} data terpilih? Tindakan ini tidak dapat dibatalkan.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 