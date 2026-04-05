-- CrimeLog India Data Insertion Script
-- Insert Indian crime records with at least 10 entries for each entity

-- Insert Additional Persons (Victims and Witnesses)
INSERT IGNORE INTO person (
    person_id, first_name, last_name, middle_name, date_of_birth, 
    gender, nationality_code, contact_primary, contact_secondary, 
    national_id, profile_photo_path
) VALUES
(20, 'Raj', 'Kumar', 'Singh', '1985-03-15', 'M', 'IN', '+919876543201', '+919776543201', '1234567890120', 'N/A'),
(21, 'Ananya', 'Sharma', 'Verma', '1990-07-22', 'F', 'IN', '+919876543202', '+919776543202', '2345678901230', 'N/A'),
(22, 'Arjun', 'Patel', 'Kumar', '1988-11-08', 'M', 'IN', '+919876543203', '+919776543203', '3456789012340', 'N/A'),
(23, 'Divya', 'Singh', 'Rao', '1992-05-30', 'F', 'IN', '+919876543204', '+919776543204', '4567890123450', 'N/A'),
(24, 'Vikram', 'Reddy', 'Kumar', '1987-12-12', 'M', 'IN', '+919876543205', '+919776543205', '5678901234560', 'N/A'),
(25, 'Neha', 'Gupta', 'Singh', '1993-02-18', 'F', 'IN', '+919876543206', '+919776543206', '6789012345670', 'N/A'),
(26, 'Sanjay', 'Verma', 'Kumar', '1986-09-25', 'M', 'IN', '+919876543207', '+919776543207', '7890123456780', 'N/A'),
(27, 'Priya', 'Nair', 'Kumar', '1991-04-14', 'F', 'IN', '+919876543208', '+919776543208', '8901234567890', 'N/A'),
(28, 'Aditya', 'Joshi', 'Kumar', '1989-08-20', 'M', 'IN', '+919876543209', '+919776543209', '9012345678900', 'N/A'),
(29, 'Meera', 'Rao', 'Kumar', '1994-06-28', 'F', 'IN', '+919876543210', '+919776543210', '0123456789010', 'N/A'),
(30, 'Rohan', 'Singh', 'Kumar', '1984-01-10', 'M', 'IN', '+919876543211', '+919776543211', '1123456789020', 'N/A');

-- Insert FIRs (First Information Reports) - at least 10
INSERT IGNORE INTO fir (
    fir_id, fir_number, created_date_time, accused_first_name, 
    accused_last_name, accused_contact, fir_type, incident_date_time
) VALUES
(2, 'FIR/2026/00002', NOW(), 'Ashok', 'Singh', '+919500000100', 'REGULAR', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(3, 'FIR/2026/00003', NOW(), 'Rajesh', 'Patel', '+919500000200', 'REGULAR', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(4, 'FIR/2026/00004', NOW(), 'Vikram', 'Sharma', '+919500000300', 'REGULAR', DATE_SUB(NOW(), INTERVAL 28 DAY)),
(5, 'FIR/2026/00005', NOW(), 'Sanjay', 'Kumar', '+919500000400', 'REGULAR', DATE_SUB(NOW(), INTERVAL 22 DAY)),
(6, 'FIR/2026/00006', NOW(), 'Nitin', 'Verma', '+919500000500', 'REGULAR', DATE_SUB(NOW(), INTERVAL 35 DAY)),
(7, 'FIR/2026/00007', NOW(), 'Karan', 'Mishra', '+919500000600', 'REGULAR', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(8, 'FIR/2026/00008', NOW(), 'Rohan', 'Nair', '+919500000700', 'ZERO', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(9, 'FIR/2026/00009', NOW(), 'Anil', 'Gupta', '+919500000800', 'REGULAR', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(10, 'FIR/2026/00010', NOW(), 'Sunil', 'Rao', '+919500000900', 'REGULAR', DATE_SUB(NOW(), INTERVAL 40 DAY)),
(11, 'FIR/2026/00011', NOW(), 'Vikas', 'Bhatt', '+919500001000', 'REGULAR', DATE_SUB(NOW(), INTERVAL 32 DAY));

-- Insert Cases - at least 10
INSERT IGNORE INTO cases (
    case_id, case_number, stage, fir_id, current_investigating_unit_id, 
    opened_on
) VALUES
(2, 'CASE/2026/00002', 'INVESTIGATION', 2, 1, DATE_SUB(CURDATE(), INTERVAL 30 DAY)),
(3, 'CASE/2026/00003', 'INVESTIGATION', 3, 2, DATE_SUB(CURDATE(), INTERVAL 28 DAY)),
(4, 'CASE/2026/00004', 'TRIAL', 4, 3, DATE_SUB(CURDATE(), INTERVAL 60 DAY)),
(5, 'CASE/2026/00005', 'INVESTIGATION', 5, 4, DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
(6, 'CASE/2026/00006', 'INVESTIGATION', 6, 5, DATE_SUB(CURDATE(), INTERVAL 25 DAY)),
(7, 'CASE/2026/00007', 'CLOSED', 7, 1, DATE_SUB(CURDATE(), INTERVAL 90 DAY)),
(8, 'CASE/2026/00008', 'INVESTIGATION', 8, 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(9, 'CASE/2026/00009', 'TRIAL', 9, 3, DATE_SUB(CURDATE(), INTERVAL 45 DAY)),
(10, 'CASE/2026/00010', 'INVESTIGATION', 10, 4, DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(11, 'CASE/2026/00011', 'APPEAL', 11, 5, DATE_SUB(CURDATE(), INTERVAL 120 DAY));

-- Insert Requests - at least 10
INSERT IGNORE INTO requests (
    request_id, case_id, fir_id, request_type, reason, 
    requested_by_user_id, payload_json
) VALUES
(8, 2, 2, 1, 'CCTV footage request', 1, '{"location": "nearby shops"}'),
(9, 3, 3, 2, 'Cybersecurity consultation', 2, '{"type": "digital evidence"}'),
(10, 4, 4, 3, 'Injury assessment', 3, '{"type": "medical report"}'),
(11, 5, 5, 4, 'Legal analysis', 4, '{"type": "property law"}'),
(12, 6, 6, 5, 'Medical documentation', 5, '{"type": "injury records"}'),
(13, 7, 7, 6, 'GPS tracking', 1, '{"type": "vehicle data"}'),
(14, 8, 8, 7, 'Forensic examination', 2, '{"type": "evidence analysis"}'),
(15, 9, 9, 8, 'Bank transactions', 3, '{"type": "financial records"}'),
(16, 10, 10, 1, 'Missing person alert', 4, '{"type": "broadcast"}'),
(17, 11, 11, 9, 'Appeal documentation', 5, '{"type": "appeal records"}');

-- Verify data insertion
SELECT 'Persons' as Entity, COUNT(*) as Count FROM person
UNION ALL
SELECT 'FIRs', COUNT(*) FROM fir
UNION ALL
SELECT 'Cases', COUNT(*) FROM cases
UNION ALL
SELECT 'Requests', COUNT(*) FROM requests
ORDER BY Entity;
