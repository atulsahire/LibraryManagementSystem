"use client";

import { useRouter } from "next/navigation";

const MenuCard = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="
      relative cursor-pointer bg-white rounded-xl shadow
      p-4 pl-6 transition-all duration-200
      hover:shadow-lg
      before:absolute before:left-0 before:top-0
      before:h-full before:w-1 before:bg-blue-600
      before:scale-y-0 before:origin-top
      before:transition-transform before:duration-200
      hover:before:scale-y-100
    "
  >
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-slate-600 text-sm mt-1">
      {description}
    </p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        Library Management System
      </h1>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <MenuCard
          title="Books"
          description="Manage books catalog"
          onClick={() => router.push("/books")}
        />

        <MenuCard
          title="Members"
          description="Manage library members"
          onClick={() => router.push("/members")}
        />

        <MenuCard
          title="Lendings"
          description="Borrow & return tracking"
          onClick={() => router.push("/lendings")}
        />

        <MenuCard
          title="OverDue Report"
          description="Overdue books list"
          onClick={() => router.push("/overdue")}
        />

        <MenuCard
          title="Admin"
          description="Admin menu"
          onClick={() => router.push("/admin")}
        />
      </div>

      {/* Book Management Image Section */}
      <div className="mt-12 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Library Book Management
        </h2>

        <p className="text-slate-600 mb-6 max-w-2xl">
          Manage books, members, lendings, overdue reports,
          and administration from a single unified system.
        </p>

        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
          alt="Book Management"
          className="rounded-xl w-full max-h-[360px] object-cover"
        />
      </div>
    </main>
  );
}
