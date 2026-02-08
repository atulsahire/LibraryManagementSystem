"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------- Types ---------- */
interface Lending {
  id: number;
  book_id: number;
  member_id: number;
  due_date: string;
  return_date: string | null;
}

interface Book {
  id: number;
  title: string;
}

interface Member {
  id: number;
  full_name: string;
}

/* ---------- Constants ---------- */
const FINE_PER_DAY = 5;

/* ---------- Helpers ---------- */
const daysOverdue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = today.getTime() - due.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function OverDuePage() {
  const router = useRouter();

  /* ---------- Data State ---------- */
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [booksMap, setBooksMap] = useState<Record<number, string>>({});
  const [membersMap, setMembersMap] = useState<Record<number, string>>({});

  /* ---------- UI State (Books-like) ---------- */
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"days" | "fine">("days");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  /* ---------- Load Data ---------- */
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/lendings").then(r => r.json()),
      fetch("http://127.0.0.1:8000/books").then(r => r.json()),
      fetch("http://127.0.0.1:8000/members").then(r => r.json()),
    ]).then(([lendings, books, members]) => {
      const today = new Date();

      setLendings(
        lendings.filter(
          (l: Lending) =>
            !l.return_date && new Date(l.due_date) < today
        )
      );

      const bMap: Record<number, string> = {};
      books.forEach((b: Book) => (bMap[b.id] = b.title));
      setBooksMap(bMap);

      const mMap: Record<number, string> = {};
      members.forEach((m: Member) => (mMap[m.id] = m.full_name));
      setMembersMap(mMap);
    });
  }, []);

  /* ---------- Search + Sort ---------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    const result = lendings.filter((l) =>
      `${l.id} ${booksMap[l.book_id]} ${membersMap[l.member_id]}`
        .toLowerCase()
        .includes(q)
    );

    return result.sort((a, b) => {
      const d1 = daysOverdue(a.due_date);
      const d2 = daysOverdue(b.due_date);
      return sortBy === "days"
        ? d2 - d1
        : d2 * FINE_PER_DAY - d1 * FINE_PER_DAY;
    });
  }, [lendings, search, sortBy, booksMap, membersMap]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ---------- Aggregates ---------- */
  const totalFine = filtered.reduce(
    (sum, l) => sum + daysOverdue(l.due_date) * FINE_PER_DAY,
    0
  );

  const totalOverdueCount = filtered.length;

  /* ---------- Mark Returned ---------- */
  const markReturned = async (l: Lending) => {
    await fetch(`http://127.0.0.1:8000/lendings/${l.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...l,
        return_date: new Date().toISOString().slice(0, 10),
      }),
    });

    setLendings((prev) => prev.filter((x) => x.id !== l.id));
  };

  return (
    <main className="min-h-screen bg-slate-100 p-10 space-y-6">
<div className="flex justify-between items-center">
  <h1 className="text-3xl font-bold">
    Dashboard – Overdue Lendings
  </h1>

  <button
    onClick={() => router.push("/dashboard")}
    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
  >
    Back to Menu
  </button>
</div>

      {/* ---------- Summary Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Overdue Books</p>
          <p className="text-4xl font-bold text-red-600">
            {totalOverdueCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Fine Amount</p>
          <p className="text-4xl font-bold text-red-600">
            ₹{totalFine}
          </p>
        </div>
      </div>

      {/* ---------- Controls (Books-style) ---------- */}
      <div className="flex justify-between items-center">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded w-64"
        />

        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "days" | "fine")
            }
            className="border p-2 rounded"
          >
            <option value="days">Sort by Days Overdue</option>
            <option value="fine">Sort by Fine Amount</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border p-2 rounded"
          >
            {[5, 10, 20].map((s) => (
              <option key={s} value={s}>
                {s} rows
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th>ID</th>
              <th>Book</th>
              <th>Member</th>
              <th>Due Date</th>
              <th>Days Overdue</th>
              <th>Fine (₹)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((l) => {
              const days = daysOverdue(l.due_date);
              return (
                <tr key={l.id} className="border-b bg-red-50">
                  <td>{l.id}</td>

                  <td>
                    <div className="font-medium">
                      {booksMap[l.book_id]}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {l.book_id}
                    </div>
                  </td>

                  <td>
                    <div className="font-medium">
                      {membersMap[l.member_id]}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {l.member_id}
                    </div>
                  </td>

                  <td className="text-red-600">
                    {l.due_date}
                  </td>

                  <td className="font-semibold text-red-700">
                    {days}
                  </td>

                  <td className="font-semibold text-red-700">
                    ₹{days * FINE_PER_DAY}
                  </td>

                  <td>
                    <button
                      onClick={() => markReturned(l)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Mark Returned
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ---------- Pagination ---------- */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
