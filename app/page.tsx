import AbsenForm from './components/AbsenForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Sistem Absensi Pejuang Cuan
            </h1>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Silakan isi form absensi di bawah ini untuk konfirmasi kehadiran Anda dalam grup Pejuang Cuan
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <AbsenForm />
          </div>
        </div>
      </div>
    </div>
  );
} 