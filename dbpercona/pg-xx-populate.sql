-- Populating patients table
INSERT INTO patients (ts, patient_id, date_join)
VALUES 
    ('2024-04-12 08:00:00', 'zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', '2024-04-12 08:00:00'),
    ('2024-04-12 09:00:00', 'h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', '2024-04-12 09:00:00'),
    ('2024-04-12 10:00:00', 'ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', '2024-04-12 10:00:00'),
    ('2024-04-12 11:00:00', 'V8IeQNz5OPr8PTAEMEU6VEzFdjnGTY3_', '2024-04-12 11:00:00'),
    ('2024-04-12 12:00:00', '5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', '2024-04-12 12:00:00');

-- Populating patient_screenings table
INSERT INTO patient_screenings (patient_id, neuro_diag, age_class)
VALUES 
    ('zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', 'Alzheimer', 'Adult'),
    ('h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'Parkinson', 'Elderly'),
    ('ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', 'Alzheimer', 'Adult'),
    ('V8IeQNz5OPr8PTAEMEU6VEzFdjnGTY3_', 'Alzheimer', 'Elderly'),
    ('5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', 'Parkinson', 'Adult');


-- Populating patient_notes table
INSERT INTO patient_notes (patient_id, codice_fiscale, medical_notes) VALUES 
('zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', 'MRARSS17E14H703K', 'No significant medical history.'),
('h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'GLIRSS17H14F205T', 'Family history of dementia.'),
('ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', 'QRZBLK40P47G916H', 'Requires regular medication for Parkinson.'),
('V8IeQNz5OPr8PTAEMEU6VEzFdjnGTY3_', 'LMHGDT51B42B192Z', 'Healthy adult.'),
('5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', 'XFMYSG58T56I926J', 'Mild cognitive impairment.');

-- Populating patient_details table
INSERT INTO patient_details (patient_id, first_name, last_name, home_address) VALUES 
('zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', 'John', 'Doe', '123 Main St, City'),
('h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'Alice', 'Smith', '456 Oak Ave, Town'),
('ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', 'Michael', 'Johnson', '789 Elm Blvd, Village'),
('V8IeQNz5OPr8PTAEMEU6VEzFdjnGTY3_', 'Emily', 'Brown', '987 Pine Rd, Hamlet'),
('5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', 'Daniel', 'Wilson', '654 Maple Ln, Suburb');

-- Populating contacts table
INSERT INTO contacts (patient_id, alias, phone_no, email) VALUES 
('zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', 'Family', '555-1234', 'tomare@omo.it'),
('h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'Personal', '555-5678', NULL),
('ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', 'Personal', '555-5678', NULL),
('ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', 'Caregiver', NULL, 'qui@la.com'),
('5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', 'Neighbor', '555-7890', NULL),
('5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', 'Neighbor', '555-7890', NULL);
-- Populating the `tickets` table
INSERT INTO tickets (ts, category,patient_id, date_closed)
VALUES 
    ('2024-04-12 08:00:00', 'installazione','zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', '2024-04-12 10:00:00'),
    ('2024-04-12 09:00:00', 'disinstallazione','h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', NULL),
    ('2024-04-12 10:00:00', 'manutenzione','ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', '2024-04-12 12:00:00'),
    ('2024-04-12 11:00:00', 'manutenzione','V8IeQNz5OPr8PTAEMEU6VEzFdjnGTY3_', NULL),
    ('2024-04-12 12:00:00', 'manutenzione','5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', NULL);


-- Populating the `ticket_messages` table
INSERT INTO ticket_messages (ts, sender, body, ticket_id)
VALUES 
    ('2024-04-12 08:00:00', 'iit-gennaro', 'Message 1', 1),
    ('2024-04-12 09:00:00', 'imt-vincenzo', 'Message 2', 2),
    ('2024-04-12 10:00:00', 'iit-gennaro', 'Message 3', 3),
    ('2024-04-12 11:00:00', 'imt-vincenzo', 'Message 4', 4),
    ('2024-04-12 12:00:00', 'iit-gennaro', 'Message 5', 5),
    ('2024-04-13 08:00:00', 'imt-vincenzo', 'Message 1', 1),
    ('2024-04-13 09:00:00', 'iit-gennaro', 'Message 2', 2),
    ('2024-04-13 10:00:00', 'imt-vincenzo', 'Message 3', 3),
    ('2024-04-13 11:00:00', 'iit-gennaro', 'Message 4', 4),
    ('2024-04-13 12:00:00', 'imt-vincenzo', 'Message 5', 5);

INSERT INTO installation_documents (ts, patient_id, file_name, file_type, file_content)
VALUES
('2024-04-14 09:00:00', 'h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'mappa_casa', 'PNG', '\x89504E470D0A1A0A0000000D4948445200000008000000080806000000C40FBE8B000000017352474200AECE1CE90000000467414D410000B18F0BFC61050000000970485973000019D6000019D60118D1CAED0000006449444154285363F88F04167B2E81B21080A993518C011F602AFFFF8A01A4089BC2255E4B1950ACE860100563108059C704550C562DEDD90F66239BC602A5C120665B34502184FD747B21506121AA0218002964600061A023C1241480AC8148C200030300578C4B5BB3BD7F370000000049454E44AE426082'::bytea),
('2024-04-14 09:15:00', 'h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'scheda', 'PNG', '\x89504E470D0A1A0A0000000D4948445200000008000000080806000000C40FBE8B000000017352474200AECE1CE90000000467414D410000B18F0BFC61050000000970485973000019D6000019D60118D1CAED0000006049444154285363FC0F040C40A0BCC9174431DCF5DB0CA64160DB73390626281B0380244100AC00A61B0490D95E928F1898908D86198FAC08EE066400331E6C029885046092B9A7F5C134E3D667B218268074C2AC815B816C2C0C286FF26500000ED62B625A4E97820000000049454E44AE426082'::bytea),
('2024-04-14 09:30:00', 'ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', 'mappa_casa', 'PNG', '\x89504E470D0A1A0A0000000D4948445200000008000000080806000000C40FBE8B000000017352474200AECE1CE90000000467414D410000B18F0BFC61050000000970485973000019D6000019D60118D1CAED0000005549444154285363F80F05F61E67A02C040089B130008183E759100506C86C106081091CD86E0CA66100C6670419036601014C10D91446905D2006B220B24226300B08D0AD8001B02391014821412B4000622203030031983D3E39433C800000000049454E44AE426082'::bytea);



-- Populating the `installation_details` table
INSERT INTO installation_details (
    date_start,
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
('2024-04-14 09:00:00','zu4MPOSl3ohg4yLU8fRbdv8_Dsr5_ysa', '1-bedroom', 'Fiber optic', 'None', '1 dog', 'Occasional', 'iPhone 12', 'Refrigerator, Oven, Washing machine', 'None', 'Early riser, enjoys cooking', 'Patient prefers email communication over phone calls.'),
('2024-04-14 09:00:00','h7ZJchVHKAek6di7rcGQFl2B6grn_YDs', 'Studio', 'Cable', '1 roommate', 'No pets', 'Rare', 'Samsung Galaxy S20', 'Microwave, Coffee maker', 'Occasional connectivity issues reported', 'Frequent night owl, streaming movies', 'Patient has specific dietary requirements, vegetarian.'),
('2024-04-14 09:00:00','ehHOfOfoYF9z6fyQSrkWJhKQ3IlkrIsK', '2-bedroom', 'DSL', 'Family (2 adults, 2 children)', '1 cat', 'Frequent', 'Google Pixel 5', 'Dishwasher, Toaster, Blender', 'None', 'Family-oriented, busy lifestyle', 'Patient expresses interest in smart home devices.'),
('2024-04-14 09:00:00','V8IeQNz5OPr8PTAEMEU6VEzFdjnGTY3_', '1-bedroom', 'Fiber optic', 'None', '2 cats', 'Occasional', 'iPhone 11', 'Stove, TV, Iron', 'None', 'Patient enjoys gardening on weekends', 'None'),
('2024-04-14 09:00:00','5YIQzgtnQnHY7qZbe8QwPwYQ9dEIV9CF', 'Studio', 'Satellite', 'None', '1 dog, 1 cat', 'Frequent', 'OnePlus 9', 'Air conditioner, Heater', 'None', 'Patient prefers quiet environment, early sleeper', 'None');