'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [absenData, setAbsenData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin');
        const data = await response.json();
        setAbsenData(data.entries);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Absensi</h3>
            <p className="text-3xl font-bold text-blue-600">{absenData.length}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pejuang Cuan</h3>
            <p className="text-3xl font-bold text-green-600">
              {absenData.filter(entry => entry.includes('Pejuang Cuan')).length}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pejuang Cuan 2</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {absenData.filter(entry => entry.includes('Pejuang Cuan 2')).length}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Grup
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {absenData.map((entry, index) => {
                    const [timestamp, nama, whatsapp, grup] = entry.split('|').map(item => item.trim());
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{nama}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                              {whatsapp}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            grup === 'Keduanya' ? 'bg-purple-100 text-purple-800' :
                            grup === 'Pejuang Cuan' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {grup}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 