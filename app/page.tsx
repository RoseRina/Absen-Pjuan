import AbsenForm from './components/AbsenForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-10 sm:py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white rounded-full p-3 shadow-md mr-6">
              <img
                src="/logo-pejuang-cuan.svg" 
                alt="Logo Pejuang Cuan" 
                width={80} 
                height={80} 
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                Sistem Absensi Pejuang Cuan
              </h1>
              <p className="mt-2 text-lg text-blue-100">
                Platform absensi digital untuk anggota komunitas Pejuang Cuan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-16 mb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          {/* Content */}
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Form Absensi
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Silakan isi form di bawah ini untuk konfirmasi kehadiran Anda
              </p>
            </div>
            
            <AbsenForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Absensi Real-time</h3>
              <p className="text-gray-600">Sistem absensi yang dapat diakses kapan saja dan di mana saja dengan update secara real-time.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mudah Digunakan</h3>
              <p className="text-gray-600">Interface yang user-friendly memudahkan proses absensi tanpa perlu langkah yang rumit.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrasi WhatsApp</h3>
              <p className="text-gray-600">Terhubung langsung dengan WhatsApp untuk kemudahan komunikasi dan verifikasi.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 mb-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Pejuang Cuan. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
} 