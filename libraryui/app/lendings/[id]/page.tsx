"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Lending {
  id: number;
  book_id: number;
  member_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
}

export default function LendingViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lending, setLending] = useState<Lending | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/lendings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load lending");
        return res.json();
      })
      .then((data) => setLending(data))
      .catch(() => setError("Unable to load lending"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <p>Loading...</p>
      </main>
    );
  }

  if (error || !lending) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <p className="text-red-600">{error ?? "Lending not found"}</p>
        <button
          onClick={() => router.push("/lendings")}
          className="mt-4 px-4 py-2 border rounded-xl"
        >
          Back to List
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Lending Details</h1>

      {/* 🔹 50% width card (same as Book View) */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4 max-w-2xl">
        <div>
          <strong>Book ID:</strong> {lending.book_id}
        </div>

        <div>
          <strong>Member ID:</strong> {lending.member_id}
        </div>

        <div>
          <strong>Borrow Date:</strong> {lending.borrow_date}
        </div>

        <div>
          <strong>Due Date:</strong> {lending.due_date}
        </div>

        <div>
          <strong>Return Date:</strong>{" "}
          {lending.return_date ?? "-"}
        </div>

        {/* 🔹 Buttons (same pattern everywhere) */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => router.push(`/lendings/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Edit
          </button>

          <button
            onClick={() => router.push("/lendings")}
            className="px-4 py-2 border rounded-xl"
          >
            Back to List
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border rounded-xl"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </main>
  );
}
