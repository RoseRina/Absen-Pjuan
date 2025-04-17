import AbsenForm from './components/AbsenForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistem Absensi Pejuang Cuan
          </h1>
          <p className="text-lg text-gray-600">
            Silakan isi form absensi di bawah ini
          </p>
        </div>
        <AbsenForm />
      </div>
    </main>
  );
} 