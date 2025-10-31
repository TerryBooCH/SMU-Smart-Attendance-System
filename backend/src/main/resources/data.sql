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
INSERT INTO student (student_id, name, email, phone, class_name, created_at, updated_at)
VALUES
 ('S1000001', 'Li Sheng',  'lisheng@example.com',  '81234567', 'CS102', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ('S1000002', 'Terry',     'terry@example.com',    '87654321', 'CS102', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ('S1000003', 'Xavier',    'xavier@example.com',   NULL,       'CS102', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ('S1000004', 'Jason',     'jason@example.com',    '89998888', 'CS102', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ('S1000005', 'Le Hi',     'lehi@example.com',     NULL,       'CS102', datetime('now', 'localtime'), datetime('now', 'localtime'));

-- ─────────────────────────────────────────────────────────
-- 2) Face data (optional placeholder rows)
-- ─────────────────────────────────────────────────────────
-- INSERT INTO face_data (student_id, image_path)
-- VALUES
--  ((SELECT id FROM student WHERE student_id='S1000001'), 'S100001A/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S1000002'), 'S100002B/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S1000003'), 'S100003C/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S1000004'), 'S100004D/face1.jpg'),
--  ((SELECT id FROM student WHERE student_id='S1000005'), 'S100005E/face1.jpg');

-- ─────────────────────────────────────────────────────────
-- 3) Rosters
-- ─────────────────────────────────────────────────────────
INSERT INTO roster (name, created_at, updated_at) VALUES
 ('CS102 - Tutorial A', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ('CS102 - Tutorial B', datetime('now', 'localtime'), datetime('now', 'localtime'));

-- ─────────────────────────────────────────────────────────
-- 4) Student ↔ Roster membership
-- ─────────────────────────────────────────────────────────
INSERT INTO student_roster (student_id, roster_id, created_at)
VALUES
 ((SELECT id FROM student WHERE student_id='S1000001'), (SELECT id FROM roster WHERE name='CS102 - Tutorial A'), datetime('now', 'localtime')),
 ((SELECT id FROM student WHERE student_id='S1000002'), (SELECT id FROM roster WHERE name='CS102 - Tutorial A'), datetime('now', 'localtime')),
 ((SELECT id FROM student WHERE student_id='S1000003'), (SELECT id FROM roster WHERE name='CS102 - Tutorial A'), datetime('now', 'localtime')),
 ((SELECT id FROM student WHERE student_id='S1000004'), (SELECT id FROM roster WHERE name='CS102 - Tutorial B'), datetime('now', 'localtime')),
 ((SELECT id FROM student WHERE student_id='S1000005'), (SELECT id FROM roster WHERE name='CS102 - Tutorial B'), datetime('now', 'localtime'));

-- ─────────────────────────────────────────────────────────
-- 5) Sessions (SQLite-compatible timestamps)
-- ─────────────────────────────────────────────────────────
INSERT INTO "session" (roster_id, course_name, start_at, end_at, is_open, late_after_minutes, created_at, updated_at)
VALUES
 ((SELECT id FROM roster WHERE name='CS102 - Tutorial A'), 'CS102', '2025-10-20 09:00:00', '2025-10-20 10:00:00', 0, 15, datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM roster WHERE name='CS102 - Tutorial A'), 'CS102', '2025-10-21 09:00:00', '2025-10-21 10:00:00', 0, 15, datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM roster WHERE name='CS102 - Tutorial B'), 'CS102', '2025-10-22 14:00:00', '2025-10-22 15:00:00', 0, 15, datetime('now', 'localtime'), datetime('now', 'localtime'));

-- ─────────────────────────────────────────────────────────
-- 6) Attendance (SQLite-compatible timestamps)
-- ─────────────────────────────────────────────────────────
-- Session 1 (Tutorial A, 2025-10-20)
INSERT INTO attendance (session_id, student_id, status, method, confidence, timestamp, created_at, updated_at)
VALUES
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-20 09:00:00'),
  (SELECT id FROM student WHERE student_id='S1000001'), 'PRESENT', 'AUTO', 0.97, '2025-10-20 09:02:10', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-20 09:00:00'),
  (SELECT id FROM student WHERE student_id='S1000002'), 'LATE', 'AUTO', 0.88, '2025-10-20 09:12:30', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-20 09:00:00'),
  (SELECT id FROM student WHERE student_id='S1000003'), 'ABSENT', 'MANUAL', NULL, '2025-10-20 10:00:00', datetime('now', 'localtime'), datetime('now', 'localtime'));

-- Session 2 (Tutorial A, 2025-10-21)
INSERT INTO attendance (session_id, student_id, status, method, confidence, timestamp, created_at, updated_at)
VALUES
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-21 09:00:00'),
  (SELECT id FROM student WHERE student_id='S1000001'), 'PRESENT', 'EDGE', 0.95, '2025-10-21 09:01:40', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-21 09:00:00'),
  (SELECT id FROM student WHERE student_id='S1000002'), 'PRESENT', 'AUTO', 0.93, '2025-10-21 09:03:05', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial A') AND start_at='2025-10-21 09:00:00'),
  (SELECT id FROM student WHERE student_id='S1000003'), 'PENDING', 'MANUAL', NULL, '2025-10-21 08:59:55', datetime('now', 'localtime'), datetime('now', 'localtime'));

-- Session 3 (Tutorial B, 2025-10-22)
INSERT INTO attendance (session_id, student_id, status, method, confidence, timestamp, created_at, updated_at)
VALUES
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial B') AND start_at='2025-10-22 14:00:00'),
  (SELECT id FROM student WHERE student_id='S1000004'), 'PRESENT', 'AUTO', 0.92, '2025-10-22 14:00:50', datetime('now', 'localtime'), datetime('now', 'localtime')),
 ((SELECT id FROM "session" WHERE roster_id=(SELECT id FROM roster WHERE name='CS102 - Tutorial B') AND start_at='2025-10-22 14:00:00'),
  (SELECT id FROM student WHERE student_id='S1000005'), 'ABSENT', 'MANUAL', NULL, '2025-10-22 15:00:00', datetime('now', 'localtime'), datetime('now', 'localtime'));

-- ─────────────────────────────────────────────────────────
-- 7) User Accounts (Professor + TA)
-- ─────────────────────────────────────────────────────────
-- Passwords are pre-hashed using BCrypt (plain text: "prof123" and "ta123")
INSERT INTO "user" (name, email, password_hash, permission_level)
VALUES ('Dr. Lim', 'dr.lim@example.com', '$2a$10$tVBjrT/DUB8ePmKL4cjRzu8oyUFdVXug4t7anOHsrxWIANew5I67K', 2);

INSERT INTO "user" (name, email, password_hash, permission_level)
VALUES ('John Lee', 'john.lee@example.com', '$2a$10$VbB6DsFgIRBzpHElYWI8Z.g2Z4w92rfHRhC.WWl44Tg4bUkAT6QAq', 1);
