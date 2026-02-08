"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MemberForm {
  full_name: string;
  joining_date: string;
  email: string;
  phone_number: string;
  is_wa_applicable: boolean;
}

export default function AddMemberPage() {
  const router = useRouter();

  // ✅ Controlled inputs from first render
  const [form, setForm] = useState<MemberForm>({
    full_name: "",
    joining_date: "",
    email: "",
    phone_number: "",
    is_wa_applicable: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    if (!form.full_name.trim()) return "Full name is required";
    if (!form.joining_date) return "Joining date is required";
    if (!form.email.trim()) return "Email is required";
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
      full_name: form.full_name,
      joining_date: form.joining_date,
      email: form.email,
      phone_number: form.phone_number,
      is_wa_applicable: form.is_wa_applicable,
    };

    await fetch("http://127.0.0.1:8000/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/members");
  };

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Add Member</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-5 max-w-xl"
      >
        {error && <p className="text-red-600">{error}</p>}

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Member full name"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Joining Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Joining Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="joining_date"
            value={form.joining_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="+91XXXXXXXXXX"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* WhatsApp Applicable */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_wa_applicable"
            checked={form.is_wa_applicable}
            onChange={handleChange}
          />
          <label className="text-sm font-medium text-gray-700">
            WhatsApp Notifications Applicable
          </label>
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
            onClick={() => router.push("/members")}
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
