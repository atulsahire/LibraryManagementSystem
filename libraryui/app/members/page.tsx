"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Member {
  id: number;
  full_name: string;
  joining_date: string;
  email: string;
  phone_number: string;
  is_wa_applicable: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Member>("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch("http://127.0.0.1:8000/members");
    const data = await res.json();
    setMembers(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    await fetch(`http://127.0.0.1:8000/members/${id}`, {
      method: "DELETE",
    });

    fetchMembers();
  };

  // 🔍 Filter
  const filtered = members.filter((m) =>
    `${m.full_name} ${m.email} ${m.phone_number}`
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
      {/* 🔹 Header (same as Books) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>

        <div className="flex gap-3">
          <Link
            href="/members/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Add Member
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 border rounded-xl"
          >
            Back to Menu
          </Link>
        </div>
      </div>

      {/* 🔹 Controls Row (MATCHES BOOKS EXACTLY) */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search name, email, phone"
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
              setSortKey(e.target.value as keyof Member)
            }
            className="border p-2 rounded"
          >
            <option value="full_name">Name</option>
            <option value="email">Email</option>
            <option value="joining_date">Joining Date</option>
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
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Joining Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.full_name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.phone_number}</td>
                <td className="p-3">{m.joining_date}</td>
                <td className="p-3 space-x-3">
                  <Link
                    href={`/members/${m.id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>

                  <Link
                    href={`/members/${m.id}/edit`}
                    className="text-green-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No members found
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
