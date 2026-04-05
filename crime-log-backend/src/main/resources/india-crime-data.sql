-- Crime Log India Data Population Script
-- This script populates the database with Indian crime-related data

-- Insert Officers (at least 10 entries)
INSERT INTO officer (officer_id, name, badge_number, rank, station_id, email, phone) VALUES
(1, 'Rajesh Kumar Singh', 'BDG001', 'Inspector General', 1, 'rajesh.singh@police.gov.in', '9876543210'),
(2, 'Priya Sharma', 'BDG002', 'Deputy Commissioner', 1, 'priya.sharma@police.gov.in', '9876543211'),
(3, 'Amit Patel', 'BDG003', 'Senior Police Inspector', 2, 'amit.patel@police.gov.in', '9876543212'),
(4, 'Neha Gupta', 'BDG004', 'Police Inspector', 2, 'neha.gupta@police.gov.in', '9876543213'),
(5, 'Vikram Reddy', 'BDG005', 'Sub-Inspector', 3, 'vikram.reddy@police.gov.in', '9876543214'),
(6, 'Deepak Verma', 'BDG006', 'Sub-Inspector', 3, 'deepak.verma@police.gov.in', '9876543215'),
(7, 'Anjali Mishra', 'BDG007', 'Constable', 1, 'anjali.mishra@police.gov.in', '9876543216'),
(8, 'Suresh Kumar', 'BDG008', 'Constable', 2, 'suresh.kumar@police.gov.in', '9876543217'),
(9, 'Pooja Nair', 'BDG009', 'Head Constable', 3, 'pooja.nair@police.gov.in', '9876543218'),
(10, 'Rohan Singh', 'BDG010', 'Constable', 1, 'rohan.singh@police.gov.in', '9876543219');

-- Insert Persons (at least 10 entries)
INSERT INTO person (person_id, first_name, last_name, date_of_birth, gender, address, city, state, zip_code, phone, email, aadhaar_number) VALUES
(1, 'Ravi', 'Kumar', '1985-03-15', 'M', '123 MG Road', 'Bangalore', 'Karnataka', '560001', '8888888888', 'ravi.kumar@email.com', '123456789012'),
(2, 'Ananya', 'Sharma', '1990-07-22', 'F', '456 Park Street', 'Kolkata', 'West Bengal', '700001', '9999999999', 'ananya.sharma@email.com', '234567890123'),
(3, 'Arjun', 'Patel', '1988-11-08', 'M', '789 Commerce Street', 'Mumbai', 'Maharashtra', '400001', '7777777777', 'arjun.patel@email.com', '345678901234'),
(4, 'Divya', 'Singh', '1992-05-30', 'F', '321 Connaught Place', 'Delhi', 'Delhi', '110001', '8765432109', 'divya.singh@email.com', '456789012345'),
(5, 'Vikram', 'Reddy', '1987-12-12', 'M', '654 Jubilee Hills', 'Hyderabad', 'Telangana', '500033', '9123456789', 'vikram.reddy@email.com', '567890123456'),
(6, 'Neha', 'Gupta', '1993-02-18', 'F', '987 Rajendra Nagar', 'Pune', 'Maharashtra', '411016', '8904567890', 'neha.gupta@email.com', '678901234567'),
(7, 'Sanjay', 'Verma', '1986-09-25', 'M', '147 Sector 17', 'Chandigarh', 'Chandigarh', '160017', '9812345678', 'sanjay.verma@email.com', '789012345678'),
(8, 'Priya', 'Nair', '1991-04-14', 'F', '258 Willingdon Island', 'Kochi', 'Kerala', '682001', '9876543210', 'priya.nair@email.com', '890123456789'),
(9, 'Aditya', 'Joshi', '1989-08-20', 'M', '369 Baner Road', 'Pune', 'Maharashtra', '411045', '8765432109', 'aditya.joshi@email.com', '901234567890'),
(10, 'Meera', 'Rao', '1994-06-28', 'F', '741 Whitefield', 'Bangalore', 'Karnataka', '560066', '9988776655', 'meera.rao@email.com', '012345678901');

-- Insert Cases (at least 10 entries)
INSERT INTO case_record (case_id, case_number, title, description, status, priority, case_type, created_date, assigned_officer, victim_person_id) VALUES
(1, 'CASE/2026/001', 'Theft at MG Road', 'Residential theft case involving stolen electronics', 'OPEN', 'HIGH', 'THEFT', '2026-01-15', 1, 1),
(2, 'CASE/2026/002', 'Cyber Fraud - Online Shopping', 'Victim defrauded while purchasing mobile phone online', 'OPEN', 'MEDIUM', 'CYBER_FRAUD', '2026-01-20', 2, 2),
(3, 'CASE/2026/003', 'Hit and Run - Local Street', 'Vehicle hit and run incident, victim hospitalized', 'UNDER_INVESTIGATION', 'HIGH', 'TRAFFIC', '2026-01-25', 3, 3),
(4, 'CASE/2026/004', 'Property Dispute - Apartment', 'Boundary dispute between neighbors in residential complex', 'OPEN', 'LOW', 'PROPERTY_DISPUTE', '2026-02-01', 4, 4),
(5, 'CASE/2026/005', 'Assault Case - Market Area', 'Physical assault during street altercation', 'UNDER_INVESTIGATION', 'HIGH', 'ASSAULT', '2026-02-05', 5, 5),
(6, 'CASE/2026/006', 'Vehicle Theft - Parking Area', 'Car stolen from apartment parking area', 'OPEN', 'MEDIUM', 'THEFT', '2026-02-10', 6, 6),
(7, 'CASE/2026/007', 'Breaking and Entering - Shop', 'Commercial property burglary at jewelry store', 'UNDER_INVESTIGATION', 'HIGH', 'BURGLARY', '2026-02-12', 1, 7),
(8, 'CASE/2026/008', 'Cheque Bounce - Business', 'Unauthorized cheque bounce leading to financial loss', 'OPEN', 'MEDIUM', 'FINANCIAL_CRIME', '2026-02-15', 2, 8),
(9, 'CASE/2026/009', 'Police Verification - Missing Person', 'Missing person reported, search ongoing', 'OPEN', 'CRITICAL', 'MISSING_PERSON', '2026-02-18', 3, 9),
(10, 'CASE/2026/010', 'Counterfeit Currency - De-briefed', 'Counterfeit currency notes recovered and seized', 'CLOSED', 'HIGH', 'FINANCIAL_CRIME', '2026-02-20', 4, 10);

-- Insert FIR (First Information Reports) - at least 10 entries
INSERT INTO fir (fir_id, fir_number, case_id, complainant_person_id, accused_person_id, crime_section, description, filed_date, status) VALUES
(1, 'FIR/2026/0001', 1, 1, NULL, '379, 406 IPC', 'Theft of laptop and mobile phone from residence', '2026-01-15', 'REGISTERED'),
(2, 'FIR/2026/0002', 2, 2, NULL, '419, 420 IPC', 'Cheating through online marketplace transaction', '2026-01-20', 'REGISTERED'),
(3, 'FIR/2026/0003', 3, 3, NULL, '304A, 337 IPC', 'Hit and run resulting in serious injuries', '2026-01-25', 'REGISTERED'),
(4, 'FIR/2026/0004', 4, 4, 5, 'PROPERTY_ACT', 'Land boundary encroachment dispute', '2026-02-01', 'REGISTERED'),
(5, 'FIR/2026/0005', 5, 5, 6, '325, 506 IPC', 'Common assault and criminal intimidation', '2026-02-05', 'REGISTERED'),
(6, 'FIR/2026/0006', 6, 6, NULL, '379 IPC', 'Theft of motor vehicle from parking area', '2026-02-10', 'REGISTERED'),
(7, 'FIR/2026/0007', 7, 7, 8, '457, 380, 392 IPC', 'Breaking and entering with theft intent', '2026-02-12', 'REGISTERED'),
(8, 'FIR/2026/0008', 8, 8, 9, '138, 142 NI Act', 'Cheque dishonour - negotiable instruments', '2026-02-15', 'REGISTERED'),
(9, 'FIR/2026/0009', 9, 9, NULL, 'MISSING_PERSON', 'Missing person report - adult missing since 3 days', '2026-02-18', 'REGISTERED'),
(10, 'FIR/2026/0010', 10, 10, NULL, '489-A, 489-B, 489-C IPC', 'Counterfeit currency notes seized during inspection', '2026-02-20', 'REGISTERED');

-- Insert Requests (at least 10 entries)
INSERT INTO request (request_id, case_id, request_type, status, description, requested_date, response_date) VALUES
(1, 1, 'EVIDENCE_COLLECTION', 'APPROVED', 'Request for CCTV footage from neighboring shops', '2026-01-16', '2026-01-17'),
(2, 2, 'EXPERT_CONSULTATION', 'PENDING', 'Cybersecurity expert consultation for digital evidence analysis', '2026-01-21', NULL),
(3, 3, 'MEDICAL_REPORT', 'APPROVED', 'Medical examination and injury assessment report', '2026-01-26', '2026-01-27'),
(4, 4, 'LEGAL_OPINION', 'PENDING', 'Legal opinion on property law and boundary disputes', '2026-02-02', NULL),
(5, 5, 'EVIDENCE_COLLECTION', 'APPROVED', 'Medical and injury documentation from hospital', '2026-02-06', '2026-02-07'),
(6, 6, 'VEHICLE_TRACKING', 'APPROVED', 'GPS and vehicle tracking data request from authorities', '2026-02-11', '2026-02-12'),
(7, 7, 'EVIDENCE_COLLECTION', 'APPROVED', 'Forensic examination of stolen jewelry and tools used', '2026-02-13', '2026-02-14'),
(8, 8, 'BANK_RECORD', 'APPROVED', 'Bank statement and cheque clearance records', '2026-02-16', '2026-02-17'),
(9, 9, 'MISSING_PERSON_ALERT', 'APPROVED', 'National missing person alert and media broadcast', '2026-02-19', '2026-02-19'),
(10, 10, 'EVIDENCE_DESTRUCTION', 'APPROVED', 'Counterfeit currency destruction report and documentation', '2026-02-21', '2026-02-22');

-- Insert Addresses (at least 10 entries)
INSERT INTO address (address_id, person_id, street_address, city, state, country, zip_code, address_type) VALUES
(1, 1, '123 MG Road, Landmark: Near Bangalore Club', 'Bangalore', 'Karnataka', 'India', '560001', 'RESIDENTIAL'),
(2, 2, '456 Park Street, Landmark: Kalighat Temple Crossing', 'Kolkata', 'West Bengal', 'India', '700001', 'RESIDENTIAL'),
(3, 3, '789 Commerce Street, Landmark: Fort Market', 'Mumbai', 'Maharashtra', 'India', '400001', 'RESIDENTIAL'),
(4, 4, '321 Connaught Place, Landmark: Central Delhi Shopping Hub', 'Delhi', 'Delhi', 'India', '110001', 'RESIDENTIAL'),
(5, 5, '654 Jubilee Hills, Landmark: Hyderabad Business District', 'Hyderabad', 'Telangana', 'India', '500033', 'RESIDENTIAL'),
(6, 6, '987 Rajendra Nagar, Landmark: Pune University Area', 'Pune', 'Maharashtra', 'India', '411016', 'RESIDENTIAL'),
(7, 7, '147 Sector 17, Landmark: Chandigarh City Center', 'Chandigarh', 'Chandigarh', 'India', '160017', 'RESIDENTIAL'),
(8, 8, '258 Willingdon Island, Landmark: Kochi Business Hub', 'Kochi', 'Kerala', 'India', '682001', 'RESIDENTIAL'),
(9, 9, '369 Baner Road, Landmark: Pune IT Park', 'Pune', 'Maharashtra', 'India', '411045', 'RESIDENTIAL'),
(10, 10, '741 Whitefield, Landmark: Bangalore Tech Hub', 'Bangalore', 'Karnataka', 'India', '560066', 'RESIDENTIAL');

-- Insert Approvals (at least 10 entries)
INSERT INTO approval (approval_id, case_id, approver_officer_id, status, comments, approval_date) VALUES
(1, 1, 2, 'APPROVED', 'Evidence collection approved for theft investigation', '2026-01-17'),
(2, 2, 1, 'PENDING', 'Pending higher authority approval for cyber fraud case', '2026-01-21'),
(3, 3, 3, 'APPROVED', 'Traffic accident investigation approved and documented', '2026-01-26'),
(4, 4, 4, 'APPROVED', 'Property dispute mediation approved', '2026-02-02'),
(5, 5, 5, 'APPROVED', 'Assault case investigation approved with medical documentation', '2026-02-06'),
(6, 6, 6, 'APPROVED', 'Vehicle theft investigation approved', '2026-02-11'),
(7, 7, 1, 'APPROVED', 'Burglary investigation approved with forensic support', '2026-02-13'),
(8, 8, 2, 'APPROVED', 'Financial crime investigation approved', '2026-02-16'),
(9, 9, 3, 'APPROVED', 'Missing person case approval for national broadcast', '2026-02-19'),
(10, 10, 4, 'CLOSED', 'Counterfeit currency case closed after evidence destruction', '2026-02-21');

-- Insert Audit Logs (at least 10 entries)
INSERT INTO audit_log (audit_id, case_id, action, performed_by_officer_id, action_date, details) VALUES
(1, 1, 'CASE_CREATED', 1, '2026-01-15', 'Theft case registered at Bangalore North Police Station'),
(2, 1, 'EVIDENCE_UPDATED', 2, '2026-01-17', 'CCTV footage collected from neighboring shops'),
(3, 2, 'CASE_CREATED', 2, '2026-01-20', 'Cyber fraud case registered and forwarded to cyber cell'),
(4, 3, 'CASE_CREATED', 3, '2026-01-25', 'Hit and run case registered with medical documentation'),
(5, 4, 'STATUS_UPDATED', 4, '2026-02-01', 'Property dispute case status changed to OPEN'),
(6, 5, 'CASE_CREATED', 5, '2026-02-05', 'Assault case registered with injury documentation'),
(7, 6, 'CASE_CREATED', 6, '2026-02-10', 'Vehicle theft case registered at city police station'),
(8, 7, 'EVIDENCE_UPDATED', 1, '2026-02-13', 'Forensic report received for burglary investigation'),
(9, 8, 'STATUS_UPDATED', 2, '2026-02-16', 'Financial crime case status updated to UNDER_INVESTIGATION'),
(10, 10, 'CASE_CLOSED', 4, '2026-02-21', 'Counterfeit currency case closed after conviction');
