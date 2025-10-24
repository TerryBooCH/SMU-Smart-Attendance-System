-- Enable FK enforcement (SQLite)
PRAGMA foreign_keys = ON;

-- Optional: wipe existing seed data to avoid UNIQUE conflicts on repeated runs
DELETE FROM attendance;
DELETE FROM "session";
DELETE FROM student_roster;
DELETE FROM roster;
DELETE FROM face_data;
DELETE FROM "user";
DELETE FROM student;

-- ─────────────────────────────────────────────────────────
-- 1) Students (now include class_name)
-- ─────────────────────────────────────────────────────────
INSERT INTO student (student_id, name, email, phone, class_name)
VALUES
 ('S100001A', 'Li Sheng',  'lisheng@example.com',  '81234567', 'CS102'),
 ('S100002B', 'Terry',     'terry@example.com',    '87654321', 'CS102'),
 ('S100003C', 'Xavier',    'xavier@example.com',   NULL,       'CS102'),
 ('S100004D', 'Jason',     'jason@example.com',    '89998888', 'CS102'),
 ('S100005E', 'Le Hi',     'lehi@example.com',     NULL,       'CS102');

-- ─────────────────────────────────────────────────────────
-- 2) Face data (optional placeholder rows)
-- ─────────────────────────────────────────────────────────
-- INSERT INTO face_data (student_id, image_path)
-- VALUES
--  ((SELECT id FROM student WHERE student_id='S100001A'), 'S100001A/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S100002B'), 'S100002B/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S100003C'), 'S100003C/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S100004D'), 'S100004D/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S100005E'), 'S100005E/face1.jpg');

-- ─────────────────────────────────────────────────────────
-- 3) Rosters
-- ─────────────────────────────────────────────────────────
INSERT INTO roster (name) VALUES
 ('CS102 - Tutorial A'),
 ('CS102 - Tutorial B');

-- ─────────────────────────────────────────────────────────
-- 4) Student ↔ Roster membership
-- ─────────────────────────────────────────────────────────
INSERT INTO student_roster (student_id, roster_id)
VALUES
 ((SELECT id FROM student WHERE student_id='S100001A'), (SELECT id FROM roster WHERE name='CS102 - Tutorial A')),
 ((SELECT id FROM student WHERE student_id='S100002B'), (SELECT id FROM roster WHERE name='CS102 - Tutorial A')),
 ((SELECT id FROM student WHERE student_id='S100003C'), (SELECT id FROM roster WHERE name='CS102 - Tutorial A')),
 ((SELECT id FROM student WHERE student_id='S100004D'), (SELECT id FROM roster WHERE name='CS102 - Tutorial B')),
 ((SELECT id FROM student WHERE student_id='S100005E'), (SELECT id FROM roster WHERE name='CS102 - Tutorial B'));

-- ─────────────────────────────────────────────────────────
-- 5) Sessions (SQLite-compatible timestamps)
-- ─────────────────────────────────────────────────────────
INSERT INTO "session" (roster_id, course_name, start_at, end_at, is_open, late_after_minutes)
VALUES
 ((SELECT id FROM roster WHERE name='CS102 - Tutorial A'), 'CS102', '2025-10-20 09:00:00', '2025-10-20 10:00:00', 0, 10),
 ((SELECT id FROM roster WHERE name='CS102 - Tutorial A'), 'CS102', '2025-10-21 09:00:00', '2025-10-21 10:00:00', 0, 10),
 ((SELECT id FROM roster WHERE name='CS102 - Tutorial B'), 'CS102', '2025-10-22 14:00:00', '2025-10-22 15:00:00', 0, 10);

-- ─────────────────────────────────────────────────────────
-- 6) Attendance (SQLite-compatible timestamps)
-- ─────────────────────────────────────────────────────────
-- Session 1 (Tutorial A, 2025-10-20)
INSERT INTO attendance (session_id, student_id, status, method, confidence, timestamp)
VALUES
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-20 09:00:00'),
  (SELECT id FROM student WHERE student_id='S100001A'), 'PRESENT', 'AUTO', 0.97, '2025-10-20 09:02:10'),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-20 09:00:00'),
  (SELECT id FROM student WHERE student_id='S100002B'), 'LATE', 'AUTO', 0.88, '2025-10-20 09:12:30'),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-20 09:00:00'),
  (SELECT id FROM student WHERE student_id='S100003C'), 'ABSENT', 'MANUAL', NULL, '2025-10-20 10:00:00');

-- Session 2 (Tutorial A, 2025-10-21)
INSERT INTO attendance (session_id, student_id, status, method, confidence, timestamp)
VALUES
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-21 09:00:00'),
  (SELECT id FROM student WHERE student_id='S100001A'), 'PRESENT', 'EDGE', 0.95, '2025-10-21 09:01:40'),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-21 09:00:00'),
  (SELECT id FROM student WHERE student_id='S100002B'), 'PRESENT', 'AUTO', 0.93, '2025-10-21 09:03:05'),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-21 09:00:00'),
  (SELECT id FROM student WHERE student_id='S100003C'), 'PENDING', 'MANUAL', NULL, '2025-10-21 08:59:55');

-- Session 3 (Tutorial B, 2025-10-22)
INSERT INTO attendance (session_id, student_id, status, method, confidence, timestamp)
VALUES
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial B') AND start_at='2025-10-22 14:00:00'),
  (SELECT id FROM student WHERE student_id='S100004D'), 'PRESENT', 'AUTO', 0.92, '2025-10-22 14:00:50'),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial B') AND start_at='2025-10-22 14:00:00'),
  (SELECT id FROM student WHERE student_id='S100005E'), 'ABSENT', 'MANUAL', NULL, '2025-10-22 15:00:00');

-- ─────────────────────────────────────────────────────────
-- 7) User Accounts (Professor + TA)
-- ─────────────────────────────────────────────────────────
-- Passwords are pre-hashed using BCrypt (plain text: "prof123" and "ta123")
INSERT INTO "user" (name, email, password_hash, permission_level)
VALUES ('Dr. Lim', 'dr.lim@example.com', '$2a$10$tVBjrT/DUB8ePmKL4cjRzu8oyUFdVXug4t7anOHsrxWIANew5I67K', 2);

INSERT INTO "user" (name, email, password_hash, permission_level)
VALUES ('John Lee', 'john.lee@example.com', '$2a$10$VbB6DsFgIRBzpHElYWI8Z.g2Z4w92rfHRhC.WWl44Tg4bUkAT6QAq', 1);
