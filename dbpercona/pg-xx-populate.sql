-- Populating patients table
INSERT INTO patients (ts, patient_id, date_start, date_end)
VALUES 
    ('2024-04-12 08:00:00', 1, '2024-04-12 08:00:00', '2024-04-12 10:00:00'),
    ('2024-04-12 09:00:00', 2, '2024-04-12 09:00:00', NULL),
    ('2024-04-12 10:00:00', 3, '2024-04-12 10:00:00', '2024-04-12 12:00:00'),
    ('2024-04-12 11:00:00', 4, '2024-04-12 11:00:00', NULL),
    ('2024-04-12 12:00:00', 5, '2024-04-12 12:00:00', NULL);

-- Populating patient_screenings table
INSERT INTO patient_screenings (ts, patient_id, neuro_diag, age_class)
VALUES 
    ('2024-04-12 08:00:00', 1, 'Alzheimer', 'Adult'),
    ('2024-04-12 09:00:00', 2, 'Parkinson', 'Elderly'),
    ('2024-04-12 10:00:00', 5, NULL, 'Adult'),
    ('2024-04-12 11:00:00', 4, 'Alzheimer', 'Elderly'),
    ('2024-04-12 12:00:00', 5, 'Parkinson', 'Adult');


-- Populating patient_notes table
INSERT INTO patient_notes (patient_id, codice_fiscale, medical_notes) VALUES 
(1, 'MRARSS17E14H703K', 'No significant medical history.'),
(2, 'GLIRSS17H14F205T', 'Family history of dementia.'),
(3, 'QRZBLK40P47G916H', 'Requires regular medication for Parkinson.'),
(4, 'LMHGDT51B42B192Z', 'Healthy adult.'),
(5, 'XFMYSG58T56I926J', 'Mild cognitive impairment.');

-- Populating patient_details table
INSERT INTO patient_details (patient_id, first_name, last_name, home_address) VALUES 
(1, 'John', 'Doe', '123 Main St, City'),
(2, 'Alice', 'Smith', '456 Oak Ave, Town'),
(3, 'Michael', 'Johnson', '789 Elm Blvd, Village'),
(4, 'Emily', 'Brown', '987 Pine Rd, Hamlet'),
(5, 'Daniel', 'Wilson', '654 Maple Ln, Suburb');

-- Populating contacts table
INSERT INTO contacts (patient_id, alias, phone_no, email) VALUES 
(1, 'Family', '555-1234', 'tomare@omo.it'),
(2, 'Personal', '555-5678', NULL),
(3, 'Personal', '555-5678', NULL),
(3, 'Caregiver', NULL, 'qui@la.com'),
(5, 'Neighbor', '555-7890', NULL),
(5, 'Neighbor', '555-7890', NULL);
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

INSERT INTO installation_documents (ts, patient_id, file_name, file_type, file_content)
VALUES
('2024-04-14 09:00:00', 2, 'mappa_casa', 'PNG', '\x89504E470D0A1A0A0000000D4948445200000008000000080806000000C40FBE8B000000017352474200AECE1CE90000000467414D410000B18F0BFC61050000000970485973000019D6000019D60118D1CAED0000006449444154285363F88F04167B2E81B21080A993518C011F602AFFFF8A01A4089BC2255E4B1950ACE860100563108059C704550C562DEDD90F66239BC602A5C120665B34502184FD747B21506121AA0218002964600061A023C1241480AC8148C200030300578C4B5BB3BD7F370000000049454E44AE426082'::bytea),
('2024-04-14 09:15:00', 2, 'scheda', 'PNG', '\x89504E470D0A1A0A0000000D4948445200000008000000080806000000C40FBE8B000000017352474200AECE1CE90000000467414D410000B18F0BFC61050000000970485973000019D6000019D60118D1CAED0000006049444154285363FC0F040C40A0BCC9174431DCF5DB0CA64160DB73390626281B0380244100AC00A61B0490D95E928F1898908D86198FAC08EE066400331E6C029885046092B9A7F5C134E3D667B218268074C2AC815B816C2C0C286FF26500000ED62B625A4E97820000000049454E44AE426082'::bytea),
('2024-04-14 09:30:00', 3, 'mappa_casa', 'PNG', '\x89504E470D0A1A0A0000000D4948445200000008000000080806000000C40FBE8B000000017352474200AECE1CE90000000467414D410000B18F0BFC61050000000970485973000019D6000019D60118D1CAED0000005549444154285363F80F05F61E67A02C040089B130008183E759100506C86C106081091CD86E0CA66100C6670419036601014C10D91446905D2006B220B24226300B08D0AD8001B02391014821412B4000622203030031983D3E39433C800000000049454E44AE426082'::bytea);



-- Populating the `installation_details` table
INSERT INTO installation_details (
    patient_id, 
    apartment_type, 
    internet_type, 
    flatmates, 
    pets, 
    visitors, 
    smartphone_model, 
    appliances, 
    issues_notes, 
    habits_notes, 
    other_notes
) VALUES
(1, '1-bedroom', 'Fiber optic', 'None', '1 dog', 'Occasional', 'iPhone 12', 'Refrigerator, Oven, Washing machine', 'None', 'Early riser, enjoys cooking', 'Patient prefers email communication over phone calls.'),
(2, 'Studio', 'Cable', '1 roommate', 'No pets', 'Rare', 'Samsung Galaxy S20', 'Microwave, Coffee maker', 'Occasional connectivity issues reported', 'Frequent night owl, streaming movies', 'Patient has specific dietary requirements, vegetarian.'),
(3, '2-bedroom', 'DSL', 'Family (2 adults, 2 children)', '1 cat', 'Frequent', 'Google Pixel 5', 'Dishwasher, Toaster, Blender', 'None', 'Family-oriented, busy lifestyle', 'Patient expresses interest in smart home devices.'),
(4, '1-bedroom', 'Fiber optic', 'None', '2 cats', 'Occasional', 'iPhone 11', 'Stove, TV, Iron', 'None', 'Patient enjoys gardening on weekends', 'None'),
(5, 'Studio', 'Satellite', 'None', '1 dog, 1 cat', 'Frequent', 'OnePlus 9', 'Air conditioner, Heater', 'None', 'Patient prefers quiet environment, early sleeper', 'None');
