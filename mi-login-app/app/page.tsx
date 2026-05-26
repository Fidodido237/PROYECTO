import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Sistema ERP Institucional</h1>
      <p className="text-lg text-slate-400 mb-8">Bienvenido al sistema de gestión de proyectos.</p>
      
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