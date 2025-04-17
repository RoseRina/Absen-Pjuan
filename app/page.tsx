import AbsenForm from './components/AbsenForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 pt-6 pb-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start">
            <div className="flex-shrink-0 bg-white rounded-full p-1.5 shadow-lg mr-4">
              <img
                src="/logo-pejuang-cuan.svg" 
                alt="Logo Pejuang Cuan" 
                width={60} 
                height={60} 
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
                Sistem Absensi Pejuang Cuan
              </h1>
              <p className="text-sm text-blue-100 max-w-3xl">
                Platform absensi digital untuk anggota komunitas Pejuang Cuan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          {/* Content */}
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Form Absensi
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Silakan isi form di bawah ini untuk konfirmasi kehadiran Anda
              </p>
            </div>
            
            <AbsenForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Absensi Real-time</h3>
              <p className="text-sm text-gray-600">Sistem absensi yang dapat diakses kapan saja dan di mana saja.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Mudah Digunakan</h3>
              <p className="text-sm text-gray-600">Interface yang user-friendly memudahkan proses absensi.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Integrasi WhatsApp</h3>
              <p className="text-sm text-gray-600">Terhubung langsung dengan WhatsApp untuk verifikasi.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 mb-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Pejuang Cuan. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
} 