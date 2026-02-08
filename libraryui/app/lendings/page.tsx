"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lending {
  id: number;
  book_id: number;
  member_id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
}

export default function LendingsPage() {
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Lending>("borrow_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchLendings();
  }, []);

  const fetchLendings = async () => {
    const res = await fetch("http://127.0.0.1:8000/lendings");
    const data = await res.json();
    setLendings(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lending?")) return;

    await fetch(`http://127.0.0.1:8000/lendings/${id}`, {
      method: "DELETE",
    });

    fetchLendings();
  };

  // 🔍 Search
  const filtered = lendings.filter((l) =>
    `${l.book_id} ${l.member_id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🔃 Sort
  const sorted = [...filtered].sort((a, b) => {
    const aVal = String(a[sortKey] ?? "");
    const bVal = String(b[sortKey] ?? "");
    return sortDir === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  // 📄 Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lendings</h1>

        <div className="flex gap-3">
          <Link
            href="/lendings/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Add Lending
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 border rounded-xl"
          >
            Back to Menu
          </Link>
        </div>
      </div>

      {/* 🔹 Controls (MATCH BOOKS EXACTLY) */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search book or member ID"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-72"
          />

          <select
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value as keyof Lending)
            }
            className="border p-2 rounded"
          >
            <option value="borrow_date">Borrow Date</option>
            <option value="due_date">Due Date</option>
            <option value="return_date">Return Date</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) =>
              setSortDir(e.target.value as "asc" | "desc")
            }
            className="border p-2 rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
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
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 text-left">Book ID</th>
              <th className="p-3 text-left">Member ID</th>
              <th className="p-3 text-left">Borrow Date</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Return Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-3">{l.book_id}</td>
                <td className="p-3">{l.member_id}</td>
                <td className="p-3">{l.borrow_date}</td>
                <td className="p-3">{l.due_date}</td>
                <td className="p-3">
                  {l.return_date ?? "-"}
                </td>
                <td className="p-3 space-x-3">
                  <Link
                    href={`/lendings/${l.id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>

                  <Link
                    href={`/lendings/${l.id}/edit`}
                    className="text-green-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No lendings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination (CENTERED like Books) */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
