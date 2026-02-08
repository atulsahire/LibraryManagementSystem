"use client";

import { useEffect, useState } from "react";
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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "year">("title");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/books")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load books");
        return res.json();
      })
      .then(setBooks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b.published_year - a.published_year;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 p-3 rounded-xl text-white ${
            toast.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* 🔹 Header (MATCHES LENDINGS) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Books</h1>

        <div className="flex gap-3">
          <Link
            href="/books/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Add Book
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 border rounded-xl"
          >
            Back to Menu
          </Link>
        </div>
      </div>

      {/* 🔹 Controls (EXACT SAME STRUCTURE AS LENDINGS) */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by title or ISBN"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-72"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "title" | "year")
            }
            className="border p-2 rounded"
          >
            <option value="title">Sort by Title</option>
            <option value="year">Sort by Year</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border p-2 rounded"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      </div>

      {/* 📋 Table */}
      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left">ISBN</th>
                <th className="p-3">Month</th>
                <th className="p-3">Year</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.title}</td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.isbn}</td>
                  <td className="p-3 text-center">
                    {b.published_month}
                  </td>
                  <td className="p-3 text-center">
                    {b.published_year}
                  </td>
                  <td className="p-3 text-center">
                    {b.status}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <Link
                      href={`/books/${b.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/books/${b.id}/edit`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this book?"))
                          return;

                        const res = await fetch(
                          `http://127.0.0.1:8000/books/${b.id}`,
                          { method: "DELETE" }
                        );

                        if (!res.ok) {
                          setToast({
                            type: "error",
                            message:
                              "Failed to delete book",
                          });
                          return;
                        }

                        setBooks((prev) =>
                          prev.filter(
                            (x) => x.id !== b.id
                          )
                        );
                        setToast({
                          type: "success",
                          message:
                            "Book deleted successfully",
                        });
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (ALREADY MATCHED) */}
      {!loading && !error && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
