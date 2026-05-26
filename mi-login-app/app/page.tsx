import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-4">PROYECTO LOGIN</h1>
      <p className="text-lg text-slate-400 mb-8">Bienvenidos</p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Ir al Login
        </Link>
      </div>
    </main>
  );
}