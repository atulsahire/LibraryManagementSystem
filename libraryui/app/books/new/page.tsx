"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookForm {
  title: string;
  author: string;
  isbn: string;
  published_year: string;
  published_month: string;
  status: string;
}

export default function AddBookPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState<BookForm>({
    title: "",
    author: "",
    isbn: "",
    published_year: "",
    published_month: "",
    status: "available",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";

    const year = Number(form.published_year);
    if (year && (year <= 1900 || year > currentYear)) {
      return `Published year must be between 1901 and ${currentYear}`;
    }

    const month = Number(form.published_month);
    if (month && (month < 1 || month > 12)) {
      return "Published month must be between 1 and 12";
    }

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
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      published_year: Number(form.published_year),
      published_month: Number(form.published_month),
      status: form.status,
    };

    await fetch("http://127.0.0.1:8000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/books");
  };

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Add Book</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-5 max-w-xl"
      >
        {error && <p className="text-red-600">{error}</p>}

        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Author */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* ISBN */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Published Year */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Published Year
          </label>
          <input
            type="number"
            name="published_year"
            value={form.published_year}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Published Month */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Published Month
          </label>
          <input
            type="number"
            name="published_month"
            value={form.published_month}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        {/* Required note */}
        <p className="text-sm text-gray-500">
          Fields marked with <span className="text-red-600">*</span> are required
        </p>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => router.push("/books")}
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
