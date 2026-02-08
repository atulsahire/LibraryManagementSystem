"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  published_year: number;
  published_month: number;
  status: string;
}

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!book) return <p className="p-10">Book not found</p>;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Book Details</h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4 w-1/2">
        <p><strong>Title:</strong> {book.title}</p>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Published:</strong> {book.published_month}/{book.published_year}</p>
        <p><strong>Status:</strong> {book.status}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push(`/books/${book.id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Edit
        </button>
        <button
          onClick={() => router.push('/books')}
          className="px-4 py-2 border rounded-xl"
        >
          Back to List
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 border rounded-xl"
        >
          Back to Menu
        </button>
      </div>
    </main>
  );
}
