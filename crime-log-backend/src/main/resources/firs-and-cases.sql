-- CrimeLog India Data Insertion Script
-- Insert Indian crime records with at least 10 entries for each entity

-- Insert FIRs (First Information Reports) - at least 10 more
INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00002', NOW(), NOW(), 'Ashok', 'Singh', '+919500000100', 'Mumbai', 'Maharashtra', 'REGULAR', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Theft case - residential area', 'Mumbai', 'Maharashtra', 1);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00003', NOW(), NOW(), 'Rajesh', 'Patel', '+919500000200', 'Thane', 'Maharashtra', 'REGULAR', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Robbery case - local market', 'Thane', 'Maharashtra', 2);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00004', NOW(), NOW(), 'Vikram', 'Sharma', '+919500000300', 'Pune', 'Maharashtra', 'REGULAR', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Burglary - shop premises', 'Pune', 'Maharashtra', 3);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00005', NOW(), NOW(), 'Sanjay', 'Kumar', '+919500000400', 'Bangalore', 'Karnataka', 'REGULAR', DATE_SUB(NOW(), INTERVAL 22 DAY), 'Vehicle theft from parking', 'Bangalore', 'Karnataka', 4);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00006', NOW(), NOW(), 'Nitin', 'Verma', '+919500000500', 'Delhi', 'Delhi', 'REGULAR', DATE_SUB(NOW(), INTERVAL 35 DAY), 'Property dispute - boundary issue', 'Delhi', 'Delhi', 5);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00007', NOW(), NOW(), 'Karan', 'Mishra', '+919500000600', 'Chennai', 'Tamil Nadu', 'REGULAR', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Assault case - street altercation', 'Chennai', 'Tamil Nadu', 1);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00008', NOW(), NOW(), 'Rohan', 'Nair', '+919500000700', 'Kochi', 'Kerala', 'ZERO', DATE_SUB(NOW(), INTERVAL 18 DAY), 'Cyber fraud - online transaction', 'Kochi', 'Kerala', 2);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00009', NOW(), NOW(), 'Anil', 'Gupta', '+919500000800', 'Jaipur', 'Rajasthan', 'REGULAR', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Forgery - document fraud', 'Jaipur', 'Rajasthan', 3);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00010', NOW(), NOW(), 'Sunil', 'Rao', '+919500000900', 'Hyderabad', 'Telangana', 'REGULAR', DATE_SUB(NOW(), INTERVAL 40 DAY), 'Drug trafficking case', 'Hyderabad', 'Telangana', 4);

INSERT INTO fir (fir_number, created_date_time, registration_date_time, accused_first_name, accused_last_name, accused_contact, accused_city, accused_state, fir_type, incident_date_time, incident_description, incident_city, incident_state, origin_unit_id) VALUES
('FIR/2026/00011', NOW(), NOW(), 'Vikas', 'Bhatt', '+919500001000', 'Kolkata', 'West Bengal', 'REGULAR', DATE_SUB(NOW(), INTERVAL 32 DAY), 'Counterfeiting - currency notes', 'Kolkata', 'West Bengal', 5);

-- Insert Cases - at least 10 more
INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00002', 'INVESTIGATION', 3, 1, DATE_SUB(CURDATE(), INTERVAL 30 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00003', 'INVESTIGATION', 4, 2, DATE_SUB(CURDATE(), INTERVAL 28 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00004', 'TRIAL', 5, 3, DATE_SUB(CURDATE(), INTERVAL 60 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00005', 'INVESTIGATION', 6, 4, DATE_SUB(CURDATE(), INTERVAL 15 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00006', 'INVESTIGATION', 7, 5, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00007', 'CLOSED', 8, 1, DATE_SUB(CURDATE(), INTERVAL 90 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00008', 'INVESTIGATION', 9, 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00009', 'TRIAL', 10, 3, DATE_SUB(CURDATE(), INTERVAL 45 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00010', 'INVESTIGATION', 11, 4, DATE_SUB(CURDATE(), INTERVAL 20 DAY));

INSERT INTO cases (case_number, stage, fir_id, current_investigating_unit_id, opened_on) VALUES
('CASE/2026/00011', 'APPEAL', 12, 5, DATE_SUB(CURDATE(), INTERVAL 120 DAY));
