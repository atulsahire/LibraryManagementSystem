"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function AddLendingPage() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState<LendingForm>({
    book_id: "",
    member_id: "",
    borrow_date: "",
    due_date: "",
    return_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/books")
      .then((r) => r.json())
      .then(setBooks);

    fetch("http://127.0.0.1:8000/members")
      .then((r) => r.json())
      .then(setMembers);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.book_id) e.book_id = "Book is required";
    if (!form.member_id) e.member_id = "Member is required";
    if (!form.borrow_date) e.borrow_date = "Borrow date is required";
    if (!form.due_date) e.due_date = "Due date is required";

    if (
      form.borrow_date &&
      form.due_date &&
      form.due_date < form.borrow_date
    ) {
      e.due_date = "Due date cannot be before borrow date";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isFormValid =
    form.book_id &&
    form.member_id &&
    form.borrow_date &&
    form.due_date;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await fetch("http://127.0.0.1:8000/lendings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: Number(form.book_id),
        member_id: Number(form.member_id),
        borrow_date: form.borrow_date,
        due_date: form.due_date,
        return_date: form.return_date || null,
      }),
    });

    router.push("/lendings");
  };

  const inputClass = (key: string) =>
    `w-full border p-2 rounded ${
      errors[key] ? "border-red-500" : ""
    }`;

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Add Lending</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-5 max-w-xl"
      >
        {/* Book */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Book <span className="text-red-600">*</span>
          </label>
          <select
            name="book_id"
            value={form.book_id}
            onChange={handleChange}
            className={inputClass("book_id")}
          >
            <option value="">Select Book</option>
            {books.map((b) => (
              <option
                key={b.id}
                value={b.id}
                disabled={b.status === "borrowed"}
              >
                {b.title}
                {b.status === "borrowed" ? " (Borrowed)" : ""}
              </option>
            ))}
          </select>
          {errors.book_id && (
            <p className="text-sm text-red-600">{errors.book_id}</p>
          )}
        </div>

        {/* Member */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Member <span className="text-red-600">*</span>
          </label>
          <select
            name="member_id"
            value={form.member_id}
            onChange={handleChange}
            className={inputClass("member_id")}
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
          {errors.member_id && (
            <p className="text-sm text-red-600">{errors.member_id}</p>
          )}
        </div>

        {/* Borrow Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Borrow Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="borrow_date"
            value={form.borrow_date}
            onChange={handleChange}
            className={inputClass("borrow_date")}
          />
          {errors.borrow_date && (
            <p className="text-sm text-red-600">{errors.borrow_date}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Due Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            className={inputClass("due_date")}
          />
          {errors.due_date && (
            <p className="text-sm text-red-600">{errors.due_date}</p>
          )}
        </div>

        {/* Return Date */}
        <div>
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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-xl text-white ${
              isFormValid
                ? "bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
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
