INSERT INTO patients (patient_id, first_name, last_name, cf, address, contact, medical_notes, install_num, creation_time)
VALUES
(1, 'John', 'Doe', 'ABCD1234', '123 Main St, Anytown, USA', '555-1234', 'Hypertension', 101, CURRENT_TIMESTAMP),
(2, 'Jane', 'Smith', 'EFGH5678', '456 Elm St, Othertown, USA', '555-5678', 'Diabetes', 102, CURRENT_TIMESTAMP),
(3, 'Alice', 'Johnson', 'IJKL9012', '789 Oak St, Anothertown, USA', '555-9012', 'Asthma', 103, CURRENT_TIMESTAMP);

INSERT INTO notes (install_num, install_notes)
VALUES
(101, 'Patient has been prescribed with medication X for hypertension'),
(102, 'Patient requires regular insulin injections for diabetes control'),
(103, 'Patient has been advised to use inhaler for asthma attacks');

INSERT INTO tickets (install_num, ticket_open_time, ticket_close_time, status)
VALUES
(101, CURRENT_TIMESTAMP, NULL, 'Open'),
(102, CURRENT_TIMESTAMP, NULL, 'Open'),
(103, CURRENT_TIMESTAMP, NULL, 'Open');

INSERT INTO ticket_messages (message_time, sender, ticket_id)
VALUES
(CURRENT_TIMESTAMP, 'Dr. Smith', 1),
(CURRENT_TIMESTAMP, 'Nurse Johnson', 2),
(CURRENT_TIMESTAMP, 'Receptionist', 3);