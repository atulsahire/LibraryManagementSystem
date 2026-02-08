"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  status: "available" | "borrowed" | "reserved";
}

interface Member {
  id: number;
  full_name: string;
}

interface LendingForm {
  book_id: string;
  member_id: string;
  borrow_date: string;
  due_date: string;
  return_date: string;
}

export default function EditLendingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<LendingForm>({
    book_id: "",
    member_id: "",
    borrow_date: "",
    due_date: "",
    return_date: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/books")
      .then((res) => res.json())
      .then(setBooks);

    fetch("http://127.0.0.1:8000/members")
      .then((res) => res.json())
      .then(setMembers);

    fetch(`http://127.0.0.1:8000/lendings/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          book_id: String(data.book_id),
          member_id: String(data.member_id),
          borrow_date: data.borrow_date,
          due_date: data.due_date,
          return_date: data.return_date ?? "",
        })
      );
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.book_id) return "Book is required";
    if (!form.member_id) return "Member is required";
    if (!form.borrow_date) return "Borrow date is required";
    if (!form.due_date) return "Due date is required";
    if (form.due_date < form.borrow_date)
      return "Due date cannot be before borrow date";
    if (form.return_date && form.return_date < form.borrow_date)
      return "Return date cannot be before borrow date";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const payload = {
      book_id: Number(form.book_id),
      member_id: Number(form.member_id),
      borrow_date: form.borrow_date,
      due_date: form.due_date,
      return_date: form.return_date || null,
    };

    await fetch(`http://127.0.0.1:8000/lendings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/lendings");
  };

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Lending</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-5 max-w-xl"
      >
        {error && <p className="text-red-600">{error}</p>}

        {/* Book */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Book <span className="text-red-600">*</span>
          </label>
          <select
            name="book_id"
            value={form.book_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Book</option>
            {books.map((b) => (
              <option
                key={b.id}
                value={b.id}
                disabled={
                  b.status === "borrowed" &&
                  String(b.id) !== form.book_id
                }
              >
                {b.title}
                {b.status === "borrowed" &&
                String(b.id) !== form.book_id
                  ? " (Borrowed)"
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Member */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Member <span className="text-red-600">*</span>
          </label>
          <select
            name="member_id"
            value={form.member_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Borrow Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Borrow Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="borrow_date"
            value={form.borrow_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Due Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Due Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Return Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Return Date
          </label>
          <input
            type="date"
            name="return_date"
            value={form.return_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <p className="text-sm text-gray-500">
          Fields marked with <span className="text-red-600">*</span> are required
        </p>

        {/* 🔹 ACTION BUTTONS (MATCH BOOK EDIT) */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => router.push("/lendings")}
            className="px-4 py-2 border rounded-xl"
          >
            Back to List
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border rounded-xl"
          >
            Back to Menu
          </button>
        </div>
      </form>
    </main>
  );
}
