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
-- Populating the `tickets` table
INSERT INTO tickets (ts, patient_id, date_closed)
VALUES 
    ('2024-04-12 08:00:00', 1, '2024-04-12 10:00:00'),
    ('2024-04-12 09:00:00', 2, NULL),
    ('2024-04-12 10:00:00', 3, '2024-04-12 12:00:00'),
    ('2024-04-12 11:00:00', 4, NULL),
    ('2024-04-12 12:00:00', 5, NULL);


-- Populating the `ticket_messages` table
INSERT INTO ticket_messages (ts, sender, body, ticket_id)
VALUES 
    ('2024-04-12 08:00:00', '>Bob', 'Message 1', 1),
    ('2024-04-12 09:00:00', 'CHARLIE@ME', 'Message 2', 2),
    ('2024-04-12 10:00:00', '>Bob', 'Message 3', 3),
    ('2024-04-12 11:00:00', 'CHARLIE@ME', 'Message 4', 4),
    ('2024-04-12 12:00:00', '>Bob', 'Message 5', 5),
    ('2024-04-13 08:00:00', 'CHARLIE@ME', 'Message 1', 1),
    ('2024-04-13 09:00:00', '>Bob', 'Message 2', 2),
    ('2024-04-13 10:00:00', 'CHARLIE@ME', 'Message 3', 3),
    ('2024-04-13 11:00:00', '>Bob', 'Message 4', 4),
    ('2024-04-13 12:00:00', 'Admin', 'Message 5', 5);
