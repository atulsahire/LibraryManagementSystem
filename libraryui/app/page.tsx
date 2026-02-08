import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/library.jpg"
            alt="Library"
            width={500}
            height={300}
            className="rounded-2xl shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold">Library Management System</h1>
        <p className="text-slate-300">Manage books, members, lendings and more</p>

        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 text-lg font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 transition"
        >
          Start
        </Link>
      </div>
    </main>
  );
}