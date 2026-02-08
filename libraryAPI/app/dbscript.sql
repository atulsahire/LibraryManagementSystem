-- 0 Database: nhlibrary

DROP DATABASE IF EXISTS nhlibrary;
CREATE DATABASE nhlibrary
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United Kingdom.1252'
    LC_CTYPE = 'English_United Kingdom.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE nhlibrary
    IS 'Database for neighborhood library Application';


-- 1. Core Tables: Books and Members
-- Books Table
DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    published_year INTEGER CHECK (published_year > 1000),
    published_month INTEGER CHECK (published_month BETWEEN 1 AND 12),
    status VARCHAR(50) DEFAULT 'Available'
);

-- Members Table
DROP TABLE IF EXISTS members CASCADE;
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    joining_date DATE DEFAULT CURRENT_DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_wa_applicable BOOLEAN DEFAULT TRUE
);

--2. Transactional Tables: Lendings and Fines
-- Lendings Table
DROP TABLE IF EXISTS lendings CASCADE;
CREATE TABLE lendings (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    borrow_date DATE DEFAULT CURRENT_DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL
);

-- Fines Table
DROP TABLE IF EXISTS fines CASCADE;
CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    lending_id INTEGER REFERENCES lendings(id) ON DELETE CASCADE NOT NULL,
    fine_amount FLOAT CHECK (fine_amount >= 0) NOT NULL,
    fine_date DATE DEFAULT CURRENT_DATE,
    fine_status VARCHAR(20) DEFAULT 'Unpaid' -- e.g., Unpaid, Paid
);

--3. Management Tables: Reservations and Notifications
-- Reservations Table
DROP TABLE IF EXISTS reservations CASCADE;
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    reservation_date DATE DEFAULT CURRENT_DATE,
    reservation_status VARCHAR(20) DEFAULT 'Pending'
);

-- Notifications Table
DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    notification_type VARCHAR(50), -- e.g., Email, SMS, WhatsApp
    notification_message TEXT NOT NULL
);
