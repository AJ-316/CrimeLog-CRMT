-- Crime Log - Indian Data Seeding Script (Fixed Version)
-- This script populates the crime log database with Indian crime records

-- 1. Insert Additional Agencies
INSERT INTO agencies (agency_id, agency_type, name, parent_agency_id) VALUES
(18, 'STATE', 'Haryana Police', NULL),
(19, 'STATE', 'Uttar Pradesh Police', NULL),
(20, 'CITY', 'Chandigarh Police', 18),
(21, 'CITY', 'Lucknow City Police', 19)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Additional Department Units
INSERT INTO department_units (id, unit_code, unit_type, agency_id, name, street, city, `state`, postal_code, country_code) VALUES
(16, 'MH-PS-011', 'POLICE_STATION', 7, 'Dombivli Police Station', '1000 Police Lane', 'Dombivli', 'Maharashtra', '421201', 'IN'),
(17, 'MH-PS-012', 'POLICE_STATION', 7, 'Navi Mumbai Police Station', '1100 Police Lane', 'Navi Mumbai', 'Maharashtra', '400710', 'IN'),
(18, 'HR-PS-001', 'POLICE_STATION', 20, 'Chandigarh Central Police Station', '100 Police Lane', 'Chandigarh', 'Chandigarh', '160001', 'IN'),
(19, 'UP-PS-001', 'POLICE_STATION', 21, 'Lucknow Central Police Station', '100 Police Lane', 'Lucknow', 'Uttar Pradesh', '226001', 'IN'),
(20, 'UP-PS-002', 'POLICE_STATION', 21, 'Lucknow East Police Station', '200 Police Lane', 'Lucknow', 'Uttar Pradesh', '226002', 'IN')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Additional Persons (more officers and victims)
INSERT INTO person (person_id, contact_primary, contact_secondary, date_of_birth, first_name, 
                    gender, last_name, national_id, nationality_code, middle_name, profile_photo_path,
                    birth_city, birth_country_code, birth_postal_code, birth_state, birth_street,
                    current_address_city, current_address_country_code, current_address_postal_code, 
                    current_address_state, current_address_street,
                    permanent_address_city, permanent_address_country_code, permanent_address_postal_code,
                    permanent_address_state, permanent_address_street) VALUES
(201, '+919800000013', '+919900000013', '1982-01-10', 'Harish', 'MALE', 'Nair', '100000000025', 'IN', 'Kumar', 'images/profiles/default-profile.png',
     'Chandigarh', 'IN', '160001', 'Chandigarh', '1300 Birth Lane',
     'Chandigarh', 'IN', '160001', 'Chandigarh', '1300 Service Road',
     'Chandigarh', 'IN', '160001', 'Chandigarh', '1300 Police Quarters'),
(202, '+919800000014', '+919900000014', '1983-02-15', 'Sunita', 'FEMALE', 'Menon', '100000000026', 'IN', 'Iyer', 'images/profiles/default-profile.png',
     'Lucknow', 'IN', '226001', 'Uttar Pradesh', '1400 Birth Lane',
     'Lucknow', 'IN', '226002', 'Uttar Pradesh', '1400 Service Road',
     'Lucknow', 'IN', '226001', 'Uttar Pradesh', '1400 Police Quarters'),
(203, '+919800000015', '+919900000015', '1984-03-20', 'Abhishek', 'MALE', 'Singh', '100000000027', 'IN', 'Sharma', 'images/profiles/default-profile.png',
     'Noida', 'IN', '201301', 'Uttar Pradesh', '1500 Birth Lane',
     'Noida', 'IN', '201302', 'Uttar Pradesh', '1500 Service Road',
     'Noida', 'IN', '201303', 'Uttar Pradesh', '1500 Police Quarters'),
(204, '+919800000016', '+919900000016', '1980-04-25', 'Asha', 'FEMALE', 'Verma', '100000000028', 'IN', 'Gupta', 'images/profiles/default-profile.png',
     'Guru gram', 'IN', '122001', 'Haryana', '1600 Birth Lane',
     'Gurgaon', 'IN', '122002', 'Haryana', '1600 Service Road',
     'Gurgaon', 'IN', '122003', 'Haryana', '1600 Police Quarters'),
(205, '+919000000013', '+919100000013', '1977-05-10', 'Karan', 'MALE', 'Patel', '100000000029', 'IN', NULL, 'images/profiles/default-profile.png',
     'Agra', 'IN', '282001', 'Uttar Pradesh', '1700 Birth Lane',
     'Agra', 'IN', '282002', 'Uttar Pradesh', '1700 Residential Lane',
     'Agra', 'IN', '282003', 'Uttar Pradesh', '1700 Permanent Lane'),
(206, '+919000000014', '+919100000014', '1978-06-15', 'Priti', 'FEMALE', 'Tiwari', '100000000030', 'IN', NULL, 'images/profiles/default-profile.png',
     'Mathura', 'IN', '281001', 'Uttar Pradesh', '1800 Birth Lane',
     'Mathura', 'IN', '281002', 'Uttar Pradesh', '1800 Residential Lane',
     'Mathura', 'IN', '281003', 'Uttar Pradesh', '1800 Permanent Lane'),
(207, '+919000000015', '+919100000015', '1976-07-20', 'Ritesh', 'MALE', 'Pandey', '100000000031', 'IN', NULL, 'images/profiles/default-profile.png',
     'Meerut', 'IN', '250001', 'Uttar Pradesh', '1900 Birth Lane',
     'Meerut', 'IN', '250002', 'Uttar Pradesh', '1900 Residential Lane',
     'Meerut', 'IN', '250003', 'Uttar Pradesh', '1900 Permanent Lane'),
(208, '+919000000016', '+919100000016', '1979-08-25', 'Rupali', 'FEMALE', 'Das', '100000000032', 'IN', NULL, 'images/profiles/default-profile.png',
     'Varanasi', 'IN', '221001', 'Uttar Pradesh', '2000 Birth Lane',
     'Varanasi', 'IN', '221002', 'Uttar Pradesh', '2000 Residential Lane',
     'Varanasi', 'IN', '221003', 'Uttar Pradesh', '2000 Permanent Lane'),
(209, '+919000000017', '+919100000017', '1975-09-30', 'Vivek', 'MALE', 'Joshi', '100000000033', 'IN', NULL, 'images/profiles/default-profile.png',
     'Indore', 'IN', '452001', 'Madhya Pradesh', '2100 Birth Lane',
     'Indore', 'IN', '452002', 'Madhya Pradesh', '2100 Residential Lane',
     'Indore', 'IN', '452003', 'Madhya Pradesh', '2100 Permanent Lane'),
(210, '+919000000018', '+919100000018', '1981-10-12', 'Anjum', 'FEMALE', 'Khan', '100000000034', 'IN', NULL, 'images/profiles/default-profile.png',
     'Bhopal', 'IN', '462001', 'Madhya Pradesh', '2200 Birth Lane',
     'Bhopal', 'IN', '462002', 'Madhya Pradesh', '2200 Residential Lane',
     'Bhopal', 'IN', '462003', 'Madhya Pradesh', '2200 Permanent Lane')
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);

-- 4. Insert Additional Users (for the new officers)
INSERT INTO users (user_id, account_status, email, password, role) VALUES
(201, 'APPROVED', 'hrishnair@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(202, 'APPROVED', 'sunitamenon@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(203, 'APPROVED', 'abhisheksingh@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(204, 'APPROVED', 'ashaverma@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER')
ON DUPLICATE KEY UPDATE account_status=VALUES(account_status);

-- 5. Insert Officer Profiles
INSERT INTO officer_profiles (user_id, active_status, badge_number, current_posting_unit_id, joining_date, role) VALUES
(201, 'ACTIVE', 'BADGE0201', 18, '2018-06-15', 'UNIT_HEAD'),
(202, 'ACTIVE', 'BADGE0202', 19, '2019-07-20', 'UNIT_OFFICER'),
(203, 'ACTIVE', 'BADGE0203', 20, '2020-08-25', 'UNIT_OFFICER'),
(204, 'ACTIVE', 'BADGE0204', 18, '2021-09-30', 'UNIT_OFFICER')
ON DUPLICATE KEY UPDATE badge_number=VALUES(badge_number);

-- 6. Insert FIRs (First Information Reports) - Additional
INSERT INTO fir (fir_id, accused_contact, accused_first_name, accused_last_name, accused_middle_name,
                 accused_city, accused_country, accused_postal_code, accused_state, accused_street,
                 created_by, created_date_time, fir_number, fir_type, initial_investigating_unit_id,
                 origin_unit_id, registration_date_time) VALUES
(11, '+919500000011', 'Harshan', 'Singh', NULL, 'Chandigarh', 'IN', '160101', 'Chandigarh', '1100 Accused Lane', 201, NOW(), 'FIR/2024/00011', 'REGULAR', 18, 18, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(12, '+919500000012', 'Suresh', 'Kumar', NULL, 'Lucknow', 'IN', '226101', 'Uttar Pradesh', '1200 Accused Lane', 202, NOW(), 'FIR/2024/00012', 'REGULAR', 19, 19, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(13, '+919500000013', 'Rajesh', 'Pande', NULL, 'Noida', 'IN', '201401', 'Uttar Pradesh', '1300 Accused Lane', 203, NOW(), 'FIR/2024/00013', 'REGULAR', 20, 20, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(14, '+919500000014', 'Mohan', 'Singh', NULL, 'Gurgaon', 'IN', '122101', 'Haryana', '1400 Accused Lane', 204, NOW(), 'FIR/2024/00014', 'ZERO', 18, 18, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(15, '+919500000015', 'Pradeep', 'Gupta', NULL, 'Agra', 'IN', '282101', 'Uttar Pradesh', '1500 Accused Lane', 201, NOW(), 'FIR/2024/00015', 'REGULAR', 19, 19, DATE_SUB(NOW(), INTERVAL 16 DAY)),
(16, '+919500000016', 'Amar', 'Yadav', NULL, 'Varanasi', 'IN', '221101', 'Uttar Pradesh', '1600 Accused Lane', 202, NOW(), 'FIR/2024/00016', 'REGULAR', 20, 20, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(17, '+919500000017', 'Ranveer', 'Singh', NULL, 'Indore', 'IN', '452101', 'Madhya Pradesh', '1700 Accused Lane', 203, NOW(), 'FIR/2024/00017', 'REGULAR', 18, 18, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(18, '+919500000018', 'Kamal', 'Khan', NULL, 'Bhopal', 'IN', '462101', 'Madhya Pradesh', '1800 Accused Lane', 204, NOW(), 'FIR/2024/00018', 'REGULAR', 19, 19, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(19, '+919500000019', 'Satish', 'Sharma', NULL, 'Dombivli', 'IN', '421301', 'Maharashtra', '1900 Accused Lane', 201, NOW(), 'FIR/2024/00019', 'REGULAR', 16, 16, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(20, '+919500000020', 'Jagannath', 'Reddy', NULL, 'Navi Mumbai', 'IN', '400810', 'Maharashtra', '2000 Accused Lane', 202, NOW(), 'FIR/2024/00020', 'REGULAR', 17, 17, DATE_SUB(NOW(), INTERVAL 11 DAY))
ON DUPLICATE KEY UPDATE fir_number=VALUES(fir_number);

-- 7. Insert Cases - Additional
INSERT INTO cases (case_id, case_number, opened_on, closed_on, court_id, current_investigating_unit_id, fir_id, stage) VALUES
(11, 'CASE/2024/00011', DATE_SUB(NOW(), INTERVAL 20 DAY), NULL, NULL, 18, 11, 'INVESTIGATION'),
(12, 'CASE/2024/00012', DATE_SUB(NOW(), INTERVAL 19 DAY), NULL, NULL, 19, 12, 'INVESTIGATION'),
(13, 'CASE/2024/00013', DATE_SUB(NOW(), INTERVAL 18 DAY), NULL, NULL, 20, 13, 'TRIAL'),
(14, 'CASE/2024/00014', DATE_SUB(NOW(), INTERVAL 17 DAY), NULL, NULL, 18, 14, 'INVESTIGATION'),
(15, 'CASE/2024/00015', DATE_SUB(NOW(), INTERVAL 16 DAY), NULL, NULL, 19, 15, 'APPEAL'),
(16, 'CASE/2024/00016', DATE_SUB(NOW(), INTERVAL 15 DAY), NULL, NULL, 20, 16, 'TRIAL'),
(17, 'CASE/2024/00017', DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), NULL, 18, 17, 'CLOSED'),
(18, 'CASE/2024/00018', DATE_SUB(NOW(), INTERVAL 13 DAY), NULL, NULL, 19, 18, 'INVESTIGATION'),
(19, 'CASE/2024/00019', DATE_SUB(NOW(), INTERVAL 12 DAY), NULL, NULL, 16, 19, 'INVESTIGATION'),
(20, 'CASE/2024/00020', DATE_SUB(NOW(), INTERVAL 11 DAY), NULL, NULL, 17, 20, 'TRIAL')
ON DUPLICATE KEY UPDATE case_number=VALUES(case_number);

-- Verify the data
SELECT 'FINAL DATA SUMMARY' as Report;
SELECT 'Agencies' as Entity, COUNT(*) as Count FROM agencies
UNION ALL
SELECT 'Department Units', COUNT(*) FROM department_units
UNION ALL
SELECT 'Persons (Total)', COUNT(*) FROM person
UNION ALL
SELECT 'Users (Officers)', COUNT(*) FROM users WHERE role = 'OFFICER'
UNION ALL
SELECT 'Officer Profiles', COUNT(*) FROM officer_profiles
UNION ALL
SELECT 'FIRs', COUNT(*) FROM fir
UNION ALL
SELECT 'Cases', COUNT(*) FROM cases;
