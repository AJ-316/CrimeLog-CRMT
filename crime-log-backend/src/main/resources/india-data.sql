-- Crime Log - Indian Data Seeding Script
-- This script populates the crime log database with Indian crime records

-- Clear existing data (if needed, uncomment)
-- DELETE FROM cases;
-- DELETE FROM fir;
-- DELETE FROM officer_profiles;
-- DELETE FROM users;
-- DELETE FROM person;
-- DELETE FROM department_units;
-- DELETE FROM agencies;

-- 1. Insert Agencies (State and Central Police Departments)
INSERT IGNORE INTO agencies (agency_id, agency_type, name, parent_agency_id) VALUES
(1, 'STATE', 'Maharashtra Police', NULL),
(2, 'STATE', 'Tamil Nadu Police', NULL),
(3, 'STATE', 'Karnataka Police', NULL),
(4, 'STATE', 'Delhi Police', NULL),
(5, 'STATE', 'Rajasthan Police', NULL),
(6, 'CENTRAL', 'Central Bureau of Investigation', NULL),
(7, 'CITY', 'Thane City Police', 1),
(8, 'CITY', 'Mumbai City Police', 1),
(9, 'CITY', 'Pune City Police', 1),
(10, 'CITY', 'Chennai City Police', 2),
(11, 'CITY', 'Coimbatore City Police', 2),
(12, 'CITY', 'Bangalore City Police', 3),
(13, 'CITY', 'Mysore City Police', 3),
(14, 'CITY', 'North Delhi Police', 4),
(15, 'CITY', 'South Delhi Police', 4),
(16, 'CITY', 'Jaipur City Police', 5),
(17, 'CITY', 'Jodhpur City Police', 5);

-- 2. Insert Department Units (Police Stations)
INSERT IGNORE INTO department_units (id, unit_code, unit_type, agency_id, name, 
                                     street, city, `state`, postal_code, country_code) VALUES
(1, 'MH-PS-001', 'POLICE_STATION', 7, 'Thane Central Police Station', '100 Police Lane', 'Thane', 'Maharashtra', '400601', 'IN'),
(2, 'MH-PS-002', 'POLICE_STATION', 7, 'Thane East Police Station', '200 Police Lane', 'Thane', 'Maharashtra', '400602', 'IN'),
(3, 'MH-PS-003', 'POLICE_STATION', 7, 'Thane West Police Station', '300 Police Lane', 'Thane', 'Maharashtra', '400603', 'IN'),
(4, 'MH-PS-004', 'POLICE_STATION', 7, 'Wagle Estate Police Station', '400 Police Lane', 'Thane', 'Maharashtra', '400604', 'IN'),
(5, 'MH-PS-005', 'POLICE_STATION', 7, 'Koparkhairane Police Station', '500 Police Lane', 'Thane', 'Maharashtra', '400605', 'IN'),
(6, 'MH-PS-006', 'POLICE_STATION', 8, 'Mumbai Central Police Station', '100 Police Lane', 'Mumbai', 'Maharashtra', '400001', 'IN'),
(7, 'MH-PS-007', 'POLICE_STATION', 8, 'Mumbai South Police Station', '200 Police Lane', 'Mumbai', 'Maharashtra', '400002', 'IN'),
(8, 'MH-PS-008', 'POLICE_STATION', 8, 'Mumbai North Police Station', '300 Police Lane', 'Mumbai', 'Maharashtra', '400003', 'IN'),
(9, 'MH-PS-009', 'POLICE_STATION', 9, 'Pune Central Police Station', '100 Police Lane', 'Pune', 'Maharashtra', '411001', 'IN'),
(10, 'MH-PS-010', 'POLICE_STATION', 9, 'Pune East Police Station', '200 Police Lane', 'Pune', 'Maharashtra', '411002', 'IN'),
(11, 'TN-PS-001', 'POLICE_STATION', 10, 'Chennai Teynampet Police Station', '100 Police Lane', 'Chennai', 'Tamil Nadu', '600018', 'IN'),
(12, 'TN-PS-002', 'POLICE_STATION', 10, 'Chennai Adyar Police Station', '200 Police Lane', 'Chennai', 'Tamil Nadu', '600020', 'IN'),
(13, 'KA-PS-001', 'POLICE_STATION', 12, 'Bangalore Jayanagar Police Station', '100 Police Lane', 'Bangalore', 'Karnataka', '560034', 'IN'),
(14, 'DL-PS-001', 'POLICE_STATION', 14, 'Delhi Malviya Nagar Police Station', '100 Police Lane', 'Delhi', 'Delhi', '110019', 'IN'),
(15, 'RJ-PS-001', 'POLICE_STATION', 16, 'Jaipur Central Police Station', '100 Police Lane', 'Jaipur', 'Rajasthan', '302001', 'IN');

-- 3. Insert Ranks
INSERT IGNORE INTO ranks (rank_id, hierarchy_level, rank_name) VALUES
(1, 1, 'Constable'),
(2, 2, 'Head Constable'),
(3, 3, 'Sub-Inspector'),
(4, 4, 'Inspector'),
(5, 5, 'Senior Inspector');

-- 4. Insert Persons (Police Officers)
INSERT IGNORE INTO person (person_id, contact_primary, contact_secondary, date_of_birth, first_name, 
                           gender, last_name, national_id, nationality_code, middle_name, profile_photo_path,
                           birth_city, birth_country_code, birth_postal_code, birth_state, birth_street,
                           current_address_city, current_address_country_code, current_address_postal_code, 
                           current_address_state, current_address_street,
                           permanent_address_city, permanent_address_country_code, permanent_address_postal_code,
                           permanent_address_state, permanent_address_street) VALUES
(101, '+919800000001', '+919900000001', '1990-01-15', 'Rajesh', 'MALE', 'Kumar', '100000000001', 'IN', 'Singh', 'images/profiles/default-profile.png',
     'Mumbai', 'IN', '420001', 'Maharashtra', '100 Birth Lane',
     'Thane', 'IN', '400601', 'Maharashtra', '100 Service Road',
     'Mumbai', 'IN', '400001', 'Maharashtra', '100 Police Quarters'),
(102, '+919800000002', '+919900000002', '1991-02-20', 'Priya', 'FEMALE', 'Singh', '100000000002', 'IN', 'Sharma', 'images/profiles/default-profile.png',
     'Pune', 'IN', '420002', 'Maharashtra', '200 Birth Lane',
     'Thane', 'IN', '400602', 'Maharashtra', '200 Service Road',
     'Pune', 'IN', '410001', 'Maharashtra', '200 Police Quarters'),
(103, '+919800000003', '+919900000003', '1992-03-25', 'Amit', 'MALE', 'Patel', '100000000003', 'IN', 'Kumar', 'images/profiles/default-profile.png',
     'Chennai', 'IN', '420003', 'Tamil Nadu', '300 Birth Lane',
     'Thane', 'IN', '400603', 'Maharashtra', '300 Service Road',
     'Chennai', 'IN', '600018', 'Tamil Nadu', '300 Police Quarters'),
(104, '+919800000004', '+919900000004', '1993-04-30', 'Deepak', 'MALE', 'Verma', '100000000004', 'IN', 'Singh', 'images/profiles/default-profile.png',
     'Bangalore', 'IN', '420004', 'Karnataka', '400 Birth Lane',
     'Thane', 'IN', '400604', 'Maharashtra', '400 Service Road',
     'Bangalore', 'IN', '560034', 'Karnataka', '400 Police Quarters'),
(105, '+919800000005', '+919900000005', '1994-05-10', 'Neha', 'FEMALE', 'Gupta', '100000000005', 'IN', 'Desai', 'images/profiles/default-profile.png',
     'Delhi', 'IN', '420005', 'Delhi', '500 Birth Lane',
     'Thane', 'IN', '400605', 'Maharashtra', '500 Service Road',
     'Delhi', 'IN', '110019', 'Delhi', '500 Police Quarters'),
(106, '+919800000006', '+919900000006', '1985-06-12', 'Vikram', 'MALE', 'Nair', '100000000006', 'IN', 'Iyer', 'images/profiles/default-profile.png',
     'Jaipur', 'IN', '420006', 'Rajasthan', '600 Birth Lane',
     'Thane', 'IN', '400601', 'Maharashtra', '600 Service Road',
     'Jaipur', 'IN', '302001', 'Rajasthan', '600 Police Quarters'),
(107, '+919800000007', '+919900000007', '1986-07-18', 'Anjali', 'FEMALE', 'Bhat', '100000000007', 'IN', 'Menon', 'images/profiles/default-profile.png',
     'Mumbai', 'IN', '420007', 'Maharashtra', '700 Birth Lane',
     'Mumbai', 'IN', '400001', 'Maharashtra', '700 Service Road',
     'Mumbai', 'IN', '400001', 'Maharashtra', '700 Police Quarters'),
(108, '+919800000008', '+919900000008', '1987-08-22', 'Suresh', 'MALE', 'Rao', '100000000008', 'IN', 'Kumar', 'images/profiles/default-profile.png',
     'Pune', 'IN', '420008', 'Maharashtra', '800 Birth Lane',
     'Pune', 'IN', '411001', 'Maharashtra', '800 Service Road',
     'Pune', 'IN', '411001', 'Maharashtra', '800 Police Quarters'),
(109, '+919800000009', '+919900000009', '1988-09-25', 'Meera', 'FEMALE', 'Iyer', '100000000009', 'IN', 'Nair', 'images/profiles/default-profile.png',
     'Chennai', 'IN', '420009', 'Tamil Nadu', '900 Birth Lane',
     'Chennai', 'IN', '600018', 'Tamil Nadu', '900 Service Road',
     'Chennai', 'IN', '600018', 'Tamil Nadu', '900 Police Quarters'),
(110, '+919800000010', '+919900000010', '1989-10-30', 'Arjun', 'MALE', 'Singh', '100000000010', 'IN', 'Sharma', 'images/profiles/default-profile.png',
     'Bangalore', 'IN', '420010', 'Karnataka', '1000 Birth Lane',
     'Bangalore', 'IN', '560034', 'Karnataka', '1000 Service Road',
     'Bangalore', 'IN', '560034', 'Karnataka', '1000 Police Quarters'),
(111, '+919800000011', '+919900000011', '1980-11-12', 'Pooja', 'FEMALE', 'Sharma', '100000000011', 'IN', 'Verma', 'images/profiles/default-profile.png',
     'Delhi', 'IN', '420011', 'Delhi', '1100 Birth Lane',
     'Delhi', 'IN', '110019', 'Delhi', '1100 Service Road',
     'Delhi', 'IN', '110019', 'Delhi', '1100 Police Quarters'),
(112, '+919800000012', '+919900000012', '1981-12-15', 'Sanjay', 'MALE', 'Kumar', '100000000012', 'IN', 'Singh', 'images/profiles/default-profile.png',
     'Jaipur', 'IN', '420012', 'Rajasthan', '1200 Birth Lane',
     'Jaipur', 'IN', '302001', 'Rajasthan', '1200 Service Road',
     'Jaipur', 'IN', '302001', 'Rajasthan', '1200 Police Quarters'),
-- Additional persons (victims, witnesses)
(113, '+919000000001', '+919100000001', '1975-01-20', 'Vikram', 'MALE', 'Pillai', '100000000013', 'IN', NULL, 'images/profiles/default-profile.png',
     'Mumbai', 'IN', '420013', 'Maharashtra', '1300 Birth Lane',
     'Thane', 'IN', '400603', 'Maharashtra', '1300 Residential Lane',
     'Mumbai', 'IN', '400001', 'Maharashtra', '1300 Permanent Lane'),
(114, '+919000000002', '+919100000002', '1978-02-25', 'Divya', 'FEMALE', 'Desai', '100000000014', 'IN', NULL, 'images/profiles/default-profile.png',
     'Pune', 'IN', '420014', 'Maharashtra', '1400 Birth Lane',
     'Nagpur', 'IN', '410002', 'Maharashtra', '1400 Residential Lane',
     'Pune', 'IN', '411001', 'Maharashtra', '1400 Permanent Lane'),
(115, '+919000000003', '+919100000003', '1980-03-30', 'Rajeev', 'MALE', 'Verma', '100000000015', 'IN', NULL, 'images/profiles/default-profile.png',
     'Chennai', 'IN', '420015', 'Tamil Nadu', '1500 Birth Lane',
     'Chennai', 'IN', '600018', 'Tamil Nadu', '1500 Residential Lane',
     'Chennai', 'IN', '600020', 'Tamil Nadu', '1500 Permanent Lane'),
(116, '+919000000004', '+919100000004', '1982-04-15', 'Priya', 'FEMALE', 'Sharma', '100000000016', 'IN', NULL, 'images/profiles/default-profile.png',
     'Bangalore', 'IN', '420016', 'Karnataka', '1600 Birth Lane',
     'Bangalore', 'IN', '560034', 'Karnataka', '1600 Residential Lane',
     'Bangalore', 'IN', '560057', 'Karnataka', '1600 Permanent Lane'),
(117, '+919000000005', '+919100000005', '1984-05-20', 'Arun', 'MALE', 'Singh', '100000000017', 'IN', NULL, 'images/profiles/default-profile.png',
     'Delhi', 'IN', '420017', 'Delhi', '1700 Birth Lane',
     'Delhi', 'IN', '110019', 'Delhi', '1700 Residential Lane',
     'Delhi', 'IN', '110021', 'Delhi', '1700 Permanent Lane'),
(118, '+919000000006', '+919100000006', '1976-06-25', 'Meera', 'FEMALE', 'Gupta', '100000000018', 'IN', NULL, 'images/profiles/default-profile.png',
     'Jaipur', 'IN', '420018', 'Rajasthan', '1800 Birth Lane',
     'Jaipur', 'IN', '302001', 'Rajasthan', '1800 Residential Lane',
     'Jaipur', 'IN', '302002', 'Rajasthan', '1800 Permanent Lane'),
(119, '+919000000007', '+919100000007', '1977-07-30', 'Sunil', 'MALE', 'Patel', '100000000019', 'IN', NULL, 'images/profiles/default-profile.png',
     'Ahmedabad', 'IN', '420019', 'Gujarat', '1900 Birth Lane',
     'Aurangabad', 'IN', '410701', 'Maharashtra', '1900 Residential Lane',
     'Vadodara', 'IN', '390001', 'Gujarat', '1900 Permanent Lane'),
(120, '+919000000008', '+919100000008', '1979-08-15', 'Anjali', 'FEMALE', 'Iyer', '100000000020', 'IN', NULL, 'images/profiles/default-profile.png',
     'Hyderabad', 'IN', '420020', 'Telangana', '2000 Birth Lane',
     'Aurangabad', 'IN', '410702', 'Maharashtra', '2000 Residential Lane',
     'Hyderabad', 'IN', '500001', 'Telangana', '2000 Permanent Lane'),
(121, '+919000000009', '+919100000009', '1981-09-20', 'Rajesh', 'MALE', 'Nair', '100000000021', 'IN', NULL, 'images/profiles/default-profile.png',
     'Kochi', 'IN', '420021', 'Kerala', '2100 Birth Lane',
     'Nagpur', 'IN', '410703', 'Maharashtra', '2100 Residential Lane',
     'Kochi', 'IN', '682001', 'Kerala', '2100 Permanent Lane'),
(122, '+919000000010', '+919100000010', '1983-10-25', 'Sneha', 'FEMALE', 'Bhat', '100000000022', 'IN', NULL, 'images/profiles/default-profile.png',
     'Kolkata', 'IN', '420022', 'West Bengal', '2200 Birth Lane',
     'Nagpur', 'IN', '410704', 'Maharashtra', '2200 Residential Lane',
     'Kolkata', 'IN', '700001', 'West Bengal', '2200 Permanent Lane'),
(123, '+919000000011', '+919100000011', '1985-11-30', 'Vikas', 'MALE', 'Rao', '100000000023', 'IN', NULL, 'images/profiles/default-profile.png',
     'Lucknow', 'IN', '420023', 'Uttar Pradesh', '2300 Birth Lane',
     'Nagpur', 'IN', '410705', 'Maharashtra', '2300 Residential Lane',
     'Lucknow', 'IN', '226001', 'Uttar Pradesh', '2300 Permanent Lane'),
(124, '+919000000012', '+919100000012', '1987-12-10', 'Kavya', 'FEMALE', 'Kumar', '100000000024', 'IN', NULL, 'images/profiles/default-profile.png',
     'Chandigarh', 'IN', '420024', 'Chandigarh', '2400 Birth Lane',
     'Pune', 'IN', '410706', 'Maharashtra', '2400 Residential Lane',
     'Chandigarh', 'IN', '160001', 'Chandigarh', '2400 Permanent Lane');

-- 5. Insert Users (Police Officers)
INSERT IGNORE INTO users (user_id, account_status, email, password, role) VALUES
(101, 'APPROVED', 'rajeshumar@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(102, 'APPROVED', 'priyasingh@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(103, 'APPROVED', 'amitpatel@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(104, 'APPROVED', 'deepakverma@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(105, 'APPROVED', 'nehagupta@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(106, 'APPROVED', 'vikramnair@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(107, 'APPROVED', 'anjalibhat@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(108, 'APPROVED', 'sureshrao@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(109, 'APPROVED', 'meeraiyer@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(110, 'APPROVED', 'arjunsingh@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(111, 'APPROVED', 'poojasharma@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER'),
(112, 'APPROVED', 'sanjaykumar@crimelog.com', '$2a$10$qYp.8K6jQEzF.vZVf9RKKOkGqGwI4K3d2O5sB.2K8J3dL2M8N9P1q', 'OFFICER');

-- 6. Insert Officer Profiles
INSERT IGNORE INTO officer_profiles (user_id, active_status, badge_number, current_posting_unit_id, joining_date, role) VALUES
(101, 'ACTIVE', 'BADGE0001', 1, '2019-01-01', 'UNIT_HEAD'),
(102, 'ACTIVE', 'BADGE0002', 2, '2020-01-01', 'UNIT_HEAD'),
(103, 'ACTIVE', 'BADGE0003', 3, '2021-01-01', 'UNIT_HEAD'),
(104, 'ACTIVE', 'BADGE0004', 4, '2019-01-01', 'UNIT_OFFICER'),
(105, 'ACTIVE', 'BADGE0005', 5, '2020-01-01', 'UNIT_OFFICER'),
(106, 'ACTIVE', 'BADGE0006', 6, '2021-01-01', 'UNIT_OFFICER'),
(107, 'ACTIVE', 'BADGE0007', 7, '2019-01-01', 'UNIT_OFFICER'),
(108, 'ACTIVE', 'BADGE0008', 8, '2020-01-01', 'UNIT_OFFICER'),
(109, 'ACTIVE', 'BADGE0009', 9, '2021-01-01', 'UNIT_OFFICER'),
(110, 'ACTIVE', 'BADGE0010', 10, '2019-01-01', 'UNIT_OFFICER'),
(111, 'ACTIVE', 'BADGE0011', 11, '2020-01-01', 'UNIT_OFFICER'),
(112, 'ACTIVE', 'BADGE0012', 12, '2021-01-01', 'UNIT_OFFICER');

-- 7. Insert FIRs (First Information Reports) - at least 10
INSERT IGNORE INTO fir (fir_id, accused_contact, accused_first_name, accused_last_name, accused_middle_name,
                        accused_city, accused_country, accused_postal_code, accused_state, accused_street,
                        created_by, created_date_time, fir_number, fir_type, initial_investigating_unit_id,
                        origin_unit_id, registration_date_time) VALUES
(1, '+919500000001', 'Ashok', 'Singh', NULL, 'Thane', 'IN', '400101', 'Maharashtra', '100 Accused Lane', 101, NOW(), 'FIR/2024/00001', 'REGULAR', 2, 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, '+919500000002', 'Rajesh', 'Patel', NULL, 'Thane', 'IN', '400102', 'Maharashtra', '200 Accused Lane', 102, NOW(), 'FIR/2024/00002', 'REGULAR', 3, 2, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(3, '+919500000003', 'Vikram', 'Sharma', NULL, 'Mumbai', 'IN', '400103', 'Maharashtra', '300 Accused Lane', 103, NOW(), 'FIR/2024/00003', 'REGULAR', 4, 3, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(4, '+919500000004', 'Sanjay', 'Kumar', NULL, 'Mumbai', 'IN', '400104', 'Maharashtra', '400 Accused Lane', 104, NOW(), 'FIR/2024/00004', 'REGULAR', 5, 4, DATE_SUB(NOW(), INTERVAL 27 DAY)),
(5, '+919500000005', 'Nitin', 'Verma', NULL, 'Pune', 'IN', '400105', 'Maharashtra', '500 Accused Lane', 105, NOW(), 'FIR/2024/00005', 'ZERO', 6, 5, DATE_SUB(NOW(), INTERVAL 26 DAY)),
(6, '+919500000006', 'Karan', 'Mishra', NULL, 'Pune', 'IN', '400106', 'Maharashtra', '600 Accused Lane', 106, NOW(), 'FIR/2024/00006', 'REGULAR', 7, 6, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(7, '+919500000007', 'Rohan', 'Nair', NULL, 'Chennai', 'IN', '600101', 'Tamil Nadu', '700 Accused Lane', 107, NOW(), 'FIR/2024/00007', 'REGULAR', 8, 11, DATE_SUB(NOW(), INTERVAL 24 DAY)),
(8, '+919500000008', 'Anil', 'Gupta', NULL, 'Bangalore', 'IN', '560101', 'Karnataka', '800 Accused Lane', 108, NOW(), 'FIR/2024/00008', 'REGULAR', 9, 13, DATE_SUB(NOW(), INTERVAL 23 DAY)),
(9, '+919500000009', 'Sunil', 'Rao', NULL, 'Delhi', 'IN', '110101', 'Delhi', '900 Accused Lane', 109, NOW(), 'FIR/2024/00009', 'REGULAR', 10, 14, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(10, '+919500000010', 'Vikas', 'Bhatt', NULL, 'Jaipur', 'IN', '302101', 'Rajasthan', '1000 Accused Lane', 110, NOW(), 'FIR/2024/00010', 'REGULAR', 1, 15, DATE_SUB(NOW(), INTERVAL 21 DAY));

-- 8. Insert Cases - at least 10
INSERT IGNORE INTO cases (case_id, case_number, opened_on, closed_on, court_id, current_investigating_unit_id, fir_id, stage) VALUES
(1, 'CASE/2024/00001', DATE_SUB(NOW(), INTERVAL 60 DAY), NULL, NULL, 1, 1, 'INVESTIGATION'),
(2, 'CASE/2024/00002', DATE_SUB(NOW(), INTERVAL 55 DAY), NULL, NULL, 2, 2, 'INVESTIGATION'),
(3, 'CASE/2024/00003', DATE_SUB(NOW(), INTERVAL 50 DAY), NULL, NULL, 3, 3, 'TRIAL'),
(4, 'CASE/2024/00004', DATE_SUB(NOW(), INTERVAL 45 DAY), NULL, NULL, 4, 4, 'TRIAL'),
(5, 'CASE/2024/00005', DATE_SUB(NOW(), INTERVAL 40 DAY), NULL, NULL, 5, 5, 'INVESTIGATION'),
(6, 'CASE/2024/00006', DATE_SUB(NOW(), INTERVAL 35 DAY), NULL, NULL, 6, 6, 'APPEAL'),
(7, 'CASE/2024/00007', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), NULL, 7, 7, 'CLOSED'),
(8, 'CASE/2024/00008', DATE_SUB(NOW(), INTERVAL 25 DAY), NULL, NULL, 8, 8, 'TRIAL'),
(9, 'CASE/2024/00009', DATE_SUB(NOW(), INTERVAL 20 DAY), NULL, NULL, 9, 9, 'INVESTIGATION'),
(10, 'CASE/2024/00010', DATE_SUB(NOW(), INTERVAL 15 DAY), NULL, NULL, 10, 10, 'INVESTIGATION');

-- Verify the data
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
