"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Member {
  id: number;
  full_name: string;
  joining_date: string;
  email: string;
  phone_number: string;
  is_wa_applicable: boolean;
}

export default function MemberViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/members/${id}`)
      .then((res) => res.json())
      .then(setMember);
  }, [id]);

  if (!member) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      {/* 🔹 Page Heading */}
      <h1 className="text-3xl font-bold mb-6">Member Details</h1>

      {/* 🔹 Details Card */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4 w-1/2">
        <p>
          <span className="font-semibold">Full Name:</span>{" "}
          {member.full_name}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {member.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {member.phone_number}
        </p>
        <p>
          <span className="font-semibold">Joining Date:</span>{" "}
          {member.joining_date}
        </p>
        <p>
          <span className="font-semibold">WhatsApp Applicable:</span>{" "}
          {member.is_wa_applicable ? "Yes" : "No"}
        </p>
      </div>

      {/* 🔹 Action Buttons (same as Book View) */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push(`/members/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Edit
        </button>

        <button
          onClick={() => router.push("/members")}
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
    </main>
  );
}
