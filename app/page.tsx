import AbsenForm from './components/AbsenForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-10 sm:py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-75"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Form Absensi
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-3xl mx-auto">
            Silakan isi form di bawah ini untuk konfirmasi kehadiran Anda
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="app-container">
        <div className="max-w-2xl mx-auto -mt-10 relative z-10">
          <div className="card">
            <div className="card-body">
              <AbsenForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 