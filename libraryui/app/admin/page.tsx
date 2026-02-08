"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin</h1>

        <Link
          href="/dashboard"
          className="px-4 py-2 border rounded-xl"
        >
          Back to Menu
        </Link>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-600 text-lg">
          No admin options are available at this time.
        </p>

        <p className="text-slate-500 text-sm mt-2">
          Administrative features will appear here in future releases.
        </p>
      </div>
    </main>
  );
}
