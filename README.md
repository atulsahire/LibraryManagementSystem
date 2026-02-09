# 📚 Library Management System

A full-stack **Library Management System** built using **FastAPI** (backend) and **Next.js 16 (App Router)** (frontend).  
The system manages books, members, lendings, overdue tracking, and fines with a clean, consistent admin-style UI.

---

## ✨ Features

- 📘 Books management (CRUD)
- 👤 Members management (CRUD)
- 📕 Lending & return tracking
- ⏰ Overdue detection with fine calculation
- 📊 Overdue dashboard with totals
- 🔐 Admin placeholder page
- 🔍 Search, sort, pagination on all list pages
- 🎯 Consistent UI across all modules

---

## 🏗️ Tech Stack

### Backend
- **FastAPI**
- RESTful APIs (JSON)
- SQL database via ORM
- CORS enabled for frontend
- Postgress DB

### Frontend
- **Next.js 16** (App Router)
- React (Client Components)
- TypeScript
- Tailwind CSS
- Fetch API (no external state libraries)

---

## 📂 Project Structure

app/

├── page.tsx # Home / Start page

├── dashboard/ # Main Menu + Overdue Report

├── books/ # Books list, add, edit, view

├── members/ # Members list, add, edit, view

├── lendings/ # Lendings list, add, edit, view

├── admin/ # Admin placeholder page

└── layout.tsx


---

## 🔌 Backend API Reference

### 📘 Books

| Action | Method | Endpoint |
|------|------|---------|
| Create | POST | `/books` |
| Update | PUT | `/books/{id}` |
| Delete | DELETE | `/books/{id}` |
| Get One | GET | `/books/{id}` |
| Get All | GET | `/books` |

**Book Schema**
```json
{
  "id": 1,
  "title": "1984",
  "author": "George Orwell",
  "isbn": "9780451524935",
  "published_year": 1949,
  "published_month": 6,
  "status": "available"
}
```

### 📘 Members

API:
| Action  | Method | Endpoint        |
| ------- | ------ | --------------- |
| Create  | POST   | `/members`      |
| Update  | PUT    | `/members/{id}` |
| Delete  | DELETE | `/members/{id}` |
| Get One | GET    | `/members/{id}` |
| Get All | GET    | `/members`      |


**Member Schema**
```json
{
  "id": 1,
  "full_name": "Alice Johnson",
  "joining_date": "2024-02-06",
  "email": "alice@example.com",
  "phone_number": "+919822767893",
  "is_wa_applicable": true
}
```

### 📘 Lendings

| Action  | Method | Endpoint        |
| ------- | ------ | --------------- |
| Create  | POST   | `/lendings`      |
| Update  | PUT    | `/lendings/{id}` |
| Delete  | DELETE | `/lendings/{id}` |
| Get One | GET    | `/lendings/{id}` |
| Get All | GET    | `/lendings`      |

**Lending Schema**
```json
{
  "id": 1,
  "book_id": 3,
  "member_id": 5,
  "borrow_date": "2024-02-01",
  "due_date": "2024-02-15",
  "return_date": null
}
```


## 🎨 UI Design Principles

Consistency – same layout across Books, Members, Lendings
Clarity – labeled fields, required *, inline validation
Usability – predictable navigation, back-to-menu everywhere
Maintainability – minimal duplication, clean structure

📘 Books Module :
Search by title / ISBN
Sort by title or year
Pagination with page size selector
Add / Edit / View / Delete

Validations:
    Title required
    Published year > 1900
    Month between 1–12

👤 Members Module:
Full CRUD operations
Search, sort, pagination

Validations:
    Name required
    Email format
    Phone number format

👤 Members Module
Full CRUD operations
Search, sort, pagination

Validations:
    Name required
    Email format
    Phone number format

📕 Lendings Module
Assign books to members
Prevent lending already borrowed books
Track borrow, due, and return dates
Mark returned

Validations:
    Book & member required
    Due date ≥ borrow date

🔐 Admin Page
Same layout as other pages
No options available (placeholder)
Ready for future admin features


## 🧭 Navigation Flow

Home (Start)
   ↓
Main Menu
   ├── Books
   ├── Members
   ├── Lendings
   ├── Overdue Report
   └── Admin

## 🚀 Running the Project

BackEnd
    uvicorn main:app --reload
FrontEnd
    npm install
    npm run dev
Frontend: http://localhost:3000
Backend: http://127.0.0.1:8000

## 🔮 Future Enhancements

Persist fines to database
Role-based access control
Notifications (Email / WhatsApp)
CSV / Excel exports
Analytics & reports
Shared reusable UI components

## ✅ Summary

This project demonstrates:
Clean full-stack architecture
Professional, consistent UI
Strong validation and UX
Scalable and maintainable codebase
It is production-ready and easy to extend.


---

## 👤 Author: Atul Ahire
## 📦 Stack: FastAPI + Next.js 16

