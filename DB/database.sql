-- Table: public.books

-- DROP TABLE IF EXISTS public.books;

CREATE TABLE IF NOT EXISTS public.books
(
    id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    author character varying(255) COLLATE pg_catalog."default" NOT NULL,
    isbn character varying(13) COLLATE pg_catalog."default" NOT NULL,
    published_year integer,
    published_month integer,
    status character varying(50) COLLATE pg_catalog."default" DEFAULT 'Available'::character varying,
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT books_isbn_key UNIQUE (isbn),
    CONSTRAINT books_published_month_check CHECK (published_month >= 1 AND published_month <= 12),
    CONSTRAINT books_published_year_check CHECK (published_year > 1000)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;


-- Table: public.fines

-- DROP TABLE IF EXISTS public.fines;

CREATE TABLE IF NOT EXISTS public.fines
(
    id integer NOT NULL DEFAULT nextval('fines_id_seq'::regclass),
    lending_id integer NOT NULL,
    fine_amount double precision NOT NULL,
    fine_date date DEFAULT CURRENT_DATE,
    fine_status character varying(20) COLLATE pg_catalog."default" DEFAULT 'Unpaid'::character varying,
    CONSTRAINT fines_pkey PRIMARY KEY (id),
    CONSTRAINT fines_lending_id_fkey FOREIGN KEY (lending_id)
        REFERENCES public.lendings (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fines_fine_amount_check CHECK (fine_amount >= 0::double precision)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.fines
    OWNER to postgres;


-- Table: public.lendings

-- DROP TABLE IF EXISTS public.lendings;

CREATE TABLE IF NOT EXISTS public.lendings
(
    id integer NOT NULL DEFAULT nextval('lendings_id_seq'::regclass),
    book_id integer NOT NULL,
    member_id integer NOT NULL,
    borrow_date date NOT NULL DEFAULT CURRENT_DATE,
    due_date date NOT NULL,
    return_date date,
    CONSTRAINT lendings_pkey PRIMARY KEY (id),
    CONSTRAINT lendings_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT lendings_member_id_fkey FOREIGN KEY (member_id)
        REFERENCES public.members (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.lendings
    OWNER to postgres;


-- Table: public.members

-- DROP TABLE IF EXISTS public.members;

CREATE TABLE IF NOT EXISTS public.members
(
    id integer NOT NULL DEFAULT nextval('members_id_seq'::regclass),
    full_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    joining_date date DEFAULT CURRENT_DATE,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone_number character varying(20) COLLATE pg_catalog."default" NOT NULL,
    is_wa_applicable boolean DEFAULT true,
    CONSTRAINT members_pkey PRIMARY KEY (id),
    CONSTRAINT members_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.members
    OWNER to postgres;


-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
    notification_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    member_id integer NOT NULL,
    notification_type character varying(50) COLLATE pg_catalog."default",
    notification_message text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_member_id_fkey FOREIGN KEY (member_id)
        REFERENCES public.members (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;


-- Table: public.reservations

-- DROP TABLE IF EXISTS public.reservations;

CREATE TABLE IF NOT EXISTS public.reservations
(
    id integer NOT NULL DEFAULT nextval('reservations_id_seq'::regclass),
    member_id integer NOT NULL,
    book_id integer NOT NULL,
    reservation_date date DEFAULT CURRENT_DATE,
    reservation_status character varying(20) COLLATE pg_catalog."default" DEFAULT 'Pending'::character varying,
    CONSTRAINT reservations_pkey PRIMARY KEY (id),
    CONSTRAINT reservations_book_id_fkey FOREIGN KEY (book_id)
        REFERENCES public.books (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT reservations_member_id_fkey FOREIGN KEY (member_id)
        REFERENCES public.members (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reservations
    OWNER to postgres;

